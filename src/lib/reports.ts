import { z } from "zod";
import { RIASEC, DIMENSION_ORDER, type DimensionCode } from "./dimensions";
import { aiEnabled, chatCompletion } from "./ai";
import type { ReportContent } from "@/db/schema";

const DISCLAIMER =
  "Estos resultados son orientativos y forman parte de un proceso de exploración. No constituyen un diagnóstico psicológico ni una decisión definitiva. Se recomienda conversar este informe con tu orientador o profesional del establecimiento. Tu camino puede cambiar y está bien.";

export function buildReportContent(params: {
  studentName: string;
  gradeLevel: number;
  dimensions: Record<string, number>;
  topDimensions: string[];
  interestsSummary?: string | null;
  strengthsSummary?: string | null;
}): ReportContent {
  const top = params.topDimensions.slice(0, 3) as DimensionCode[];
  const topLabels = top.map((c) => RIASEC[c]?.name ?? c).join(", ");
  const stage =
    params.gradeLevel <= 1
      ? "Etapa 1 — Conocerme"
      : params.gradeLevel === 2
        ? "Etapa 2 — Descubrir mis capacidades"
        : params.gradeLevel === 3
          ? "Etapa 3 — Explorar posibilidades reales"
          : "Etapa 4 — Construir mi proyecto de vida";

  const topDetail = top
    .map((c) => {
      const d = RIASEC[c];
      return `**${d.name} (${params.dimensions[c] ?? 0}%)**: ${d.description}`;
    })
    .join("\n\n");

  return {
    introduction: `Hola ${params.studentName.split(" ")[0]}. Este informe resume lo que has compartido hasta ahora en ENRUTA. No se trata de decirte qué “debes” ser, sino de ayudarte a mirar con más claridad tus intereses y posibles caminos.`,
    processSummary: `Has avanzado en ${stage}. Completaste un cuestionario de intereses y registraste información de tu perfil. El sistema procesó tus respuestas y generó este borrador para revisión profesional.`,
    generalProfile: `Tus respuestas muestran mayor afinidad con: ${topLabels || "varios perfiles en exploración"}. Esto no define una sola carrera ideal: abre un mapa de alternativas para conversar y seguir explorando.`,
    interests: topDetail || "Aún estamos conociendo tus intereses. Puedes actualizar tus respuestas cuando quieras.",
    skills:
      params.strengthsSummary?.trim() ||
      "En las próximas actividades podrás registrar habilidades prácticas, sociales y técnicas con más detalle.",
    values:
      "Valoras avanzar con información, explorar sin presión y construir un proyecto que tenga sentido para ti. Si hay expectativas familiares distintas a las tuyas, también es material de conversación con tu orientador.",
    strengths:
      params.strengthsSummary?.trim() ||
      "Tus fortalezas se irán consolidando con evidencias en tu portafolio (talleres, reflexiones y experiencias).",
    toExplore:
      "Te invitamos a explorar alternativas diversas —universitarias, técnicas, oficios, emprendimiento u otras rutas— y a comparar al menos dos o tres opciones antes de decidir.",
    routes:
      "Podrías explorar rutas formativas en universidades, IP, CFT, formación técnica, certificaciones, fuerzas armadas y de orden, o estudio y trabajo combinados, según la afinidad de tu perfil y tu contexto territorial.",
    trades:
      "También existen oficios y áreas laborales con alto valor práctico. Si tus intereses apuntan a lo concreto y aplicado, vale la pena conocerlos de cerca (visitas, charlas, experiencias).",
    activities:
      "Actividades recomendadas: revisar el explorador de ENRUTA, guardar alternativas, inscribirte en una charla o taller, y conversar estos resultados con tu orientador. No tienes que decidir todo hoy.",
    reflectionQuestions: [
      "¿Qué actividades de tu día a día te dan más energía?",
      "¿Qué parte de este perfil te representa y qué parte te sorprende?",
      "Si pudieras probar un “día en la vida” de una profesión, ¿cuál elegirías primero?",
      "¿Qué apoyo necesitas de tu familia o de tu colegio en este momento?",
    ],
    nextSteps: [
      "Revisar tu informe con un profesional de orientación.",
      "Explorar al menos tres alternativas en el catálogo.",
      "Guardar las que te hagan sentido y anotar dudas.",
      "Participar en una actividad real (charla, visita o taller) cuando esté disponible.",
    ],
    actionPlan: `Plan preliminar: 1) Conversar el informe. 2) Explorar alternativas relacionadas con ${topLabels || "tus intereses"}. 3) Registrar una reflexión en tu portafolio. 4) Definir un próximo paso concreto para los próximos 30 días.`,
    disclaimer: DISCLAIMER,
  };
}

// El modelo a veces entrega arreglos donde se espera texto: se normalizan a
// párrafos en vez de descartar la respuesta completa.
const aiField = z
  .union([z.string(), z.array(z.string())])
  .transform((v) => (Array.isArray(v) ? v.join("\n\n") : v).trim())
  .pipe(z.string().min(20).max(4000));
