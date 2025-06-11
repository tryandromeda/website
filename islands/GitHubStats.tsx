import { useEffect, useState } from "preact/hooks";
import { Activity, GitFork, Star, Users } from "lucide-preact";

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  subscribers_count: number;
  open_issues_count: number;
  updated_at: string;
}

interface GitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface GitHubRelease {
  tag_name: string;
  published_at: string;
  download_count?: number;
}

export default function GitHubStats() {
  const [repoData, setRepoData] = useState<GitHubRepo | null>(null);
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);

        const repoResponse = await fetch(
          "https://api.github.com/repos/tryandromeda/andromeda",
        );
        if (!repoResponse.ok) throw new Error("Failed to fetch repo data");
        const repo = await repoResponse.json();
        setRepoData(repo);

        const contributorsResponse = await fetch(
          "https://api.github.com/repos/tryandromeda/andromeda/contributors?per_page=6",
        );
        if (!contributorsResponse.ok) {
          throw new Error("Failed to fetch contributors");
        }
        const contributorsData = await contributorsResponse.json();
        setContributors(contributorsData); // Fetch latest release
        const releaseResponse = await fetch(
          "https://api.github.com/repos/tryandromeda/andromeda/releases/latest",
        );
        if (releaseResponse.ok) {
          const release = await releaseResponse.json();

          const downloadCount = release.assets?.reduce(
            (total: number, asset: { download_count?: number }) =>
              total + (asset.download_count || 0),
            0,
          ) || 0;

          setLatestRelease({
            tag_name: release.tag_name,
            published_at: release.published_at,
            download_count: downloadCount,
          });
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load GitHub data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div class="bg-surface0 rounded-2xl p-6 border border-surface1">
        <div class="animate-pulse">
          <div class="h-6 bg-surface1 rounded mb-4 w-48"></div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} class="text-center">
                <div class="h-8 bg-surface1 rounded mb-2"></div>
                <div class="h-4 bg-surface1 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
          <div class="h-4 bg-surface1 rounded mb-2"></div>
          <div class="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} class="w-8 h-8 bg-surface1 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div class="bg-surface0 rounded-2xl p-6 border border-surface1">
        <div class="text-center text-subtext1">
          <Activity class="mx-auto mb-2 opacity-50" size={32} />
          <p class="text-sm">GitHub stats temporarily unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div class="bg-surface0 rounded-2xl p-6 border border-surface1 hover:border-surface2 transition-colors">
      <h3 class="text-lg font-semibold text-text mb-4 flex items-center gap-2">
        <Activity size={20} class="text-blue" />
        Community Stats
      </h3>

      {/* Main Stats Grid */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="text-center">
          <div class="flex items-center justify-center gap-1 text-2xl font-bold text-yellow mb-1">
            <Star size={20} />
            {formatNumber(repoData?.stargazers_count || 0)}
          </div>
          <div class="text-xs text-subtext1">Stars</div>
        </div>

        <div class="text-center">
          <div class="flex items-center justify-center gap-1 text-2xl font-bold text-blue mb-1">
            <GitFork size={20} />
            {formatNumber(repoData?.forks_count || 0)}
          </div>
          <div class="text-xs text-subtext1">Forks</div>
        </div>

        <div class="text-center">
          <div class="flex items-center justify-center gap-1 text-2xl font-bold text-green mb-1">
            <Users size={20} />
            {formatNumber(repoData?.subscribers_count || 0)}
          </div>
          <div class="text-xs text-subtext1">Watchers</div>
        </div>

        <div class="text-center">
          <div class="text-2xl font-bold text-mauve mb-1">
            {latestRelease?.download_count
              ? formatNumber(latestRelease.download_count)
              : "—"}
          </div>
          <div class="text-xs text-subtext1">Downloads</div>
        </div>
      </div>

      {/* Latest Release Info */}
      {latestRelease && (
        <div class="bg-surface1 rounded-lg p-3 mb-4">
          <div class="flex items-center justify-between text-sm">
            <span class="text-text font-medium">
              Latest: {latestRelease.tag_name}
            </span>
            <span class="text-subtext1">
              {formatDate(latestRelease.published_at)}
            </span>
          </div>
        </div>
      )}

      {/* Contributors */}
      <div>
        <h4 class="text-sm font-medium text-subtext0 mb-3">Top Contributors</h4>
        <div class="flex gap-2 overflow-x-auto">
          {contributors.map((contributor) => (
            <a
              key={contributor.login}
              href={contributor.html_url}
              target="_blank"
              rel="noopener noreferrer"
              class="flex-shrink-0 group"
              title={`${contributor.login} (${contributor.contributions} contributions)`}
            >
              <img
                src={contributor.avatar_url}
                alt={contributor.login}
                class="w-8 h-8 rounded-full border-2 border-surface1 group-hover:border-blue transition-colors"
              />
            </a>
          ))}
          <a
            href="https://github.com/tryandromeda/andromeda/graphs/contributors"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-shrink-0 w-8 h-8 rounded-full border-2 border-surface1 bg-surface2 hover:border-blue transition-colors flex items-center justify-center text-subtext1 hover:text-blue text-xs"
            title="View all contributors"
          >
            +
          </a>
        </div>
      </div>

      {/* Last Updated */}
      {repoData?.updated_at && (
        <div class="mt-4 pt-3 border-t border-surface1">
          <p class="text-xs text-subtext1 text-center">
            Last updated {formatDate(repoData.updated_at)}
          </p>
        </div>
      )}
    </div>
  );
}
