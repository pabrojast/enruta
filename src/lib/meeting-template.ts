import type { CaseloadStatus } from "@/lib/caseload";
import type { ReportContent } from "@/db/schema";

export type MeetingBlock = {
  title: string;
  minutes: number;
  items: string[];
};

/** 20–30 min session guide for counselor–student meetings. */
export function buildMeetingTemplate(opts: {
  studentFirstName: string;
  gradeLevel: number;
  caseloadStatus: CaseloadStatus;
  reportContent?: ReportContent | null;
  interestsSummary?: string | null;
}): { title: string; durationLabel: string; blocks: MeetingBlock[]; closing: string[] } {
  const name = opts.studentFirstName || "el/la estudiante";
  const stage =
    opts.gradeLevel <= 1
      ? "Conocerme"
      : opts.gradeLevel === 2
        ? "Capacidades"
        : opts.gradeLevel === 3
          ? "Explorar"
          : "Proyecto de vida";

  const reflection =
    opts.reportContent?.reflectionQuestions?.slice(0, 3) ?? [
      "¿Qué parte de tu perfil te representa y qué te sorprende?",
      "¿Qué actividad de la semana te dio más energía?",
      "¿Qué apoyo necesitas de tu familia o del colegio?",
    ];

  const nextFromReport =
    opts.reportContent?.nextSteps?.slice(0, 3) ?? [
      "Guardar al menos 3 alternativas en el explorador",
      "Anotar una duda para la próxima sesión",
      "Participar en una actividad o evento si hay disponible",
    ];

  if (opts.caseloadStatus === "pending_review" || opts.caseloadStatus === "delivered") {
    return {
      title: `Reunión de mediación · ${stage}`,
      durationLabel: "20–25 minutos",
      blocks: [
        {
          title: "Aterrizaje (3 min)",
          minutes: 3,
          items: [
            `Saludo y chequear ánimo de ${name} sin apuro.`,
            "Recordar: los resultados son orientativos, no un veredicto.",
            "Acordar objetivo de la reunión (entender informe / elegir 2–3 rutas).",
          ],
        },
        {
          title: "Lectura del mapa (7 min)",
          minutes: 7,
          items: [
            "Revisar el resumen “En 30 segundos” o el mapa de intereses juntos.",
            opts.interestsSummary
              ? `Contrastar con lo que escribió en su perfil: “${opts.interestsSummary.slice(0, 120)}${opts.interestsSummary.length > 120 ? "…" : ""}”`
              : "Preguntar qué le resonó y qué no le calza.",
            "Evitar frases deterministas; usar “podrías explorar…”.",
          ],
        },
        {
          title: "Preguntas de reflexión (7 min)",
          minutes: 7,
          items: reflection,
        },
        {
          title: "Plan de acción (5 min)",
          minutes: 5,
          items: [
            ...nextFromReport,
            "Dejar un compromiso concreto a 7–14 días (quién hace qué).",
          ],
        },
      ],
      closing: [
        "Resumir en 2 frases lo conversado.",
        "Agendar seguimiento o dejar la puerta abierta.",
        "Si hay señales de malestar, activar protocolo del establecimiento (no solo la app).",
      ],
    };
  }

  if (opts.caseloadStatus === "in_progress" || opts.caseloadStatus === "no_assessment") {
    return {
      title: `Sesión de arranque · ${stage}`,
      durationLabel: "15–20 minutos",
      blocks: [
        {
          title: "Contexto (4 min)",
          minutes: 4,
          items: [
            "Explicar ENRUTA: proceso, no test de un día.",
            "Privacidad: qué ve familia y qué no.",
            "Responder miedos sobre “equivocarse de carrera”.",
          ],
        },
        {
          title: "Motivación al cuestionario (8 min)",
          minutes: 8,
          items: [
            "Completar perfil si falta (intereses y fortalezas en 1 frase).",
            "Abrir cuestionario juntos y avanzar 3–5 ítems si hay tiempo.",
            "Acordar fecha para enviar el cuestionario completo.",
          ],
        },
        {
          title: "Cierre (3 min)",
          minutes: 3,
          items: [
            "Un solo compromiso de la semana.",
            "Invitar a un juego o exploración ligera si aún no hay informe.",
          ],
        },
      ],
      closing: [
        "Registrar en notas profesionales un objetivo y la fecha de seguimiento.",
      ],
    };
  }

  return {
    title: `Seguimiento de ruta · ${stage}`,
    durationLabel: "20 minutos",
    blocks: [
      {
        title: "Check-in (5 min)",
        minutes: 5,
        items: [
          "¿Qué avanzó desde la última vez?",
          "¿Qué se trabó (familia, PAES, dudas, tiempo)?",
        ],
      },
      {
        title: "Exploración (10 min)",
        minutes: 10,
        items: [
          "Revisar alternativas guardadas o comparar 2 rutas.",
          "Mirar un dato de empleabilidad/ingreso como contexto, no como destino.",
          "Elegir una experiencia real (charla, visita, práctica corta).",
        ],
      },
      {
        title: "Cierre (5 min)",
        minutes: 5,
        items: nextFromReport,
      },
    ],
    closing: ["Dejar registro breve y próximo hito (30/90 días si aplica)."],
  };
}
