import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { reportStatusLabel, statusLabel } from "./caseload";

describe("caseload labels", () => {
  it("maps caseload statuses to Spanish labels", () => {
    assert.equal(statusLabel("pending_review"), "Informe por revisar");
    assert.equal(statusLabel("delivered"), "Informe entregado");
    assert.equal(statusLabel("no_assessment"), "Sin cuestionario");
  });

  it("formats report status", () => {
    assert.equal(reportStatusLabel(null), "Sin informe");
    assert.equal(reportStatusLabel("pending_review"), "pending review");
  });
});
