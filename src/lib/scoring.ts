import { DIMENSION_ORDER, type DimensionCode } from "./dimensions";

export type ScoreMap = Record<string, number>;

export type AnswerScoreInput = {
  questionId: string;
  /** selected option scores, e.g. { R: 2, I: 1 } or likert multiplier */
  optionScores: ScoreMap;
  /** for likert 1-5, multiply base scores */
  likertValue?: number;
};

/**
 * Calcula puntajes RIASEC normalizados 0-100 a partir de respuestas.
 * Instrumento propio ENRUTA (inspirado en categorías de intereses, sin test licenciado).
 */
export function computeDimensionScores(inputs: AnswerScoreInput[]): {
  dimensions: ScoreMap;
  topDimensions: DimensionCode[];
  raw: ScoreMap;
} {
  const raw: ScoreMap = Object.fromEntries(DIMENSION_ORDER.map((d) => [d, 0]));
  const maxPossible: ScoreMap = Object.fromEntries(
    DIMENSION_ORDER.map((d) => [d, 0]),
  );

  for (const input of inputs) {
    const mult =
      input.likertValue != null ? normalizeLikert(input.likertValue) : 1;
    for (const [dim, weight] of Object.entries(input.optionScores)) {
      if (!(dim in raw)) continue;
      raw[dim] += weight * mult;
      maxPossible[dim] += Math.max(weight, 0) * 1; // max likert mult treated as 1 for cap estimate
    }
  }

  // If likert used, max should account for max mult 1.0 (value 5)
  // Better approach: normalize relative to max raw among dimensions + absolute scale
  const maxRaw = Math.max(...Object.values(raw), 1);
  const dimensions: ScoreMap = {};
  for (const d of DIMENSION_ORDER) {
    dimensions[d] = Math.round((raw[d] / maxRaw) * 100);
  }

  const topDimensions = [...DIMENSION_ORDER]
    .sort((a, b) => dimensions[b] - dimensions[a])
    .slice(0, 3) as DimensionCode[];

  return { dimensions, topDimensions, raw };
}

function normalizeLikert(value: number): number {
  // 1..5 → 0.2..1.0
  const v = Math.min(5, Math.max(1, value));
  return v / 5;
}

/**
 * Afinidad 0-100 entre perfil del estudiante y un ítem del catálogo.
 */
export function affinityScore(
  student: ScoreMap,
  item: ScoreMap,
): { score: number; reasons: string[] } {
  let dot = 0;
  let nA = 0;
  let nB = 0;
  const reasons: string[] = [];

  for (const d of DIMENSION_ORDER) {
    const a = (student[d] ?? 0) / 100;
    const b = (item[d] ?? 0) / 100;
    dot += a * b;
    nA += a * a;
    nB += b * b;
  }

  const denom = Math.sqrt(nA) * Math.sqrt(nB) || 1;
  const cosine = Math.max(0, Math.min(1, dot / denom));
  const score = Math.round(cosine * 100);

  const studentTop = [...DIMENSION_ORDER]
    .sort((a, b) => (student[b] ?? 0) - (student[a] ?? 0))
    .slice(0, 2);
  const itemTop = [...DIMENSION_ORDER]
    .sort((a, b) => (item[b] ?? 0) - (item[a] ?? 0))
    .slice(0, 2);

  for (const d of studentTop) {
    if ((item[d] ?? 0) >= 40) {
      reasons.push(
        `Tus respuestas muestran afinidad con el perfil ${d} y esta alternativa también lo destaca.`,
      );
    }
  }
  if (reasons.length === 0) {
    reasons.push(
      "Aparece como una opción diversa para explorar, no como una única ruta ideal.",
    );
  }
  if (itemTop[0] && (student[itemTop[0]] ?? 0) < 30) {
    reasons.push(
      "Puede ser interesante para contrastar con tus intereses actuales y ampliar tu mapa.",
    );
  }

  return { score, reasons: reasons.slice(0, 3) };
}

export function detectFlags(answersCount: number, expected: number): string[] {
  const flags: string[] = [];
  if (answersCount < expected) flags.push("incomplete");
  if (answersCount < expected * 0.5) flags.push("insufficient_data");
  return flags;
}
