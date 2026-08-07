import { RIASEC, type DimensionCode, DIMENSION_ORDER } from "@/lib/dimensions";

export type DemoOption = {
  label: string;
  scores: Partial<Record<DimensionCode, number>>;
};

export type DemoQuestion = {
  id: string;
  prompt: string;
  options: DemoOption[];
};

/** Lightweight public quiz — not a clinical instrument. */
export const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    id: "q1",
    prompt: "En un proyecto del colegio, ¿qué parte disfrutas más?",
    options: [
      {
        label: "Construir o armar algo con las manos",
        scores: { R: 3, C: 1 },
      },
      {
        label: "Investigar por qué funciona o no funciona",
        scores: { I: 3, C: 1 },
      },
      {
        label: "Diseñar cómo se ve o se cuenta la idea",
        scores: { A: 3, E: 1 },
      },
      {
        label: "Organizar al equipo y que todos avancen",
        scores: { E: 2, S: 2 },
      },
    ],
  },
  {
    id: "q2",
    prompt: "Un sábado libre, ¿qué te tira más?",
    options: [
      {
        label: "Salir a la naturaleza, deporte o taller práctico",
        scores: { R: 3, S: 1 },
      },
      {
        label: "Ver un documental o enredarte en un problema difícil",
        scores: { I: 3, A: 1 },
      },
      {
        label: "Crear (música, dibujo, video, escritura)",
        scores: { A: 3 },
      },
      {
        label: "Estar con amigos o ayudar en algo de la casa/comunidad",
        scores: { S: 3, E: 1 },
      },
    ],
  },
  {
    id: "q3",
    prompt: "Cuando te elogian, ¿qué te gusta oír?",
    options: [
      {
        label: "“Eres práctico/a y resolutivo/a”",
        scores: { R: 2, E: 2 },
      },
      {
        label: "“Piensas con profundidad”",
        scores: { I: 3 },
      },
      {
        label: "“Tienes una mirada original”",
        scores: { A: 3 },
      },
      {
        label: "“Se te da bien cuidar y acompañar”",
        scores: { S: 3 },
      },
    ],
  },
  {
    id: "q4",
    prompt: "En un trabajo ideal, ¿qué no te puede faltar?",
    options: [
      {
        label: "Resultados tangibles (algo que se vea o funcione)",
        scores: { R: 3, C: 1 },
      },
      {
        label: "Preguntas abiertas y aprendizaje constante",
        scores: { I: 3, A: 1 },
      },
      {
        label: "Espacio para proponer e innovar",
        scores: { A: 2, E: 2 },
      },
      {
        label: "Personas, conversación y sentido de equipo",
        scores: { S: 3, E: 1 },
      },
    ],
  },
  {
    id: "q5",
    prompt: "Ante un desorden de información, ¿qué haces primero?",
    options: [
      {
        label: "Armar un sistema, tabla o checklist",
        scores: { C: 3, I: 1 },
      },
      {
        label: "Buscar el patrón o la causa de fondo",
        scores: { I: 3, C: 1 },
      },
      {
        label: "Contarlo de forma visual o creativa",
        scores: { A: 3, S: 1 },
      },
      {
        label: "Reunir al grupo y repartir tareas",
        scores: { E: 3, S: 1 },
      },
    ],
  },
  {
    id: "q6",
    prompt: "¿Qué tipo de problema te engancha más?",
    options: [
      {
        label: "Arreglar o mejorar algo físico o técnico",
        scores: { R: 3, I: 1 },
      },
      {
        label: "Entender un fenómeno o demostrar una idea",
        scores: { I: 3 },
      },
      {
        label: "Comunicar una emoción o una historia",
        scores: { A: 3, S: 1 },
      },
      {
        label: "Convencer, negociar o sacar un proyecto adelante",
        scores: { E: 3, S: 1 },
      },
    ],
  },
  {
    id: "q7",
    prompt: "Si pudieras “probar un día” de una vida laboral…",
    options: [
      {
        label: "Taller, campo, laboratorio o terreno",
        scores: { R: 3, I: 1 },
      },
      {
        label: "Investigación, análisis o salud con datos",
        scores: { I: 3, S: 1 },
      },
      {
        label: "Estudio creativo, medios o diseño",
        scores: { A: 3, E: 1 },
      },
      {
        label: "Atención a personas, educación o gestión de equipos",
        scores: { S: 2, E: 2 },
      },
    ],
  },
  {
    id: "q8",
    prompt: "¿Qué te genera más rechazo en un futuro posible?",
    options: [
      {
        label: "Pasar el día solo entre pantallas sin hacer nada concreto",
        scores: { R: 2, S: 1 },
      },
      {
        label: "Repetir tareas sin entender el “por qué”",
        scores: { I: 2, A: 1 },
      },
      {
        label: "Seguir guiones rígidos sin espacio creativo",
        scores: { A: 3 },
      },
      {
        label: "Trabajar aislado/a sin impacto en otras personas",
        scores: { S: 2, E: 2 },
      },
    ],
  },
  {
    id: "q9",
    prompt: "Cuando te va bien en algo, suele ser porque…",
    options: [
      {
        label: "Practicas hasta que sale",
        scores: { R: 2, C: 2 },
      },
      {
        label: "Lees, pruebas hipótesis y corriges",
        scores: { I: 3, C: 1 },
      },
      {
        label: "Mezclas ideas de formas poco obvias",
        scores: { A: 3, I: 1 },
      },
      {
        label: "Motivas a otros y sostienes la conversación",
        scores: { S: 2, E: 2 },
      },
    ],
  },
  {
    id: "q10",
    prompt: "En 4° medio, ¿qué te gustaría haber explorado más?",
    options: [
      {
        label: "Oficios, técnica y “cómo se hace de verdad”",
        scores: { R: 3, C: 1 },
      },
      {
        label: "Ciencia, tecnología o investigación aplicada",
        scores: { I: 3, R: 1 },
      },
      {
        label: "Arte, diseño, comunicación o cultura",
        scores: { A: 3, S: 1 },
      },
      {
        label: "Emprendimiento, liderazgo o servicio a la comunidad",
        scores: { E: 2, S: 2 },
      },
    ],
  },
];

