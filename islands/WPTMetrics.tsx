import { useEffect, useState } from "preact/hooks";
import { Activity, BarChart } from "lucide-preact";

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

  useEffect(() => {
    const url =
      "https://raw.githubusercontent.com/tryandromeda/andromeda/refs/heads/main/tests/metrics.json";

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch metrics: ${res.status}`);
        const data: WPTMetricsJson = await res.json();
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
    <div class="bg-surface0 rounded-2xl p-6 border border-surface1 hover:border-surface2 transition-colors">
      <h3 class="text-lg font-semibold text-text mb-4 flex items-center gap-2">
        <BarChart size={20} class="text-blue" />
        WPT Metrics
      </h3>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
      </div>

      <div>
        <h4 class="text-sm font-medium text-subtext0 mb-3">Suites</h4>
        <div class="space-y-3">
          {Object.entries(suites).map(([name, s]) => (
            <div
              class="bg-surface1 rounded-lg p-3 flex items-center justify-between"
              key={name}
            >
              <div>
                <div class="text-text font-medium">{name}</div>
                <div class="text-xs text-subtext1">{s.total_tests} tests</div>
              </div>

              <div class="flex items-center gap-4">
                <div class="text-sm text-green">Pass {s.pass}</div>
                <div class="text-sm text-red">Fail {s.fail}</div>
                <div class="text-sm text-subtext1">
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
