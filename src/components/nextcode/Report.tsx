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
import { Download, FlaskConical, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { content } from "@/data/content";
import rawResults from "@/data/results.json";
import { columns, filterResults, resultsCSV, type Result } from "@/data/report";
const results: Result[] = rawResults;
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
        const x = a[sort.key],
          y = b[sort.key];
        return (
          (typeof x === "number" && typeof y === "number"
            ? x - y
            : String(x).localeCompare(String(y))) * (sort.ascending ? 1 : -1)
        );
      }),
    [filters, sort],
  );
  const providers = [...new Set(rows.map((r) => r.provider))];
  const chartRows = [...new Set(rows.map((r) => `${r.language} / ${r.task} / ${r.run}`))].map(
    (label) => {
      const item: Record<string, unknown> = { label };
      providers.forEach((provider, i) => {
        const r = rows.find(
          (row) =>
            `${row.language} / ${row.task} / ${row.run}` === label && row.provider === provider,
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
    },
  );
  function download() {
    const url = URL.createObjectURL(
      new Blob([resultsCSV(rows)], { type: "text/csv;charset=utf-8;" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "nextcode-results.csv";
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
      {!rows.length ? (
        <div className="empty-report">{c.noMatches}</div>
      ) : (
        <>
          <h3 className="report-read-title">{c.chart}</h3>
          <div
            className="chart"
            role="img"
            aria-label="Grouped exact-match chart with 95% confidence intervals"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartRows}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <Tooltip
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
                      ["var(--primary)", "var(--code)", "var(--code-string)", "var(--ghost)"][i % 4]
                    }
                  >
                    <ErrorBar dataKey={`e${i}`} width={6} stroke="var(--foreground)" />
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
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
                        {key}
                        <ArrowUpDown />
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={`${r.run}-${r.provider}-${r.language}-${r.task}-${i}`}>
                    {columns.map((key) => (
                      <td key={key}>{r[key]}</td>
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
