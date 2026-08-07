/**
 * Datos de referencia inspirados en fuentes públicas chilenas.
 * Ver data/public/README.md. No son dumps oficiales crudos.
 */

import type { CatalogChileMetrics } from "@/db/schema";

export const PUBLIC_SOURCES = [
  {
    code: "INE_ENE",
    name: "Encuesta Nacional de Empleo (ENE)",
    organization: "Instituto Nacional de Estadísticas (INE)",
    url: "https://www.ine.gob.cl/estadisticas-por-tema/mercado-laboral/ocupacion-y-desocupacion",
    description:
      "Estructura de ocupación e indicadores de mercado laboral por actividad económica.",
    licenseNote: "Estadísticas públicas oficiales INE. Cifras de referencia simplificadas.",
    referenceYear: 2024,
  },
  {
    code: "SIES_MIFUTURO",
    name: "Servicio de Información de Educación Superior (SIES)",
    organization: "MINEDUC / Mi Futuro",
    url: "https://www.mifuturo.cl/sies/",
    description:
      "Información de matrícula, duración y oferta de educación superior.",
    licenseNote: "Reportes e información pública SIES. Agregados simplificados para MVP.",
    referenceYear: 2024,
  },
  {
    code: "MINEDUC_OPEN",
    name: "Datos Abiertos MINEDUC",
    organization: "Centro de Estudios MINEDUC",
    url: "https://datosabiertos.mineduc.cl/",
    description: "Bases abiertas del sistema educativo chileno.",
    licenseNote: "Datos abiertos gubernamentales.",
    referenceYear: 2024,
  },
  {
    code: "ENRUTA_SYNTH",
    name: "Mapeos orientativos ENRUTA",
    organization: "ENRUTA",
    url: null,
    description:
      "Correspondencias entre dimensiones de intereses (RIASEC-inspirado) y sectores formativos/laborales.",
    licenseNote: "Uso interno pedagógico; no es estadística oficial.",
    referenceYear: 2025,
  },
] as const;

