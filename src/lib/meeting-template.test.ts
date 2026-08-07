import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildMeetingTemplate } from "./meeting-template";
import { buildReportContent } from "./reports";

describe("buildMeetingTemplate", () => {
  it("builds mediation session when report pending", () => {
    const content = buildReportContent({
      studentName: "Sofía X",
      gradeLevel: 3,
      dimensions: { R: 20, I: 60, A: 40, S: 90, E: 30, C: 20 },
      topDimensions: ["S", "I", "A"],
    });
    const guide = buildMeetingTemplate({
      studentFirstName: "Sofía",
      gradeLevel: 3,
      caseloadStatus: "pending_review",
      reportContent: content,
    });
    assert.match(guide.title, /mediación|Mediación|Explorar/i);
    assert.ok(guide.blocks.length >= 3);
    const totalMin = guide.blocks.reduce((n, b) => n + b.minutes, 0);
    assert.ok(totalMin >= 15 && totalMin <= 35);
    assert.ok(guide.closing.length >= 1);
  });

  it("builds start session when no assessment", () => {
    const guide = buildMeetingTemplate({
      studentFirstName: "Mateo",
      gradeLevel: 1,
      caseloadStatus: "no_assessment",
    });
    assert.match(guide.title, /arranque|Arranque/i);
    assert.ok(guide.blocks.some((b) =>
      b.items.some((i) => /cuestionario|perfil/i.test(i)),
    ));
  });
});
