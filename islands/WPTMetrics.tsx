import { Activity, BarChart } from "lucide-preact";
import { useEffect, useState } from "preact/hooks";

interface WPTSuite {
  total_tests: number;
  pass: number;
  fail: number;
  crash: number;
  timeout: number;
  skip: number;
  pass_rate: number;
}

interface WPTMetricsJson {
  project: string;
  version: string;
  wpt: {
    overall: WPTSuite & { pass_rate: number };
    suites: Record<string, WPTSuite>;
    trend?: {
      pass_rate_change?: number;
      tests_change?: number;
      performance_change?: number;
    };
  };
}

export default function WPTMetrics() {
  const [metrics, setMetrics] = useState<WPTMetricsJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<
    {
      lastModified?: string | null;
      etag?: string | null;
      rawUrl?: string;
      commitUrl?: string;
    } | null
  >(null);

  useEffect(() => {
    const url =
      "https://raw.githubusercontent.com/tryandromeda/andromeda/refs/heads/main/tests/metrics.json";

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error(`Failed to fetch metrics: ${res.status}`);
        const data: WPTMetricsJson = await res.json();
        const lastModified = res.headers.get("last-modified");
        const etag = res.headers.get("etag");
        const commitUrl =
          "https://github.com/tryandromeda/andromeda/blob/main/tests/metrics.json";
        setMeta({ lastModified, etag, rawUrl: url, commitUrl });
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching WPT metrics:", err);
        setError(err instanceof Error ? err.message : "Failed to load metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const formatPercent = (n: number) => `${n.toFixed(1)}%`;

  if (loading) {
    return (
      <div class="bg-surface0 rounded-2xl p-6 border border-surface1">
        <div class="animate-pulse">
          <div class="h-6 bg-surface1 rounded mb-4 w-40"></div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} class="text-center">
                <div class="h-8 bg-surface1 rounded mb-2"></div>
                <div class="h-4 bg-surface1 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div class="bg-surface0 rounded-2xl p-6 border border-surface1">
        <div class="text-center text-subtext1">
          <Activity class="mx-auto mb-2 opacity-50" size={28} />
          <p class="text-sm">WPT metrics temporarily unavailable</p>
          {error && <p class="text-xs text-subtext2 mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  const overall = metrics.wpt.overall;
  const suites = metrics.wpt.suites;

  return (
    <div class="bg-surface0 rounded-2xl p-4 md:p-6 border border-surface1 hover:border-surface2 transition-colors">
      <h3 class="text-lg font-semibold text-text mb-2 flex items-center gap-2">
        <BarChart size={20} class="text-blue" />
        WPT Metrics
      </h3>

      <div class="text-xs text-subtext1 mb-4">
        <div>
          Source: {metrics.project} v{metrics.version} —
          {meta?.rawUrl
            ? (
              <a
                class="text-blue-400 ml-1 hover:underline"
                href={meta.rawUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                raw metrics.json
              </a>
            )
            : <span class="ml-1">raw metrics.json</span>}
        </div>
        <div class="mt-1">
          Last updated: {meta?.lastModified ?? "unknown"}
        </div>
        <div class="mt-2 text-xxs text-subtext2">
          Note: These numbers are produced by the project's test harness and may
          not be directly comparable across different runtimes or hardware. See
          the raw data and test harness for details and reproduction steps.
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-yellow mb-1">
            {overall.total_tests}
          </div>
          <div class="text-xs text-subtext1">Total Tests</div>
        </div>

        <div class="text-center">
          <div class="text-2xl font-bold text-green mb-1">{overall.pass}</div>
          <div class="text-xs text-subtext1">Pass</div>
        </div>

        <div class="text-center">
          <div class="text-2xl font-bold text-red mb-1">{overall.fail}</div>
          <div class="text-xs text-subtext1">Fail</div>
        </div>

        <div class="text-center">
          <div class="text-2xl font-bold text-mauve mb-1">
            {formatPercent(overall.pass_rate)}
          </div>
          <div class="text-xs text-subtext1">Pass Rate</div>
        </div>

        <div class="text-center">
          <div class="text-2xl font-bold text-peach mb-1">{overall.crash}</div>
          <div class="text-xs text-subtext1">Crash</div>
        </div>

        <div class="text-center">
          <div class="text-2xl font-bold text-blue mb-1">{overall.timeout}</div>
          <div class="text-xs text-subtext1">Timeout</div>
        </div>

        <div class="text-center">
          <div class="text-2xl font-bold text-subtext0 mb-1">
            {overall.skip}
          </div>
          <div class="text-xs text-subtext1">Skip</div>
        </div>
      </div>

      <div>
        <h4 class="text-sm font-medium text-subtext0 mb-3">Suites</h4>
        <div class="space-y-3">
          {Object.entries(suites).map(([name, s]) => (
            <div
              class="bg-surface1 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2"
              key={name}
            >
              <div>
                <div class="text-text font-medium">{name}</div>
                <div class="text-xs text-subtext1">{s.total_tests} tests</div>
              </div>

              <div class="flex items-center gap-2 md:gap-3 flex-wrap">
                <div class="text-xs md:text-sm text-green">Pass {s.pass}</div>
                <div class="text-xs md:text-sm text-red">Fail {s.fail}</div>
                <div class="text-xs md:text-sm text-peach">Crash {s.crash}</div>
                <div class="text-xs md:text-sm text-blue">
                  Timeout {s.timeout}
                </div>
                <div class="text-xs md:text-sm text-subtext0">
                  Skip {s.skip}
                </div>
                <div class="text-xs md:text-sm text-subtext1 font-medium">
                  {formatPercent(s.pass_rate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
