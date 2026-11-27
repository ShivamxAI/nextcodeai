import { describe, it, expect } from "vitest";
import {
  filterResults,
  resultsCSV,
  sharedLanguageComparison,
  type Result,
} from "@/data/report";
import results from "@/data/results.json";
import { snippets } from "@/data/content";

const sample: Result = {
  run: "fixture",
  provider: "Gemini",
  model: "test",
  language: "Python",
  task: "line",
  n: 2,
  errors: 0,
  exact_match: 0.5,
  exact_ci_low: 0.1,
  exact_ci_high: 0.9,
  first_line_match: 0.5,
  edit_similarity: 0.7,
  empty_rate: 0,
  latency_p50_ms: 100,
  latency_p95_ms: 200,
};

describe("report data rules", () => {
  it("uses the supplied local Go line result", () => {
    const row = results.find(
      (result) =>
        result.provider === "Local" && result.language === "Go" && result.task === "line",
    );
    expect(row).toMatchObject({
      n: 50,
      exact_match: 0.4,
      exact_ci_low: 0.28,
      exact_ci_high: 0.54,
      edit_similarity: 0.731,
      latency_p50_ms: 3114,
      latency_p95_ms: 4340,
    });
  });

  it("uses the supplied Gemini Go line result", () => {
    const row = results.find(
      (result) =>
        result.provider === "Gemini" && result.language === "Go" && result.task === "line",
    );
    expect(row).toMatchObject({
      n: 49,
      errors: 1,
      exact_match: 0.531,
      exact_ci_low: 0.39,
      exact_ci_high: 0.66,
      edit_similarity: 0.778,
      latency_p50_ms: 1496,
      latency_p95_ms: 6466,
    });
  });

  it("excludes unusable Gemini PHP rows", () => {
    expect(results.some((row) => row.provider === "Gemini" && row.language === "PHP")).toBe(false);
  });

  it("derives five-language exact-match counts from the supplied rows", () => {
    const comparisons = sharedLanguageComparison(results);
    const line = comparisons.find((comparison) => comparison.task === "line");
    const block = comparisons.find((comparison) => comparison.task === "block");
    expect(line?.summaries).toEqual([
      { provider: "Local", n: 250, successes: 74, exactMatch: 74 / 250, editSimilarity: 0.5984 },
      { provider: "Gemini", n: 248, successes: 96, exactMatch: 96 / 248, editSimilarity: 0.6854 },
    ]);
    expect(block?.summaries).toEqual([
      { provider: "Local", n: 250, successes: 4, exactMatch: 4 / 250, editSimilarity: 0.4092 },
      { provider: "Gemini", n: 249, successes: 14, exactMatch: 14 / 249, editSimilarity: 0.4624 },
    ]);
  });

  it("filters provider independently", () =>
    expect(filterResults([sample], { provider: "Claude", task: "", language: "" })).toEqual([]));
  it("filters task independently", () =>
    expect(filterResults([sample], { provider: "", task: "block", language: "" })).toEqual([]));
  it("filters language independently", () =>
    expect(filterResults([sample], { provider: "", task: "", language: "Go" })).toEqual([]));
  it("exports actual values with CSV quoting", () =>
    expect(resultsCSV([{ ...sample, model: 'test,"quoted"' }])).toContain('"test,""quoted"""'));
  it("provides 2 or 3 canned snippets for all six requested languages", () => {
    expect(Object.keys(snippets).sort()).toEqual([
      "Go",
      "Java",
      "JavaScript",
      "PHP",
      "Python",
      "Ruby",
    ]);
    for (const language of Object.keys(snippets)) {
      const items = snippets[language];
      expect(items?.length).toBeGreaterThanOrEqual(2);
      expect(items?.length).toBeLessThanOrEqual(3);
    }
  });
});