/** Participación aproximada de ocupados por gran sector (referencia nacional) */
export const LABOR_SECTORS = [
  {
    sectorCode: "comercio",
    sectorName: "Comercio y servicios de atención al público",
    region: "Nacional",
    employmentSharePct: 18.5,
    youthRelevance: 4,
    formalJobOutlook: 3,
    skillDemandNote:
      "Alta rotación y presencia juvenil; combina atención, ventas y operaciones.",
    riasecTags: ["E", "S", "C"],
    sourceCode: "INE_ENE",
    referenceYear: 2024,
  },
  {
    sectorCode: "salud",
    sectorName: "Salud y asistencia social",
    region: "Nacional",
    employmentSharePct: 8.2,
    youthRelevance: 4,
    formalJobOutlook: 5,
    skillDemandNote:
      "Demanda sostenida de técnicos y profesionales de cuidado y gestión sanitaria.",
    riasecTags: ["S", "I", "C"],
    sourceCode: "INE_ENE",
    referenceYear: 2024,
  },
  {
    sectorCode: "educacion",
    sectorName: "Enseñanza y servicios educativos",
    region: "Nacional",
    employmentSharePct: 7.5,
    youthRelevance: 3,
    formalJobOutlook: 4,
    skillDemandNote:
      "Requiere formación pedagógica o técnica especializada; fuerte componente social.",
    riasecTags: ["S", "A", "I"],
    sourceCode: "INE_ENE",
    referenceYear: 2024,
  },
  {
    sectorCode: "tic",
    sectorName: "Información, comunicaciones y tecnología",
    region: "Nacional",
    employmentSharePct: 3.8,
    youthRelevance: 5,
    formalJobOutlook: 5,
    skillDemandNote:
      "Crecimiento de perfiles digitales, soporte, desarrollo y ciberseguridad.",
    riasecTags: ["I", "R", "C"],
    sourceCode: "INE_ENE",
    referenceYear: 2024,
  },
  {
    sectorCode: "industria",
    sectorName: "Industria manufacturera",
    region: "Nacional",
    employmentSharePct: 10.1,
    youthRelevance: 3,
    formalJobOutlook: 4,
    skillDemandNote:
      "Oficios técnicos, mantención, calidad y procesos productivos.",
    riasecTags: ["R", "C", "I"],
    sourceCode: "INE_ENE",
    referenceYear: 2024,
  },
  {
    sectorCode: "construccion",
    sectorName: "Construcción",
    region: "Nacional",
    employmentSharePct: 8.0,
    youthRelevance: 4,
    formalJobOutlook: 3,
    skillDemandNote:
      "Alta demanda de oficios y técnicos; sensible a ciclos económicos.",
    riasecTags: ["R", "E", "C"],
    sourceCode: "INE_ENE",
    referenceYear: 2024,
  },
  {
    sectorCode: "agro",
    sectorName: "Agricultura, ganadería y silvicultura",
    region: "Nacional",
    employmentSharePct: 6.5,
    youthRelevance: 3,
    formalJobOutlook: 3,
    skillDemandNote:
      "Relevante en regiones productivas; crece la tecnificación y sustentabilidad.",
    riasecTags: ["R", "I", "E"],
    sourceCode: "INE_ENE",
    referenceYear: 2024,
  },
  {
    sectorCode: "agro_ohiggins",
    sectorName: "Agricultura y agroindustria (O'Higgins)",
    region: "O'Higgins",
    employmentSharePct: 14.0,
    youthRelevance: 4,
    formalJobOutlook: 3,
    skillDemandNote:
      "Pilar territorial: producción, packing, logística y servicios técnicos del agro.",
    riasecTags: ["R", "I", "E"],
    sourceCode: "INE_ENE",
    referenceYear: 2024,
  },
  {
    sectorCode: "admin",
    sectorName: "Administración pública y defensa",
    region: "Nacional",
    employmentSharePct: 5.5,
    youthRelevance: 2,
    formalJobOutlook: 4,
    skillDemandNote:
      "Procesos de selección formales; perfiles administrativos y de servicio público.",
    riasecTags: ["C", "S", "E"],
    sourceCode: "INE_ENE",
    referenceYear: 2024,
  },
  {
    sectorCode: "transporte",
    sectorName: "Transporte y almacenamiento",
    region: "Nacional",
    employmentSharePct: 7.0,
    youthRelevance: 4,
    formalJobOutlook: 3,
    skillDemandNote:
      "Logística, operación y mantención; combina trabajo práctico y turnos.",
    riasecTags: ["R", "C", "E"],
    sourceCode: "INE_ENE",
    referenceYear: 2024,
  },
  {
    sectorCode: "turismo",
    sectorName: "Alojamiento y servicio de comidas",
    region: "Nacional",
    employmentSharePct: 5.2,
    youthRelevance: 5,
    formalJobOutlook: 3,
    skillDemandNote:
      "Puerta de entrada laboral juvenil; gastronomía, hotelería y servicio.",
    riasecTags: ["E", "S", "R", "A"],
    sourceCode: "INE_ENE",
    referenceYear: 2024,
  },
  {
    sectorCode: "profesional",
    sectorName: "Actividades profesionales, científicas y técnicas",
    region: "Nacional",
    employmentSharePct: 6.0,
    youthRelevance: 3,
    formalJobOutlook: 5,
    skillDemandNote:
      "Consultoría, diseño, laboratorio y servicios especializados.",
    riasecTags: ["I", "A", "E", "C"],
    sourceCode: "INE_ENE",
    referenceYear: 2024,
  },
] as const;

