export type Result = {
  run: string;
  provider: string;
  model: string;
  language: string;
  task: string;
  n: number;
  errors: number;
  exact_match: number;
  exact_ci_low: number;
  exact_ci_high: number;
  first_line_match: number;
  edit_similarity: number;
  edit_sim_ci95: number;
  empty_rate: number;
  latency_p50_ms: number;
  latency_p95_ms: number;
};
export const columns: (keyof Result)[] = [
  "run",
  "provider",
  "model",
  "language",
  "task",
  "n",
  "errors",
  "exact_match",
  "exact_ci_low",
  "exact_ci_high",
  "first_line_match",
  "edit_similarity",
  "edit_sim_ci95",
  "empty_rate",
  "latency_p50_ms",
  "latency_p95_ms",
];
export function filterResults(
  rows: Result[],
  filters: { provider: string; task: string; language: string },
) {
  return rows.filter(
    (row) =>
      (!filters.provider || row.provider === filters.provider) &&
      (!filters.task || row.task === filters.task) &&
      (!filters.language || row.language === filters.language),
  );
}
export function resultsCSV(rows: Result[]) {
  const escape = (v: unknown) => `"${String(v).replaceAll('"', '""')}"`;
  return [
    columns.join(","),
    ...rows.map((row) => columns.map((key) => escape(row[key])).join(",")),
  ].join("\r\n");
}
