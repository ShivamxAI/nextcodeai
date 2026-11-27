import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ErrorBar,
  Legend,
} from "recharts";
import { Download, FlaskConical, ArrowUpDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { content } from "@/data/content";
import rawResults from "@/data/results.json";
import {
  columns,
  filterResults,
  resultsCSV,
  sharedLanguageComparison,
  type Result,
} from "@/data/report";

const results: Result[] = rawResults;
const percentColumns = new Set<keyof Result>([
  "exact_match",
  "exact_ci_low",
  "exact_ci_high",
  "first_line_match",
  "empty_rate",
]);

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatCell(key: keyof Result, value: Result[keyof Result]) {
  if (typeof value !== "number") return value;
  if (percentColumns.has(key)) return formatPercent(value);
  if (key === "edit_similarity") return value.toFixed(3);
  if (key === "latency_p50_ms" || key === "latency_p95_ms") {
    return `${value.toLocaleString("en-US")} ms`;
  }
  return value;
}

export default function Report() {
  const c = content.report;
  const [filters, setFilters] = useState({ provider: "", task: "", language: "" });
  const [sort, setSort] = useState<{ key: keyof Result; ascending: boolean }>({
    key: "provider",
    ascending: true,
  });
  const rows = useMemo(
    () =>
      filterResults(results, filters).sort((a, b) => {
        const x = a[sort.key];
        const y = b[sort.key];
        return (
          (typeof x === "number" && typeof y === "number"
            ? x - y
            : String(x).localeCompare(String(y))) * (sort.ascending ? 1 : -1)
        );
      }),
    [filters, sort],
  );
  const comparisons = useMemo(() => sharedLanguageComparison(results), []);
  const providers = [...new Set(rows.map((r) => r.provider))];
  const chartRows = [...new Set(rows.map((r) => `${r.language} · ${r.task}`))].map((label) => {
    const item: Record<string, unknown> = { label };
    providers.forEach((provider, i) => {
      const r = rows.find(
        (row) => `${row.language} · ${row.task}` === label && row.provider === provider,
      );
      if (r) {
        item[`p${i}`] = r.exact_match;
        item[`e${i}`] = [
          Math.max(0, r.exact_match - r.exact_ci_low),
          Math.max(0, r.exact_ci_high - r.exact_match),
        ];
      }
    });
    return item;
  });

  function download() {
    const url = URL.createObjectURL(
      new Blob([resultsCSV(rows)], { type: "text/csv;charset=utf-8;" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "nextcode-results-nov-2026-draft.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (!results.length)
    return (
      <div className="empty-report">
        <FlaskConical aria-hidden="true" />
        <h3>{c.emptyTitle}</h3>
        <p>{c.emptyDescription}</p>
        <small>{c.emptyBadge}</small>
      </div>
    );

  return (
    <div>
      <div className="report-status" role="note">
        <FlaskConical aria-hidden="true" />
        <div>
          <span className="section-label">{c.statusBadge}</span>
          <p>{c.status}</p>
        </div>
      </div>

      <h3 className="report-read-title">{c.comparisonTitle}</h3>
      <p className="report-comparison-description">{c.comparisonDescription}</p>
      <div className="report-summary">
        {comparisons.flatMap((comparison) => {
          const local = comparison.summaries.find((item) => item.provider === "Local");
          const gemini = comparison.summaries.find((item) => item.provider === "Gemini");
          if (!local || !gemini) return [];
          return [
            <article key={`${comparison.task}-exact`} className="report-stat">
              <span>{comparison.task === "line" ? c.line : c.block} · EXACT MATCH</span>
              <strong>
                {formatPercent(gemini.exactMatch)} <small>vs {formatPercent(local.exactMatch)}</small>
              </strong>
              <p>
                Gemini {gemini.successes}/{gemini.n} · Local {local.successes}/{local.n}
              </p>
            </article>,
            <article key={`${comparison.task}-edit`} className="report-stat">
              <span>{comparison.task === "line" ? c.line : c.block} · EDIT SIMILARITY</span>
              <strong>
                {gemini.editSimilarity.toFixed(2)} <small>vs {local.editSimilarity.toFixed(2)}</small>
              </strong>
              <p>{c.geminiVsLocal}</p>
            </article>,
          ];
        })}
      </div>
      <p className="report-inline-note">
        <AlertTriangle aria-hidden="true" />
        {c.comparisonNote}
      </p>
      <p className="report-inline-note">
        <AlertTriangle aria-hidden="true" />
        {c.phpNote}
      </p>

      <div className="report-filters">
        {(["provider", "task", "language"] as const).map((key) => (
          <label key={key}>
            {c[key]}
            <select
              aria-label={c[key]}
              value={filters[key]}
              onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
            >
              <option value="">{c.all}</option>
              {[...new Set(results.map((r) => r[key]))].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        ))}
        <Button variant="outline" onClick={download}>
          <Download />
          {c.download}
        </Button>
      </div>
      <p className="report-aggregate-note">{c.aggregateNote}</p>

      {!rows.length ? (
        <div className="empty-report">{c.noMatches}</div>
      ) : (
        <>
          <h3 className="report-read-title">{c.chart}</h3>
          <div className="chart-scroll">
            <div
              className="chart"
              role="img"
              aria-label="Grouped exact-match percentages with 95 percent confidence intervals"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartRows}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    interval={0}
                    height={62}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                  />
                  <YAxis
                    domain={[0, 1]}
                    tickFormatter={(value: number) => `${Math.round(value * 100)}%`}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(value) =>
                      typeof value === "number" ? formatPercent(value) : String(value)
                    }
                    contentStyle={{
                      background: "var(--card)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                  <Legend />
                  {providers.map((provider, i) => (
                    <Bar
                      key={provider}
                      dataKey={`p${i}`}
                      name={provider}
                      fill={
                        ["var(--primary)", "var(--code)", "var(--code-string)", "var(--ghost)"][
                          i % 4
                        ]
                      }
                    >
                      <ErrorBar dataKey={`e${i}`} width={6} stroke="var(--foreground)" />
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <h3 className="report-read-title">{c.table}</h3>
          <div className="report-table">
            <table>
              <thead>
                <tr>
                  {columns.map((key) => (
                    <th key={key}>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setSort({ key, ascending: sort.key === key ? !sort.ascending : true })
                        }
                      >
                        {key.replaceAll("_", " ")}
                        <ArrowUpDown />
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.run}-${r.provider}-${r.language}-${r.task}`}>
                    {columns.map((key) => (
                      <td key={key}>{formatCell(key, r[key])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
