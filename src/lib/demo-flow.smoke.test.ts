/**
 * Smoke del flujo demo contra PostgreSQL (si DATABASE_URL responde).
 * No es un E2E de browser: valida integridad de datos del seed y el loop
 * estudiante → informe → catálogo con métricas → caseload pro.
 */
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import "dotenv/config";

const hasDb = Boolean(process.env.DATABASE_URL);

describe("demo flow smoke (DB)", { skip: !hasDb }, () => {
  let db: typeof import("@/db").db;
  let schema: typeof import("@/db/schema");
  let eq: typeof import("drizzle-orm").eq;
  let affinityScore: typeof import("@/lib/scoring").affinityScore;
  let buildReportTldr: typeof import("@/lib/reports").buildReportTldr;
  let loadCaseload: typeof import("@/lib/caseload").loadCaseload;

  before(async () => {
    ({ db } = await import("@/db"));
    schema = await import("@/db/schema");
    ({ eq } = await import("drizzle-orm"));
    ({ affinityScore } = await import("@/lib/scoring"));
    ({ buildReportTldr } = await import("@/lib/reports"));
    ({ loadCaseload } = await import("@/lib/caseload"));
  });

  after(async () => {
    // postgres.js pool may keep process alive
    try {
      const { client } = await import("@/db");
      await client.end({ timeout: 2 });
    } catch {
      // ignore
    }
  });

  it("has demo student Sofía with school and profile", async () => {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, "sofia.estudiante@demo.cl"))
      .limit(1);
    assert.ok(user, "Sofía debe existir (pnpm db:seed)");
    assert.equal(user.role, "student");

    const [student] = await db
      .select()
      .from(schema.students)
      .where(eq(schema.students.userId, user.id))
      .limit(1);
    assert.ok(student);
    assert.ok(student.schoolId);
    assert.ok(student.gradeLevel >= 1 && student.gradeLevel <= 4);
  });

  it("has counselor and vocational reports in demo school", async () => {
    const [counselor] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, "orientador@losandes.cl"))
      .limit(1);
    assert.ok(counselor, "Orientadora demo debe existir");

    const reports = await db.select().from(schema.vocationalReports);
    if (reports.length === 0) {
      console.log(
        "# hint: sin vocational_reports — corre `pnpm db:ensure-reports` o `pnpm db:seed`",
      );
    }
    assert.ok(
      reports.length >= 1,
      "Se espera al menos un informe demo (pnpm db:ensure-reports)",
    );
  });

  it("catalog items include chile_metrics with sources for key careers", async () => {
    const items = await db
      .select()
      .from(schema.catalogItems)
      .where(eq(schema.catalogItems.isActive, true));
    assert.ok(items.length >= 10);

    const enfermeria = items.find((i) => i.slug === "enfermeria");
    assert.ok(enfermeria, "Ítem enfermería");
    const metrics = enfermeria.chileMetrics as {
      employabilityPct?: number;
      sourceCode?: string;
      sourceUrl?: string;
    } | null;
    assert.ok(metrics?.employabilityPct && metrics.employabilityPct > 50);
    assert.ok(metrics?.sourceCode);
    assert.ok(metrics?.sourceUrl?.includes("http"));
  });

  it("affinity ranks catalog for a social-heavy profile", async () => {
    const items = await db
      .select()
      .from(schema.catalogItems)
      .where(eq(schema.catalogItems.isActive, true));
    const studentDims = { R: 20, I: 50, A: 30, S: 95, E: 30, C: 25 };
    const ranked = items
      .map((item) => ({
        slug: item.slug,
        ...affinityScore(
          studentDims,
          (item.dimensions as Record<string, number>) ?? {},
        ),
      }))
      .sort((a, b) => b.score - a.score);

    assert.ok(ranked[0].score >= ranked[ranked.length - 1].score);
    assert.ok(ranked[0].reasons.length >= 1);
    // High S should prefer social-ish careers near the top half
    const topSlugs = ranked.slice(0, 5).map((r) => r.slug);
    const socialish = [
      "psicologia",
      "enfermeria",
      "pedagogia-en-educacion-media",
      "trabajo-social",
      "tecnico-a-en-enfermeria",
    ];
    assert.ok(
      topSlugs.some((s) => socialish.includes(s)),
      `expected social career in top 5, got ${topSlugs.join(", ")}`,
    );
  });

  it("reports with content produce a non-empty TL;DR (or unit path)", async () => {
    const any = await db.select().from(schema.vocationalReports).limit(5);
    const withContent = any.find((r) => r.content);
    if (!withContent?.content) {
      // Fallback: pure function path when seed has no reports
      const { buildReportContent } = await import("@/lib/reports");
      const content = buildReportContent({
        studentName: "Sofía Demo",
        gradeLevel: 3,
        dimensions: { R: 20, I: 60, A: 40, S: 90, E: 30, C: 25 },
        topDimensions: ["S", "I", "A"],
        strengthsSummary: "Empatía y trabajo en equipo",
      });
      const tldr = buildReportTldr(content);
      assert.ok(tldr.actions.length >= 1);
      assert.ok(tldr.strengths.length >= 1);
      return;
    }
    const tldr = buildReportTldr(
      withContent.content as import("@/db/schema").ReportContent,
    );
    assert.ok(
      tldr.strengths.length + tldr.routes.length + tldr.actions.length >= 3,
    );
  });

  it("loadCaseload returns rows for counselor school", async () => {
    const [counselor] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, "orientador@losandes.cl"))
      .limit(1);
    assert.ok(counselor);

    const rows = await loadCaseload({
      userId: counselor.id,
      role: counselor.role,
      schoolId: counselor.schoolId,
    });
    assert.ok(rows.length >= 1);
    assert.ok(rows.every((r) => r.fullName && r.studentId));
    assert.ok(
      rows.some(
        (r) =>
          r.caseloadStatus === "pending_review" ||
          r.caseloadStatus === "delivered" ||
          r.caseloadStatus === "no_assessment" ||
          r.caseloadStatus === "in_progress" ||
          r.caseloadStatus === "other",
      ),
    );
  });

  it("public data sources are seeded", async () => {
    const sources = await db.select().from(schema.publicDataSources);
    const codes = sources.map((s) => s.code);
    assert.ok(codes.includes("SIES_MIFUTURO") || codes.includes("INE_ENE"));
  });
});