export const EDUCATION_AREAS = [
  {
    areaCode: "tecnologia",
    areaName: "Tecnología e informática",
    institutionTypes: ["universidad", "ip", "cft"],
    enrollmentSharePct: 12.0,
    typicalDurationYears: 3.5,
    continuationNote:
      "Rutas desde CFT/IP hasta ingenierías universitarias y certificaciones.",
    riasecTags: ["I", "R", "C"],
    sourceCode: "SIES_MIFUTURO",
    referenceYear: 2024,
  },
  {
    areaCode: "salud",
    areaName: "Salud",
    institutionTypes: ["universidad", "ip", "cft"],
    enrollmentSharePct: 14.5,
    typicalDurationYears: 4.5,
    continuationNote:
      "Alta matrícula; combinar vocación de servicio con requisitos de ingreso.",
    riasecTags: ["S", "I", "C"],
    sourceCode: "SIES_MIFUTURO",
    referenceYear: 2024,
  },
  {
    areaCode: "educacion",
    areaName: "Educación",
    institutionTypes: ["universidad", "ip"],
    enrollmentSharePct: 9.0,
    typicalDurationYears: 4.5,
    continuationNote:
      "Pedagogías y formación docente; práctica profesional central.",
    riasecTags: ["S", "A", "I"],
    sourceCode: "SIES_MIFUTURO",
    referenceYear: 2024,
  },
  {
    areaCode: "admin_comercio",
    areaName: "Administración y comercio",
    institutionTypes: ["universidad", "ip", "cft"],
    enrollmentSharePct: 16.0,
    typicalDurationYears: 3.5,
    continuationNote:
      "Amplia oferta en IP/CFT y universidades; útil combinar con idiomas o digital.",
    riasecTags: ["E", "C", "S"],
    sourceCode: "SIES_MIFUTURO",
    referenceYear: 2024,
  },
  {
    areaCode: "agropecuaria",
    areaName: "Agropecuaria y recursos naturales",
    institutionTypes: ["universidad", "ip", "cft", "tp"],
    enrollmentSharePct: 4.5,
    typicalDurationYears: 3.0,
    continuationNote:
      "Especialmente pertinente en territorios productivos y especialidades TP.",
    riasecTags: ["R", "I", "E"],
    sourceCode: "SIES_MIFUTURO",
    referenceYear: 2024,
  },
  {
    areaCode: "artes",
    areaName: "Arte y arquitectura",
    institutionTypes: ["universidad", "ip"],
    enrollmentSharePct: 5.5,
    typicalDurationYears: 4.5,
    continuationNote:
      "Portafolio y práctica creativa son clave; combinar con gestión o digital.",
    riasecTags: ["A", "I", "E"],
    sourceCode: "SIES_MIFUTURO",
    referenceYear: 2024,
  },
  {
    areaCode: "social",
    areaName: "Ciencias sociales y derecho",
    institutionTypes: ["universidad", "ip"],
    enrollmentSharePct: 11.0,
    typicalDurationYears: 5.0,
    continuationNote:
      "Rutas largas universitarias; también técnicas en trabajo social y gestión.",
    riasecTags: ["S", "E", "I"],
    sourceCode: "SIES_MIFUTURO",
    referenceYear: 2024,
  },
  {
    areaCode: "ingenieria",
    areaName: "Ingeniería y construcción",
    institutionTypes: ["universidad", "ip", "cft", "tp"],
    enrollmentSharePct: 13.5,
    typicalDurationYears: 4.0,
    continuationNote:
      "Desde oficios y CFT hasta ingenierías; fuerte vínculo con industria y obra.",
    riasecTags: ["R", "I", "C"],
    sourceCode: "SIES_MIFUTURO",
    referenceYear: 2024,
  },
  {
    areaCode: "gastronomia",
    areaName: "Gastronomía y hotelería",
    institutionTypes: ["ip", "cft", "tp"],
    enrollmentSharePct: 3.0,
    typicalDurationYears: 2.5,
    continuationNote:
      "Formación corta y práctica; emprendedurismo y turismo regional.",
    riasecTags: ["R", "A", "E", "S"],
    sourceCode: "SIES_MIFUTURO",
    referenceYear: 2024,
  },
] as const;

export const REGIONAL_INSIGHTS = [
  {
    region: "Metropolitana",
    headline: "Mayor diversidad de oferta formativa y empleo de servicios/TIC",
    opportunitySectors: ["tic", "salud", "comercio", "profesional", "educacion"],
    educationNotes:
      "Concentración de universidades, IP y CFT. Oportunidad de comparar modalidades y costos de vida.",
    cautionNote:
      "Alta competencia en algunas carreras; conviene mirar empleabilidad y plan B técnico.",
    sourceCode: "MINEDUC_OPEN",
    referenceYear: 2024,
  },
  {
    region: "O'Higgins",
    headline: "Fuerte peso del agro y servicios asociados al territorio",
    opportunitySectors: ["agro", "agro_ohiggins", "transporte", "industria", "turismo"],
    educationNotes:
      "Especialidades TP agropecuarias y técnicas de mantención/logística son pertinentes al contexto.",
    cautionNote:
      "Complementar oficios locales con formación continua y digitalización del sector.",
    sourceCode: "INE_ENE",
    referenceYear: 2024,
  },
  {
    region: "Nacional",
    headline: "Mapa diverso: servicios, industria, salud y educación concentran empleo",
    opportunitySectors: ["comercio", "industria", "salud", "educacion", "construccion"],
    educationNotes:
      "Explorar rutas universidad / IP / CFT / oficio sin asumir una sola vía “correcta”.",
    cautionNote:
      "Los promedios nacionales ocultan diferencias regionales; siempre mirar el territorio.",
    sourceCode: "ENRUTA_SYNTH",
    referenceYear: 2025,
  },
] as const;

