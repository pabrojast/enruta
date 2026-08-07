export const RIASEC = {
  R: {
    code: "R",
    name: "Realista",
    short: "Hacer y construir",
    description:
      "Te atrae lo práctico: herramientas, naturaleza, máquinas, movimiento y resultados tangibles.",
  },
  I: {
    code: "I",
    name: "Investigador",
    short: "Explorar y entender",
    description:
      "Te motiva preguntar, analizar, investigar y resolver problemas con lógica y curiosidad.",
  },
  A: {
    code: "A",
    name: "Artístico",
    short: "Crear y expresar",
    description:
      "Valoras la creatividad, la expresión, el diseño y las formas originales de comunicar ideas.",
  },
  S: {
    code: "S",
    name: "Social",
    short: "Ayudar y acompañar",
    description:
      "Disfrutas apoyar a otras personas, enseñar, cuidar, conversar y trabajar en equipo.",
  },
  E: {
    code: "E",
    name: "Emprendedor",
    short: "Liderar e impulsar",
    description:
      "Te interesa persuadir, organizar proyectos, tomar iniciativa y generar impacto.",
  },
  C: {
    code: "C",
    name: "Convencional",
    short: "Ordenar y sistematizar",
    description:
      "Prefieres estructura, precisión, datos, procesos claros y trabajo organizado.",
  },
} as const;

export type DimensionCode = keyof typeof RIASEC;

export const DIMENSION_ORDER: DimensionCode[] = [
  "R",
  "I",
  "A",
  "S",
  "E",
  "C",
];

export function dimensionLabel(code: string) {
  return RIASEC[code as DimensionCode]?.name ?? code;
}
