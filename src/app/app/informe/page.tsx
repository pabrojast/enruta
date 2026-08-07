import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  savedAlternatives,
  vocationalReports,
  type ReportContent,
} from "@/db/schema";
import { requireRole } from "@/lib/session";
import { getStudentByUserId } from "@/lib/students";
import { buildReportTldr } from "@/lib/reports";
import { DimensionChart } from "@/components/dimension-chart";
import { AlertBanner } from "@/components/alert-banner";
import { WaitingMode } from "@/components/waiting-mode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function InformePage() {
  const session = await requireRole(["student"]);
  const row = await getStudentByUserId(session.user.id);
  if (!row) redirect("/login");

  const [report] = await db
    .select()
    .from(vocationalReports)
    .where(eq(vocationalReports.studentId, row.student.id))
    .orderBy(desc(vocationalReports.createdAt))
    .limit(1);

  if (!report) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Informe vocacional</h1>
        <AlertBanner>
          Todavía no hay un informe. Completa el cuestionario para generar un
          borrador que revisará tu orientador/a.
        </AlertBanner>
        <Link href="/app/cuestionarios">
          <Button>Ir al cuestionario</Button>
        </Link>
      </div>
    );
  }

  if (report.status !== "delivered" && report.status !== "updated") {
    const saved = await db
      .select()
      .from(savedAlternatives)
      .where(eq(savedAlternatives.studentId, row.student.id));

    return (
      <WaitingMode
        checklist={{
          savedCount: saved.length,
          savedTarget: 3,
          hasExplored: saved.length > 0,
        }}
      />
    );
  }

  const content = report.content as ReportContent;
  const dims = (report.dimensionsSnapshot as Record<string, number>) ?? {};
  const tldr = buildReportTldr(content);

  const sections: { title: string; body: string | string[] }[] = [
    { title: "Introducción", body: content.introduction },
    { title: "Resumen del proceso", body: content.processSummary },
    { title: "Perfil general", body: content.generalProfile },
    { title: "Intereses predominantes", body: content.interests },
    { title: "Habilidades identificadas", body: content.skills },
    { title: "Valores y motivaciones", body: content.values },
    { title: "Fortalezas", body: content.strengths },
    { title: "Aspectos a explorar", body: content.toExplore },
    { title: "Rutas formativas relacionadas", body: content.routes },
    { title: "Oficios y áreas laborales", body: content.trades },
    { title: "Actividades recomendadas", body: content.activities },
    { title: "Preguntas para reflexionar", body: content.reflectionQuestions },
    { title: "Próximos pasos", body: content.nextSteps },
    { title: "Plan de acción preliminar", body: content.actionPlan },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tu informe vocacional</h1>
          <p className="text-white/60">
            Entregado el{" "}
            {report.deliveredAt
              ? new Date(report.deliveredAt).toLocaleDateString("es-CL")
              : "—"}
            . Resultados orientativos.
          </p>
        </div>
        <Badge className="border-neon-green/30 bg-neon-green/10 text-neon-green">
          Validado por un profesional
        </Badge>
      </div>

      <AlertBanner tone="warn">{content.disclaimer}</AlertBanner>

      {/* TL;DR */}
      <Card className="border-neon-cyan/30 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-green/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-neon-cyan" aria-hidden />
            <CardTitle className="text-base">En 30 segundos</CardTitle>
          </div>
          <p className="text-sm text-white/55">
            Lo esencial para conversar hoy. El detalle completo está más abajo.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <TldrColumn title="Fortalezas / perfil" items={tldr.strengths} />
          <TldrColumn title="Rutas a mirar" items={tldr.routes} />
          <TldrColumn title="Acciones concretas" items={tldr.actions} />
        </CardContent>
        <div className="flex flex-wrap gap-2 border-t border-white/10 px-5 py-4">
          <Link href="/app/explorar">
            <Button size="sm">
              Explorar alternativas
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </Link>
          <Link href="/app/proyecto-de-vida">
            <Button size="sm" variant="secondary">
              Proyecto de vida
            </Button>
          </Link>
          <a href="#informe-completo">
            <Button size="sm" variant="ghost">
              Ver informe completo
            </Button>
          </a>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mapa de intereses</CardTitle>
        </CardHeader>
        <CardContent>
          <DimensionChart dimensions={dims} />
        </CardContent>
      </Card>

      <div id="informe-completo" className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Informe completo</h2>
        {sections.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="text-base">{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-line text-sm leading-relaxed text-white/75">
              {Array.isArray(s.body) ? (
                <ul className="list-disc space-y-1 pl-5">
                  {s.body.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                s.body
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <a href="/api/pdf/informe">
          <Button variant="outline">Descargar PDF</Button>
        </a>
        <Link href="/app/explorar">
          <Button>Explorar alternativas relacionadas</Button>
        </Link>
      </div>
    </div>
  );
}

function TldrColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-neon-cyan">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-sm leading-relaxed text-white/80"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-green" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