const MIFUTURO_BUSCADOR =
  "https://www.mifuturo.cl/buscador-de-estadisticas-por-carrera/";
const MIFUTURO_SIES = "https://www.mifuturo.cl/sies/";
const BIOBIO_MIFUTURO_2025 =
  "https://www.biobiochile.cl/noticias/servicios/toma-nota/2025/01/06/todas-las-carreras-con-mas-y-menos-empleabilidad-en-chile-y-cual-es-su-sueldo-promedio.shtml";

/**
 * Métricas de empleabilidad/ingreso por slug del catálogo.
 * Cifras de carreras universitarias: MiFuturo (MINEDUC), reportadas públ.
 * (p.ej. BioBioChile 06-ene-2025): empleabilidad al 4.º año de egreso e
 * ingreso bruto promedio de referencia al 3.er año.
 * Siempre verificar en mifuturo.cl antes de decisiones institucionales.
 */
export const CATALOG_CHILE_METRICS: Record<string, CatalogChileMetrics> = {
  "ingenieria-en-informatica": {
    employabilityPct: 89,
    employabilityHorizon: "al 4.º año de egreso",
    incomeAvgClp: 1_820_000,
    incomeHorizon: "ingreso bruto promedio al 3.er año (ref.)",
    sourceCode: "SIES_MIFUTURO",
    sourceName: "Mi Futuro / SIES (MINEDUC)",
    sourceUrl: MIFUTURO_BUSCADOR,
    referenceYear: 2025,
    sourceProgramLabel: "Ingeniería en Computación e Informática",
    note: "Agregado nacional. Varía por institución, cohorte y región. Consulta el buscador oficial de Mi Futuro para el programa exacto.",
    secondaryCitation:
      "BioBioChile (06-ene-2025), citando estadísticas MiFuturo para admisión 2025.",
    secondaryUrl: BIOBIO_MIFUTURO_2025,
  },
  psicologia: {
    employabilityPct: 77.1,
    employabilityHorizon: "al 4.º año de egreso",
    incomeAvgClp: 1_139_000,
    incomeHorizon: "ingreso bruto promedio al 3.er año (ref.)",
    sourceCode: "SIES_MIFUTURO",
    sourceName: "Mi Futuro / SIES (MINEDUC)",
    sourceUrl: MIFUTURO_BUSCADOR,
    referenceYear: 2025,
    sourceProgramLabel: "Psicología",
    note: "Empleabilidad media-alta; el campo es amplio (clínica, educacional, organizacional). No es un techo ni un piso garantizado.",
    secondaryCitation:
      "BioBioChile (06-ene-2025), citando estadísticas MiFuturo.",
    secondaryUrl: BIOBIO_MIFUTURO_2025,
  },
  enfermeria: {
    employabilityPct: 93.7,
    employabilityHorizon: "al 4.º año de egreso",
    incomeAvgClp: 1_755_000,
    incomeHorizon: "ingreso bruto promedio al 3.er año (ref.)",
    sourceCode: "SIES_MIFUTURO",
    sourceName: "Mi Futuro / SIES (MINEDUC)",
    sourceUrl: MIFUTURO_BUSCADOR,
    referenceYear: 2025,
    sourceProgramLabel: "Enfermería",
    note: "Alta empleabilidad histórica en salud. Condiciones laborales y turnos varían por establecimiento.",
    secondaryCitation:
      "BioBioChile (06-ene-2025), citando estadísticas MiFuturo.",
    secondaryUrl: BIOBIO_MIFUTURO_2025,
  },
  "pedagogia-en-educacion-media": {
    employabilityPct: 87.1,
    employabilityHorizon: "al 4.º año de egreso",
    incomeAvgClp: 1_171_000,
    incomeHorizon: "ingreso bruto promedio al 3.er año (ref.)",
    sourceCode: "SIES_MIFUTURO",
    sourceName: "Mi Futuro / SIES (MINEDUC)",
    sourceUrl: MIFUTURO_BUSCADOR,
    referenceYear: 2025,
    sourceProgramLabel: "Pedagogía en Educación Media",
    note: "La empleabilidad y la remuneración dependen de la especialidad, el sector (público/particular) y la región.",
    secondaryCitation:
      "BioBioChile (06-ene-2025), citando estadísticas MiFuturo.",
    secondaryUrl: BIOBIO_MIFUTURO_2025,
  },
  "diseno-grafico": {
    employabilityPct: 56.2,
    employabilityHorizon: "al 4.º año de egreso",
    incomeAvgClp: 985_000,
    incomeHorizon: "ingreso bruto promedio al 3.er año (ref.)",
    sourceCode: "SIES_MIFUTURO",
    sourceName: "Mi Futuro / SIES (MINEDUC)",
    sourceUrl: MIFUTURO_BUSCADOR,
    referenceYear: 2025,
    sourceProgramLabel: "Diseño Gráfico",
    note: "Empleabilidad más baja en el promedio nacional: conviene portafolio, redes y rutas mixtas (freelance, agencia, digital).",
    secondaryCitation:
      "BioBioChile (06-ene-2025), citando estadísticas MiFuturo.",
    secondaryUrl: BIOBIO_MIFUTURO_2025,
  },
  "administracion-de-empresas": {
    employabilityPct: 80,
    employabilityHorizon: "al 4.º año de egreso",
    incomeAvgClp: 1_410_000,
    incomeHorizon: "ingreso bruto promedio al 3.er año (ref.)",
    sourceCode: "SIES_MIFUTURO",
    sourceName: "Mi Futuro / SIES (MINEDUC)",
    sourceUrl: MIFUTURO_BUSCADOR,
    referenceYear: 2025,
    sourceProgramLabel: "Administración de Empresas e Ing. asociadas",
    note: "Familia de programas amplia (universidad/IP). Revisa el código exacto en Mi Futuro.",
    secondaryCitation:
      "BioBioChile (06-ene-2025), citando estadísticas MiFuturo.",
    secondaryUrl: BIOBIO_MIFUTURO_2025,
  },
  "ingenieria-comercial": {
    employabilityPct: 86.5,
    employabilityHorizon: "al 4.º año de egreso",
    incomeAvgClp: 1_837_000,
    incomeHorizon: "ingreso bruto promedio al 3.er año (ref.)",
    sourceCode: "SIES_MIFUTURO",
    sourceName: "Mi Futuro / SIES (MINEDUC)",
    sourceUrl: MIFUTURO_BUSCADOR,
    referenceYear: 2025,
    sourceProgramLabel: "Ingeniería Comercial",
    note: "Alta matrícula y egreso nacional; la empleabilidad se mantiene sólida en el promedio, no en cada malla.",
    secondaryCitation:
      "BioBioChile (06-ene-2025), citando estadísticas MiFuturo.",
    secondaryUrl: BIOBIO_MIFUTURO_2025,
  },
  "trabajo-social": {
    employabilityPct: 77.7,
    employabilityHorizon: "al 4.º año de egreso",
    incomeAvgClp: 1_077_000,
    incomeHorizon: "ingreso bruto promedio al 3.er año (ref.)",
    sourceCode: "SIES_MIFUTURO",
    sourceName: "Mi Futuro / SIES (MINEDUC)",
    sourceUrl: MIFUTURO_BUSCADOR,
    referenceYear: 2025,
    sourceProgramLabel: "Trabajo Social",
    note: "Campo orientado a servicio público, salud y comunidad. Ingresos varían por sector.",
    secondaryCitation:
      "BioBioChile (06-ene-2025), citando estadísticas MiFuturo.",
    secondaryUrl: BIOBIO_MIFUTURO_2025,
  },
  "tecnico-a-en-enfermeria": {
    employabilityPct: 80.5,
    employabilityHorizon: "referencia de empleabilidad (programa técnico)",
    incomeAvgClp: 850_000,
    incomeHorizon: "rango de ingreso promedio reportado (~$800–900 mil)",
    incomeRangeClp: [800_000, 900_000],
    sourceCode: "SIES_MIFUTURO",
    sourceName: "Mi Futuro / SIES (MINEDUC)",
    sourceUrl: MIFUTURO_BUSCADOR,
    referenceYear: 2025,
    sourceProgramLabel: "Técnico en Enfermería (TENS)",
    note: "Cifra de referencia para formación técnica de salud. Verifica institución y cohorte en Mi Futuro.",
    secondaryCitation:
      "Síntesis sectorial de salud (medios e IP) citando MiFuturo; contrastar en buscador oficial.",
    secondaryUrl: MIFUTURO_BUSCADOR,
  },
  // Oficios / rutas: sin % MiFuturo de “carrera universitaria” — anclar a INE/SIES área
  "tecnico-a-en-agropecuaria": {
    sourceCode: "INE_ENE",
    sourceName: "INE · Encuesta Nacional de Empleo (estructura sectorial)",
    sourceUrl:
      "https://www.ine.gob.cl/estadisticas-por-tema/mercado-laboral/ocupacion-y-desocupacion",
    referenceYear: 2024,
    note: "No hay un único % MiFuturo para este oficio. Usa el peso del sector agro en ENE y la oferta formativa SIES (área agropecuaria). Explora territorio y especialidad TP.",
  },
  "electricidad-y-automatizacion": {
    employabilityPct: 91.1,
    employabilityHorizon: "al 4.º año (programa afín de ingeniería/automatización)",
    incomeAvgClp: 1_755_000,
    incomeHorizon: "ingreso bruto promedio al 3.er año (ref. ingeniería en automatización)",
    sourceCode: "SIES_MIFUTURO",
    sourceName: "Mi Futuro / SIES (MINEDUC)",
    sourceUrl: MIFUTURO_BUSCADOR,
    referenceYear: 2025,
    sourceProgramLabel: "Ingeniería en Automatización, Instrumentación y Control",
    note: "Referencia de un programa afín de mayor duración. Oficios eléctricos CFT/TP pueden diferir: úsalo como orientación, no como promesa.",
    secondaryCitation:
      "BioBioChile (06-ene-2025), citando estadísticas MiFuturo.",
    secondaryUrl: BIOBIO_MIFUTURO_2025,
  },
  gastronomia: {
    sourceCode: "INE_ENE",
    sourceName: "INE · ENE (alojamiento y servicio de comidas)",
    sourceUrl:
      "https://www.ine.gob.cl/estadisticas-por-tema/mercado-laboral/ocupacion-y-desocupacion",
    referenceYear: 2024,
    note: "Alta relevancia juvenil en hotelería/gastronomía (ENE). Empleabilidad formal y sueldos varían mucho: conviene mirar prácticas y emprendimiento.",
  },
  "soldadura-y-estructuras-metalicas": {
    sourceCode: "INE_ENE",
    sourceName: "INE · ENE (industria manufacturera / construcción)",
    sourceUrl:
      "https://www.ine.gob.cl/estadisticas-por-tema/mercado-laboral/ocupacion-y-desocupacion",
    referenceYear: 2024,
    note: "Oficio con demanda cíclica en industria y obra. Prioriza certificaciones, seguridad y empleadores locales.",
  },
  "logistica-y-bodega": {
    employabilityPct: 94.3,
    employabilityHorizon: "al 4.º año (programa afín Ingeniería en Logística)",
    incomeAvgClp: 1_709_000,
    incomeHorizon: "ingreso bruto promedio al 3.er año (ref.)",
    sourceCode: "SIES_MIFUTURO",
    sourceName: "Mi Futuro / SIES (MINEDUC)",
    sourceUrl: MIFUTURO_BUSCADOR,
    referenceYear: 2025,
    sourceProgramLabel: "Ingeniería en Logística",
    note: "Referencia de un programa profesional afín. Operación de bodega/CFT puede tener ingresos distintos; el sector transporte/almacenamiento es grande en ENE.",
    secondaryCitation:
      "BioBioChile (06-ene-2025), citando estadísticas MiFuturo.",
    secondaryUrl: BIOBIO_MIFUTURO_2025,
  },
  "emprendimiento-local": {
    sourceCode: "ENRUTA_SYNTH",
    sourceName: "ENRUTA · nota pedagógica",
    sourceUrl: MIFUTURO_SIES,
    referenceYear: 2025,
    note: "No es una carrera con serie MiFuturo. Combina exploración de mercado local, SENCE/OTEC y datos sectoriales INE según el rubro del emprendimiento.",
  },
  "fuerzas-armadas-y-de-orden": {
    sourceCode: "ENRUTA_SYNTH",
    sourceName: "ENRUTA · nota pedagógica",
    sourceUrl: "https://www.mifuturo.cl/",
    referenceYear: 2025,
    note: "Procesos y remuneraciones institucionales propios (no serie MiFuturo de egresados ES). Consulta bases de postulación oficiales de cada institución.",
  },
  "estudio-y-trabajo": {
    sourceCode: "SIES_MIFUTURO",
    sourceName: "Mi Futuro / SIES + oferta IP/CFT",
    sourceUrl: MIFUTURO_SIES,
    referenceYear: 2024,
    note: "Ruta mixta: revisa modalidades vespertinas/online en Mi Futuro y la participación juvenil por sector en ENE-INE.",
  },
  "certificaciones-digitales-google-microsoft-cisco": {
    sourceCode: "INE_ENE",
    sourceName: "INE · ENE (TIC) + oferta de microcredenciales",
    sourceUrl:
      "https://www.ine.gob.cl/estadisticas-por-tema/mercado-laboral/ocupacion-y-desocupacion",
    referenceYear: 2024,
    note: "Sin serie MiFuturo de “carrera”. El sector TIC muestra alta relevancia juvenil; las certificaciones complementan CFT/IP/universidad o trabajo.",
  },
};

