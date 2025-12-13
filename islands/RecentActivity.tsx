import { GitCommit, MessageCircle, Tag } from "lucide-preact";
import { useEffect, useState } from "preact/hooks";
// import { motion } from "motion/react"

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
  author?: {
    login: string;
    avatar_url: string;
  };
}

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
}

export default function RecentActivity() {
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const commitsResponse = await fetch(
          "https://api.github.com/repos/tryandromeda/andromeda/commits?per_page=3",
        );
        if (commitsResponse.ok) {
          const commitsData = await commitsResponse.json();
          setCommits(commitsData);
        }

        const releasesResponse = await fetch(
          "https://api.github.com/repos/tryandromeda/andromeda/releases?per_page=2",
        );
        if (releasesResponse.ok) {
          const releasesData = await releasesResponse.json();
          setReleases(releasesData);
        }
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
  };

  const truncateMessage = (message: string, maxLength: number = 60): string => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength).trim() + "...";
  };

  if (loading) {
    return (
      <div class="bg-surface0 rounded-2xl p-6 border border-surface1">
        <div class="animate-pulse">
          <div class="h-6 bg-surface1 rounded mb-4 w-40"></div>
          <div class="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} class="flex items-center gap-3">
                <div class="w-8 h-8 bg-surface1 rounded-full flex-shrink-0">
                </div>
                <div class="flex-1">
                  <div class="h-4 bg-surface1 rounded mb-1"></div>
                  <div class="h-3 bg-surface1 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activities = [
    ...commits.map((commit) => ({
      type: "commit" as const,
      id: commit.sha,
      title: truncateMessage(commit.commit.message.split("\n")[0]),
      author: commit.author?.login || commit.commit.author.name,
      avatar: commit.author?.avatar_url,
      date: commit.commit.author.date,
      url: commit.html_url,
    })),
    ...releases.map((release) => ({
      type: "release" as const,
      id: release.tag_name,
      title: release.name || release.tag_name,
      author: "Release",
      avatar: null,
      date: release.published_at,
      url: release.html_url,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div class="bg-surface0 rounded-2xl p-6 border border-surface1 hover:border-surface2 transition-colors">
      <h3 class="text-lg font-semibold text-text mb-4 flex items-center gap-2">
        <MessageCircle size={20} class="text-green" />
        Recent Activity
      </h3>

      <div class="space-y-3">
        {activities.length > 0
          ? activities.map((activity) => (
            <a
              key={activity.id}
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-surface1 transition-colors group recent-activity-fadein"
            >
              <div class="flex-shrink-0 group-hover:scale-icon transition-transform duration-200">
                {activity.type === "commit"
                  ? (
                    <div class="w-8 h-8 rounded-full bg-blue/20 flex items-center justify-center">
                      <GitCommit size={16} class="text-blue" />
                    </div>
                  )
                  : (
                    <div class="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center">
                      <Tag size={16} class="text-green" />
                    </div>
                  )}
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-text group-hover:text-blue transition-colors truncate">
                  {activity.title}
                </p>
                <div class="flex items-center gap-2 text-xs text-subtext1">
                  <span>{activity.author}</span>
                  <span>•</span>
                  <span>{formatDate(activity.date)}</span>
                </div>
              </div>
            </a>
          ))
          : (
            <div class="text-center py-8 text-subtext1">
              <MessageCircle class="mx-auto mb-2 opacity-50" size={32} />
              <p class="text-sm">No recent activity</p>
            </div>
          )}
      </div>

      <div class="mt-4 pt-3 border-t border-surface1">
        <a
          href="https://github.com/tryandromeda/andromeda/activity"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-blue hover:text-blue/80 transition-colors"
        >
          View all activity on GitHub →
        </a>
      </div>
    </div>
  );
}
