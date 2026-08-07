import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  educationAreaLabel,
  formatClp,
  gradeAffinityBoost,
  gradeFocusCopy,
  hasEmployability,
  typeLabel,
} from "./catalog-format";

describe("catalog-format", () => {
  it("formats CLP in es-CL", () => {
    const s = formatClp(1_755_000);
    assert.match(s, /1/);
    assert.match(s, /755|755\.000|755,000|1\.755/);
  });

  it("maps education areas and types", () => {
    assert.equal(educationAreaLabel("salud"), "Salud");
    assert.equal(typeLabel("trade"), "Oficio / técnico");
    assert.equal(typeLabel("career"), "Carrera");
  });

  it("detects employability metrics", () => {
    assert.equal(
      hasEmployability({
        employabilityPct: 90,
        sourceCode: "X",
        sourceName: "Y",
        sourceUrl: "https://x",
        referenceYear: 2025,
        note: "n",
      }),
      true,
    );
    assert.equal(
      hasEmployability({
        sourceCode: "X",
        sourceName: "Y",
        sourceUrl: "https://x",
        referenceYear: 2025,
        note: "n",
      }),
      false,
    );
  });

  it("returns grade-specific focus copy", () => {
    assert.match(gradeFocusCopy(1).eyebrow, /1°/);
    assert.match(gradeFocusCopy(4).eyebrow, /4°/);
    assert.ok(gradeFocusCopy(3).body.length > 20);
  });

  it("boosts grade-aligned catalog items", () => {
    assert.equal(gradeAffinityBoost([3, 4], 3), 3);
    assert.equal(gradeAffinityBoost([1, 2], 4), 0);
    assert.equal(gradeAffinityBoost(null, 2), 0);
  });
});
