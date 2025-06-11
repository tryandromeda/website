import { useState, useEffect } from "preact/hooks";
import { Star, GitFork } from "lucide-preact";

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
}

interface CompactGitHubStatsProps {
  className?: string;
  showForks?: boolean;
}

export default function CompactGitHubStats({ className = "", showForks = false }: CompactGitHubStatsProps) {
  const [repoData, setRepoData] = useState<GitHubRepo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/tryandromeda/andromeda');
        if (response.ok) {
          const data = await response.json();
          setRepoData(data);
        }
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  if (loading || !repoData) {
    return (
      <div class={`flex items-center gap-2 ${className}`}>
        <div class="animate-pulse bg-surface1 rounded px-2 py-1 w-16 h-6"></div>
        {showForks && <div class="animate-pulse bg-surface1 rounded px-2 py-1 w-16 h-6"></div>}
      </div>
    );
  }

  return (
    <div class={`flex items-center gap-2 ${className}`}>
      <a
        href="https://github.com/tryandromeda/andromeda"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1 bg-surface0 hover:bg-surface1 border border-surface1 hover:border-surface2 rounded-lg px-3 py-1.5 text-sm font-medium text-subtext1 hover:text-text transition-all duration-200"
        title={`${repoData.stargazers_count} GitHub stars`}
      >
        <Star size={14} class="text-yellow" />
        <span>{formatNumber(repoData.stargazers_count)}</span>
      </a>
      
      {showForks && (
        <a
          href="https://github.com/tryandromeda/andromeda/forks"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 bg-surface0 hover:bg-surface1 border border-surface1 hover:border-surface2 rounded-lg px-3 py-1.5 text-sm font-medium text-subtext1 hover:text-text transition-all duration-200"
          title={`${repoData.forks_count} GitHub forks`}
        >
          <GitFork size={14} class="text-blue" />
          <span>{formatNumber(repoData.forks_count)}</span>
        </a>
      )}
    </div>
  );
}