/** Enriquecimiento del catálogo: sectores, área formativa, grados y tracks */
export const CATALOG_PUBLIC_LINKS: Record<
  string,
  {
    laborSectorCode: string;
    educationAreaCode: string;
    targetGrades?: number[];
    trackTags?: string[];
  }
> = {
  "ingenieria-en-informatica": {
    laborSectorCode: "tic",
    educationAreaCode: "tecnologia",
    targetGrades: [2, 3, 4],
    trackTags: ["HC", "mixto"],
  },
  psicologia: {
    laborSectorCode: "salud",
    educationAreaCode: "social",
    targetGrades: [3, 4],
    trackTags: ["HC"],
  },
  enfermeria: {
    laborSectorCode: "salud",
    educationAreaCode: "salud",
    targetGrades: [2, 3, 4],
    trackTags: ["HC", "mixto"],
  },
  "pedagogia-en-educacion-media": {
    laborSectorCode: "educacion",
    educationAreaCode: "educacion",
    targetGrades: [3, 4],
    trackTags: ["HC"],
  },
  "diseno-grafico": {
    laborSectorCode: "profesional",
    educationAreaCode: "artes",
    targetGrades: [2, 3, 4],
    trackTags: ["HC", "mixto"],
  },
  "tecnico-a-en-agropecuaria": {
    laborSectorCode: "agro",
    educationAreaCode: "agropecuaria",
    targetGrades: [1, 2, 3, 4],
    trackTags: ["TP", "mixto"],
  },
  "electricidad-y-automatizacion": {
    laborSectorCode: "industria",
    educationAreaCode: "ingenieria",
    targetGrades: [1, 2, 3, 4],
    trackTags: ["TP", "mixto"],
  },
  gastronomia: {
    laborSectorCode: "turismo",
    educationAreaCode: "gastronomia",
    targetGrades: [1, 2, 3, 4],
    trackTags: ["TP", "mixto"],
  },
  "emprendimiento-local": {
    laborSectorCode: "comercio",
    educationAreaCode: "admin_comercio",
    targetGrades: [2, 3, 4],
    trackTags: ["HC", "TP", "mixto"],
  },
  "fuerzas-armadas-y-de-orden": {
    laborSectorCode: "admin",
    educationAreaCode: "social",
    targetGrades: [3, 4],
    trackTags: ["HC", "TP", "mixto"],
  },
  "administracion-de-empresas": {
    laborSectorCode: "comercio",
    educationAreaCode: "admin_comercio",
    targetGrades: [2, 3, 4],
    trackTags: ["HC", "mixto"],
  },
  "estudio-y-trabajo": {
    laborSectorCode: "comercio",
    educationAreaCode: "admin_comercio",
    targetGrades: [3, 4],
    trackTags: ["HC", "TP", "mixto"],
  },
  "tecnico-a-en-enfermeria": {
    laborSectorCode: "salud",
    educationAreaCode: "salud",
    targetGrades: [2, 3, 4],
    trackTags: ["TP", "mixto"],
  },
  "soldadura-y-estructuras-metalicas": {
    laborSectorCode: "industria",
    educationAreaCode: "ingenieria",
    targetGrades: [1, 2, 3, 4],
    trackTags: ["TP"],
  },
  "ingenieria-comercial": {
    laborSectorCode: "comercio",
    educationAreaCode: "admin_comercio",
    targetGrades: [3, 4],
    trackTags: ["HC"],
  },
  "certificaciones-digitales-google-microsoft-cisco": {
    laborSectorCode: "tic",
    educationAreaCode: "tecnologia",
    targetGrades: [2, 3, 4],
    trackTags: ["HC", "TP", "mixto"],
  },
  "trabajo-social": {
    laborSectorCode: "salud",
    educationAreaCode: "social",
    targetGrades: [3, 4],
    trackTags: ["HC", "mixto"],
  },
  "logistica-y-bodega": {
    laborSectorCode: "transporte",
    educationAreaCode: "admin_comercio",
    targetGrades: [1, 2, 3, 4],
    trackTags: ["TP", "mixto"],
  },
};

