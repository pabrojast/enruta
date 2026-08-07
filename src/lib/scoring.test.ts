import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  affinityScore,
  computeDimensionScores,
  detectFlags,
} from "./scoring";

describe("computeDimensionScores", () => {
  it("normalizes top dimension to 100", () => {
    const { dimensions, topDimensions } = computeDimensionScores([
      { questionId: "1", optionScores: { R: 3 }, likertValue: 5 },
      { questionId: "2", optionScores: { R: 3 }, likertValue: 5 },
      { questionId: "3", optionScores: { S: 2 }, likertValue: 3 },
    ]);
    assert.equal(dimensions.R, 100);
    assert.equal(topDimensions[0], "R");
    assert.ok(dimensions.S < dimensions.R);
  });
});

describe("affinityScore", () => {
  it("returns high score for similar profiles", () => {
    const { score, reasons } = affinityScore(
      { R: 90, I: 20, A: 10, S: 30, E: 20, C: 15 },
      { R: 80, I: 25, A: 10, S: 20, E: 15, C: 10 },
    );
    assert.ok(score >= 80);
    assert.ok(reasons.length >= 1);
  });

  it("returns lower score for opposite profiles", () => {
    const similar = affinityScore(
      { R: 90, I: 10, A: 10, S: 10, E: 10, C: 10 },
      { R: 90, I: 10, A: 10, S: 10, E: 10, C: 10 },
    );
    const opposite = affinityScore(
      { R: 90, I: 10, A: 10, S: 10, E: 10, C: 10 },
      { R: 10, I: 10, A: 10, S: 90, E: 10, C: 10 },
    );
    assert.ok(similar.score > opposite.score);
  });
});

describe("detectFlags", () => {
  it("flags incomplete answers", () => {
    assert.deepEqual(detectFlags(5, 10), ["incomplete"]);
    assert.ok(detectFlags(2, 10).includes("insufficient_data"));
    assert.deepEqual(detectFlags(10, 10), []);
  });
});