export type DemoScores = Record<DimensionCode, number>;

export function emptyScores(): DemoScores {
  return { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
}

export function applyOption(
  scores: DemoScores,
  option: DemoOption,
): DemoScores {
  const next = { ...scores };
  for (const [code, value] of Object.entries(option.scores)) {
    const c = code as DimensionCode;
    next[c] = (next[c] ?? 0) + (value ?? 0);
  }
  return next;
}

export function normalizeScores(scores: DemoScores): DemoScores {
  const max = Math.max(...DIMENSION_ORDER.map((c) => scores[c]), 1);
  const out = emptyScores();
  for (const c of DIMENSION_ORDER) {
    out[c] = Math.round((scores[c] / max) * 100);
  }
  return out;
}

export function topDimensions(scores: DemoScores, n = 3): DimensionCode[] {
  return [...DIMENSION_ORDER]
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, n);
}

export function archetypeTitle(top: DimensionCode[]): string {
  if (top.length === 0) return "Explorador/a en construcción";
  const [a, b] = top;
  const pairKey = `${a}${b ?? ""}`;
  const pairs: Record<string, string> = {
    RI: "Constructor/a curioso/a",
    IR: "Investigador/a aplicado/a",
    IA: "Mente creativa analítica",
    AI: "Creador/a que indaga",
    AS: "Narrador/a con sentido social",
    SA: "Acompañante creativo/a",
    SE: "Puente entre personas y proyectos",
    ES: "Líder que conecta",
    EC: "Impulsor/a organizado/a",
    CE: "Estratega de sistemas",
    RC: "Manos firmes y método",
    CR: "Orden con resultados concretos",
    IS: "Ciencia con personas",
    SI: "Cuidado con criterio",
    AE: "Creativo/a con impulso",
    EA: "Emprendedor/a con estilo",
  };
  return (
    pairs[pairKey] ??
    `${RIASEC[a].name}${b ? ` + ${RIASEC[b].name}` : ""}`
  );
}

export function suggestedRoutes(top: DimensionCode[]): {
  title: string;
  why: string;
}[] {
  const primary = top[0] ?? "S";
  const catalog: Record<
    DimensionCode,
    { title: string; why: string }[]
  > = {
    R: [
      {
        title: "Formación técnica / oficios",
        why: "Te tira lo concreto y los resultados tangibles.",
      },
      {
        title: "Ingeniería o tecnologías aplicadas",
        why: "Problemas del mundo real con herramientas y sistemas.",
      },
      {
        title: "Trabajo en terreno o laboratorio práctico",
        why: "Menos “solo pantalla”, más hacer y probar.",
      },
    ],
    I: [
      {
        title: "Ciencias, salud o análisis de datos",
        why: "Preguntar, medir y entender te da energía.",
      },
      {
        title: "Tecnología e investigación aplicada",
        why: "Espacio para hipótesis y aprendizaje profundo.",
      },
      {
        title: "Rutas mixtas estudio + proyectos",
        why: "Puedes combinar teoría con exploración real.",
      },
    ],
    A: [
      {
        title: "Diseño, medios o comunicación",
        why: "Expresar y crear formas nuevas es tu motor.",
      },
      {
        title: "Artes y cultura con salida profesional",
        why: "El “cómo se cuenta” importa tanto como el contenido.",
      },
      {
        title: "Emprendimientos creativos",
        why: "Ideas + formato propio, con espacio para innovar.",
      },
    ],
    S: [
      {
        title: "Educación, salud o trabajo comunitario",
        why: "Acompañar y cuidar a otras personas te motiva.",
      },
      {
        title: "Psicología, orientación o mediación",
        why: "Conversar y sostener procesos humanos.",
      },
      {
        title: "Gestión de equipos y servicio",
        why: "Impacto social con estructura y colaboración.",
      },
    ],
    E: [
      {
        title: "Emprendimiento y gestión de proyectos",
        why: "Te mueve iniciar, persuadir y sacar cosas adelante.",
      },
      {
        title: "Negocios, marketing o liderazgo escolar/comunitario",
        why: "Organizar personas e ideas hacia un objetivo.",
      },
      {
        title: "Rutas mixtas (estudio + trabajo temprano)",
        why: "Probar impacto real mientras aprendes.",
      },
    ],
    C: [
      {
        title: "Administración, finanzas o calidad",
        why: "Orden, precisión y sistemas claros te acomodan.",
      },
      {
        title: "Datos, operaciones o soporte técnico estructurado",
        why: "Procesos bien armados y resultados medibles.",
      },
      {
        title: "Carreras con fuerte componente de método",
        why: "Menos ambigüedad, más checklist y mejora continua.",
      },
    ],
  };
  return catalog[primary].slice(0, 3);
}
