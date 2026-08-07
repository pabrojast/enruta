import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEMO_QUESTIONS,
  applyOption,
  archetypeTitle,
  emptyScores,
  normalizeScores,
  suggestedRoutes,
  topDimensions,
} from "./demo-quiz";

describe("demo quiz", () => {
  it("has ten questions with four options each", () => {
    assert.equal(DEMO_QUESTIONS.length, 10);
    for (const q of DEMO_QUESTIONS) {
      assert.equal(q.options.length, 4);
      assert.ok(q.prompt.length > 10);
    }
  });

  it("accumulates scores and normalizes top to 100", () => {
    let scores = emptyScores();
    for (const q of DEMO_QUESTIONS) {
      scores = applyOption(scores, q.options[0]);
    }
    const normalized = normalizeScores(scores);
    const max = Math.max(...Object.values(normalized));
    assert.equal(max, 100);
    const top = topDimensions(normalized, 3);
    assert.equal(top.length, 3);
    assert.ok(normalized[top[0]] >= normalized[top[1]]);
  });

  it("returns archetype title and three suggested routes", () => {
    const title = archetypeTitle(["I", "R"]);
    assert.ok(title.length > 3);
    const routes = suggestedRoutes(["S", "I"]);
    assert.equal(routes.length, 3);
    assert.ok(routes[0].title.length > 3);
    assert.ok(routes[0].why.length > 3);
  });
});
