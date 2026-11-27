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

export function sharedLanguageComparison(rows: Result[]) {
  const sharedLanguages = ["Go", "Java", "JavaScript", "Python", "Ruby"];
  return (["line", "block"] as const).map((task) => ({
    task,
    summaries: (["Local", "Gemini"] as const).map((provider) => {
      const selected = rows.filter(
        (row) =>
          row.provider === provider && row.task === task && sharedLanguages.includes(row.language),
      );
      const n = selected.reduce((total, row) => total + row.n, 0);
      const successes = selected.reduce(
        (total, row) => total + Math.round(row.exact_match * row.n),
        0,
      );
      const editSimilarity = selected.length
        ? selected.reduce((total, row) => total + row.edit_similarity, 0) / selected.length
        : 0;
      return {
        provider,
        n,
        successes,
        exactMatch: n ? successes / n : 0,
        editSimilarity,
      };
    }),
  }));
}

export function resultsCSV(rows: Result[]) {
  const escape = (v: unknown) => `"${String(v).replaceAll('"', '""')}"`;
  return [
    columns.join(","),
    ...rows.map((row) => columns.map((key) => escape(row[key])).join(",")),
  ].join("\r\n");
}
