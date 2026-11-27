import { describe, it, expect } from "vitest";
import { filterResults, resultsCSV, type Result } from "@/data/report";
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
  edit_sim_ci95: 0.2,
  empty_rate: 0,
  latency_p50_ms: 100,
  latency_p95_ms: 200,
};
describe("report data rules", () => {
  it("ships no invented benchmark results", () => expect(results).toEqual([]));
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