export const EXTRA_PUBLIC_CATALOG = [
  {
    type: "career" as const,
    title: "Técnico/a en Enfermería",
    description:
      "Apoyo en cuidados de salud en centros clínicos y comunitarios.",
    activities: "Asistir en procedimientos, registrar información, educar en salud.",
    skills: ["cuidado", "trabajo en equipo", "precisión"],
    dimensions: { R: 40, I: 45, A: 15, S: 88, E: 25, C: 55 },
    duration: "2–3 años (CFT/IP)",
    modality: "presencial",
    workAreas: ["salud", "clínicas", "APS"],
    accessRoutes: "CFT, IP; continuidad a enfermería en algunos casos.",
    laborSectorCode: "salud",
    educationAreaCode: "salud",
  },
  {
    type: "trade" as const,
    title: "Soldadura y estructuras metálicas",
    description: "Oficio industrial de fabricación y montaje metálico.",
    activities: "Soldar, interpretar planos, control de calidad de uniones.",
    skills: ["precisión", "seguridad", "trabajo manual"],
    dimensions: { R: 92, I: 40, A: 20, S: 15, E: 25, C: 45 },
    duration: "certificación / CFT",
    modality: "presencial",
    workAreas: ["industria", "construcción", "minería de servicios"],
    accessRoutes: "CFT, OTEC, especialidades TP metalmecánica.",
    laborSectorCode: "industria",
    educationAreaCode: "ingenieria",
  },
  {
    type: "career" as const,
    title: "Ingeniería Comercial",
    description: "Gestión de organizaciones, marketing y finanzas.",
    activities: "Analizar mercados, gestionar equipos, tomar decisiones de negocio.",
    skills: ["análisis", "comunicación", "liderazgo"],
    dimensions: { R: 15, I: 50, A: 25, S: 45, E: 85, C: 70 },
    duration: "4–5 años",
    modality: "presencial / online",
    workAreas: ["empresas", "consultoría", "emprendimiento"],
    accessRoutes: "Universidad; continuidad desde administración IP.",
    laborSectorCode: "comercio",
    educationAreaCode: "admin_comercio",
  },
  {
    type: "route" as const,
    title: "Certificaciones digitales (Google, Microsoft, Cisco…)",
    description:
      "Ruta flexible de microcredenciales para insertarse o complementar estudios.",
    activities: "Cursos cortos, proyectos prácticos, portafolio digital.",
    skills: ["autonomía", "aprendizaje continuo", "herramientas digitales"],
    dimensions: { R: 35, I: 70, A: 30, S: 25, E: 45, C: 55 },
    duration: "semanas a meses",
    modality: "online / híbrida",
    workAreas: ["tic", "servicios", "freelance"],
    accessRoutes: "Plataformas y OTEC; combinar con CFT/IP o trabajo.",
    laborSectorCode: "tic",
    educationAreaCode: "tecnologia",
  },
  {
    type: "career" as const,
    title: "Trabajo Social",
    description: "Intervención social con personas, familias y comunidades.",
    activities: "Entrevistas, gestión de redes, programas sociales.",
    skills: ["empatía", "análisis social", "trabajo comunitario"],
    dimensions: { R: 20, I: 45, A: 30, S: 92, E: 40, C: 40 },
    duration: "4–5 años / IP",
    modality: "presencial",
    workAreas: ["sector público", "ONG", "salud", "educación"],
    accessRoutes: "Universidad o IP.",
    laborSectorCode: "salud",
    educationAreaCode: "social",
  },
  {
    type: "trade" as const,
    title: "Logística y bodega",
    description: "Operación de bodegas, inventario y cadena de suministro.",
    activities: "Recepcionar, almacenar, despachar, usar WMS básico.",
    skills: ["organización", "trabajo físico moderado", "sistemas"],
    dimensions: { R: 65, I: 30, A: 10, S: 30, E: 35, C: 75 },
    duration: "CFT / certificación",
    modality: "presencial",
    workAreas: ["transporte", "comercio", "e-commerce"],
    accessRoutes: "CFT, capacitación SENCE, inserción laboral directa.",
    laborSectorCode: "transporte",
    educationAreaCode: "admin_comercio",
  },
];