const aiReportSchema = z.object({
  introduction: aiField,
  processSummary: aiField,
  generalProfile: aiField,
  interests: aiField,
  skills: aiField,
  values: aiField,
  strengths: aiField,
  toExplore: aiField,
  routes: aiField,
  trades: aiField,
  activities: aiField,
  reflectionQuestions: z.array(z.string().trim().min(10).max(400)).min(3).max(6),
  nextSteps: z.array(z.string().trim().min(10).max(400)).min(3).max(6),
  actionPlan: aiField,
});

// El modelo puede envolver el JSON en fences ```json o anteponer razonamiento.
function extractJson(raw: string): string {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end <= start) {
    throw new Error("Respuesta del LLM sin objeto JSON");
  }
  return raw.slice(start, end + 1);
}

/**
 * Genera el borrador del informe con el LLM (DeepSeek vía gateway) y cae a la
 * plantilla determinística ante cualquier error. El disclaimer legal se fija
 * siempre desde el código y el informe sigue pasando por revisión profesional.
 */
export async function generateReportContent(
  params: Parameters<typeof buildReportContent>[0],
): Promise<{ content: ReportContent; generatedBy: "deepseek" | "system" }> {
  const fallback = () => ({
    content: buildReportContent(params),
    generatedBy: "system" as const,
  });
  if (!aiEnabled()) return fallback();

  const top = params.topDimensions.slice(0, 3) as DimensionCode[];
  const profile = top
    .map((c) => {
      const d = RIASEC[c];
      return `- ${d?.name ?? c} (${params.dimensions[c] ?? 0}%): ${d?.description ?? ""}`;
    })
    .join("\n");

  try {
    const raw = await chatCompletion({
      system: [
        "Eres orientador vocacional para estudiantes de enseñanza media en Chile.",
        "Redactas borradores de informes vocacionales cálidos, claros y NO diagnósticos,",
        "en español chileno neutro, tuteando al estudiante. Nunca prometes resultados",
        "ni indicas una única carrera 'correcta'; abres alternativas (universitarias,",
        "técnicas, oficios) y siempre invitas a conversar con el orientador del colegio.",
        "Respondes SOLO un objeto JSON con exactamente estas claves de texto",
        "(cada una UN string de 2-4 frases, nunca un arreglo):",
        "introduction, processSummary, generalProfile, interests, skills, values,",
        "strengths, toExplore, routes, trades, activities, actionPlan,",
        "y dos arreglos de strings: reflectionQuestions (3-6) y nextSteps (3-6).",
        "Sin markdown fuera de los valores, sin claves extra.",
      ].join(" "),
      user: [
        `Estudiante: ${params.studentName}, ${params.gradeLevel}° medio.`,
        `Perfil RIASEC (afinidad):\n${profile || "- aún en exploración"}`,
        `Intereses declarados: ${params.interestsSummary?.trim() || "no registrados"}`,
        `Fortalezas declaradas: ${params.strengthsSummary?.trim() || "no registradas"}`,
        "Genera el borrador del informe vocacional en JSON.",
      ].join("\n\n"),
      jsonMode: true,
    });
    const parsed = aiReportSchema.parse(JSON.parse(extractJson(raw)));
    return {
      content: { ...parsed, disclaimer: DISCLAIMER },
      generatedBy: "deepseek",
    };
  } catch (err) {
    console.error("generateReportContent: fallback determinístico:", err);
    return fallback();
  }
}

export function dimensionBars(dimensions: Record<string, number>) {
  return DIMENSION_ORDER.map((code) => ({
    code,
    name: RIASEC[code].name,
    value: dimensions[code] ?? 0,
  }));
}

function asBulletList(value: string | string[] | undefined, max: number): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((s) => s.trim()).filter(Boolean).slice(0, max);
  }
  const chunks = value
    .split(/\n+|(?<=\.)\s+/)
    .map((s) => s.replace(/^\*+\s*/, "").replace(/\*\*/g, "").trim())
    .filter((s) => s.length > 12);
  return chunks.slice(0, max);
}

/** Short “30 second” summary for the delivered report UI. */
export function buildReportTldr(content: ReportContent): {
  strengths: string[];
  routes: string[];
  actions: string[];
} {
  const strengths = asBulletList(content.strengths, 3);
  if (strengths.length === 0) {
    strengths.push(
      ...asBulletList(content.interests, 2),
      ...asBulletList(content.generalProfile, 1),
    );
  }

  const routes = [
    ...asBulletList(content.routes, 2),
    ...asBulletList(content.trades, 2),
  ].slice(0, 3);

  const actions =
    content.nextSteps?.length > 0
      ? content.nextSteps.slice(0, 3)
      : asBulletList(content.actionPlan, 3);

  return {
    strengths: strengths.slice(0, 3),
    routes: routes.length
      ? routes
      : ["Explora al menos tres alternativas en el catálogo ENRUTA."],
    actions: actions.length
      ? actions
      : [
          "Conversar el informe con orientación.",
          "Guardar alternativas que te hagan sentido.",
          "Definir un paso concreto para los próximos 30 días.",
        ],
  };
}
