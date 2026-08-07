import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildReportContent, buildReportTldr, dimensionBars } from "./reports";

describe("buildReportContent", () => {
  it("generates orientative language with top dimensions", () => {
    const content = buildReportContent({
      studentName: "Sofía Pérez",
      gradeLevel: 3,
      dimensions: { R: 20, I: 70, A: 40, S: 90, E: 30, C: 25 },
      topDimensions: ["S", "I", "A"],
      strengthsSummary: "Empatía y constancia",
    });

    assert.match(content.introduction, /Sofía/);
    assert.match(content.processSummary, /Etapa 3/);
    assert.ok(content.generalProfile.includes("Social") || content.generalProfile.includes("social") || content.generalProfile.length > 20);
    assert.equal(content.strengths, "Empatía y constancia");
    assert.ok(content.nextSteps.length >= 3);
    assert.match(content.disclaimer, /orientativos/i);
    assert.doesNotMatch(content.introduction, /debes estudiar/i);
  });

  it("uses stage labels by grade", () => {
    const e1 = buildReportContent({
      studentName: "A B",
      gradeLevel: 1,
      dimensions: { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 },
      topDimensions: ["R"],
    });
    assert.match(e1.processSummary, /Etapa 1/);

    const e4 = buildReportContent({
      studentName: "A B",
      gradeLevel: 4,
      dimensions: { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 },
      topDimensions: ["E"],
    });
    assert.match(e4.processSummary, /Etapa 4/);
  });
});

describe("buildReportTldr", () => {
  it("extracts strengths routes and actions from report content", () => {
    const content = buildReportContent({
      studentName: "Mateo",
      gradeLevel: 2,
      dimensions: { R: 80, I: 40, A: 20, S: 30, E: 20, C: 40 },
      topDimensions: ["R", "I", "C"],
      strengthsSummary: "Resolución práctica y trabajo en equipo en el taller.",
    });
    const tldr = buildReportTldr(content);
    assert.ok(tldr.strengths.length >= 1);
    assert.ok(tldr.routes.length >= 1);
    assert.ok(tldr.actions.length >= 1);
    assert.ok(tldr.actions.length <= 3);
  });

  it("falls back when sections are empty arrays", () => {
    const tldr = buildReportTldr({
      introduction: "x",
      processSummary: "x",
      generalProfile: "Perfil general de exploración con varias áreas de interés en desarrollo.",
      interests: "",
      skills: "",
      values: "",
      strengths: "",
      toExplore: "",
      routes: "",
      trades: "",
      activities: "",
      reflectionQuestions: [],
      nextSteps: [],
      actionPlan: "",
      disclaimer: "x",
    });
    assert.ok(tldr.strengths.length >= 1);
    assert.ok(tldr.routes.length >= 1);
    assert.ok(tldr.actions.length >= 1);
  });
});

describe("dimensionBars", () => {
  it("returns six RIASEC bars", () => {
    const bars = dimensionBars({ R: 10, I: 20, A: 30, S: 40, E: 50, C: 60 });
    assert.equal(bars.length, 6);
    assert.equal(bars.find((b) => b.code === "C")?.value, 60);
  });
});
