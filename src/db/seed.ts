import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./index";
import { asc, eq } from "drizzle-orm";
import {
  alerts,
  assessmentAnswers,
  assessmentResponses,
  assessmentResults,
  assessmentSections,
  assessmentVersions,
  assessments,
  catalogItems,
  consents,
  commercialPlans,
  contactMessages,
  courses,
  educationAreaStats,
  emailOutbox,
  eventMaterials,
  eventRegistrations,
  events,
  featureFlags,
  followUps,
  gameSessions,
  guardianAuthRequests,
  guardianStudents,
  guardians,
  institutions,
  institutionalDiagnostics,
  laborMarketStats,
  lifeProjects,
  mineducSyncLogs,
  notifications,
  partnerProfiles,
  passwordResetTokens,
  portfolioItems,
  professionals,
  publicDataSources,
  pushSubscriptions,
  questionOptions,
  questions,
  regionalInsights,
  reportReviews,
  savedAlternatives,
  schoolPlans,
  schools,
  studentAssignments,
  students,
  users,
  vocationalReports,
} from "./schema";
import { slugify } from "@/lib/utils";
import { buildReportContent } from "@/lib/reports";
import {
  CATALOG_CHILE_METRICS,
  CATALOG_PUBLIC_LINKS,
  EDUCATION_AREAS,
  EXTRA_PUBLIC_CATALOG,
  LABOR_SECTORS,
  PUBLIC_SOURCES,
  REGIONAL_INSIGHTS,
} from "@/data/public-stats";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "EnrutaDemo2026!";

async function hash(pw: string) {
  return bcrypt.hash(pw, 10);
}

async function main() {
  console.log("Seeding ENRUTA demo data...");
  const passwordHash = await hash(DEMO_PASSWORD);

  // Clean in dependency order (safe re-seed for demo)
  await db.delete(eventMaterials);
  await db.delete(eventRegistrations);
  await db.delete(events);
  await db.delete(savedAlternatives);
  await db.delete(portfolioItems);
  await db.delete(lifeProjects);
  await db.delete(reportReviews);
  await db.delete(vocationalReports);
  await db.delete(alerts);
  await db.delete(assessmentAnswers);
  await db.delete(assessmentResults);
  await db.delete(assessmentResponses);
  await db.delete(questionOptions);
  await db.delete(questions);
  await db.delete(assessmentSections);
  await db.delete(assessmentVersions);
  await db.delete(assessments);
  await db.delete(studentAssignments);
  await db.delete(consents);
  await db.delete(followUps);
  await db.delete(gameSessions);
  await db.delete(guardianAuthRequests);
  await db.delete(guardianStudents);
  await db.delete(guardians);
  await db.delete(partnerProfiles);
  await db.delete(notifications);
  await db.delete(passwordResetTokens);
  await db.delete(contactMessages);
  await db.delete(featureFlags);
  await db.delete(schoolPlans);
  await db.delete(institutionalDiagnostics);
  await db.delete(emailOutbox);
  await db.delete(mineducSyncLogs);
  await db.delete(pushSubscriptions);
  await db.delete(students);
  await db.delete(professionals);
  await db.delete(users);
  await db.delete(courses);
  await db.delete(catalogItems);
  await db.delete(laborMarketStats);
  await db.delete(educationAreaStats);
  await db.delete(regionalInsights);
  await db.delete(publicDataSources);
  await db.delete(institutions);
  await db.delete(schools);
  await db.delete(commercialPlans);

  const [schoolHC] = await db
    .insert(schools)
    .values({
      name: "Liceo Los Andes HC",
      modality: "HC",
      region: "Metropolitana",
      commune: "Santiago",
      urbanRural: "urbano",
      connectivityLevel: "alta",
      peiSummary: "Formación integral con énfasis en ciencias y humanidades.",
      pmeSummary: "Mejora de trayectorias postsecundarias y orientación vocacional.",
      inviteCode: "HC-DEMO",
    })
    .returning();

  const [schoolTP] = await db
    .insert(schools)
    .values({
      name: "Liceo Agropecuario Valle Verde TP",
      modality: "TP",
      region: "O'Higgins",
      commune: "San Fernando",
      urbanRural: "rural",
      connectivityLevel: "baja",
      peiSummary: "Especialidad agropecuaria vinculada al territorio.",
      pmeSummary: "Vinculación con el mundo del trabajo y educación superior TP.",
      inviteCode: "TP-DEMO",
    })
    .returning();

  const hcCourses = await db
    .insert(courses)
    .values([
      { schoolId: schoolHC.id, name: "1° Medio A", gradeLevel: 1, year: 2026 },
      { schoolId: schoolHC.id, name: "2° Medio A", gradeLevel: 2, year: 2026 },
      { schoolId: schoolHC.id, name: "3° Medio A", gradeLevel: 3, year: 2026 },
      { schoolId: schoolHC.id, name: "4° Medio A", gradeLevel: 4, year: 2026 },
    ])
    .returning();

  const tpCourses = await db
    .insert(courses)
    .values([
      {
        schoolId: schoolTP.id,
        name: "1° Medio A",
        gradeLevel: 1,
        year: 2026,
      },
      {
        schoolId: schoolTP.id,
        name: "2° Medio A",
        gradeLevel: 2,
        year: 2026,
      },
      {
        schoolId: schoolTP.id,
        name: "3° Medio Agropecuaria",
        gradeLevel: 3,
        year: 2026,
        specialtyTp: "Agropecuaria",
      },
      {
        schoolId: schoolTP.id,
        name: "4° Medio Agropecuaria",
        gradeLevel: 4,
        year: 2026,
        specialtyTp: "Agropecuaria",
      },
    ])
    .returning();

  const [admin] = await db
    .insert(users)
    .values({
      email: "admin@enruta.cl",
      passwordHash,
      fullName: "Admin ENRUTA",
      role: "enruta_admin",
    })
    .returning();

  const [orientador] = await db
    .insert(users)
    .values({
      email: "orientador@losandes.cl",
      passwordHash,
      fullName: "Camila Rojas Orientadora",
      role: "counselor",
      schoolId: schoolHC.id,
    })
    .returning();

  const [psicologo] = await db
    .insert(users)
    .values({
      email: "psicologo@losandes.cl",
      passwordHash,
      fullName: "Diego Muñoz Psicólogo",
      role: "psychologist",
      schoolId: schoolHC.id,
    })
    .returning();

  const [utp] = await db
    .insert(users)
    .values({
      email: "utp@losandes.cl",
      passwordHash,
      fullName: "Patricia Silva UTP",
      role: "school_admin",
      schoolId: schoolHC.id,
    })
    .returning();

  const [profesor] = await db
    .insert(users)
    .values({
      email: "profesor@losandes.cl",
      passwordHash,
      fullName: "Andrés Pérez Profesor Jefe",
      role: "head_teacher",
      schoolId: schoolHC.id,
    })
    .returning();

  const [orientadorTP] = await db
    .insert(users)
    .values({
      email: "orientador@valleverde.cl",
      passwordHash,
      fullName: "Javiera Campos Orientadora TP",
      role: "counselor",
      schoolId: schoolTP.id,
    })
    .returning();

  const [proHC] = await db
    .insert(professionals)
    .values({
      userId: orientador.id,
      schoolId: schoolHC.id,
      title: "Orientadora educacional",
    })
    .returning();

  await db.insert(professionals).values([
    {
      userId: psicologo.id,
      schoolId: schoolHC.id,
      title: "Psicólogo educacional",
    },
    {
      userId: orientadorTP.id,
      schoolId: schoolTP.id,
      title: "Orientadora TP",
    },
  ]);

  const studentDefs = [
    {
      email: "sofia.estudiante@demo.cl",
      name: "Sofía Ramírez",
      schoolId: schoolHC.id,
      courseId: hcCourses[2].id,
      grade: 3,
      modality: "HC" as const,
    },
    {
      email: "mateo.estudiante@demo.cl",
      name: "Mateo González",
      schoolId: schoolHC.id,
      courseId: hcCourses[1].id,
      grade: 2,
      modality: "HC" as const,
    },
    {
      email: "valentina.estudiante@demo.cl",
      name: "Valentina Soto",
      schoolId: schoolHC.id,
      courseId: hcCourses[0].id,
      grade: 1,
      modality: "HC" as const,
    },
    {
      email: "benjamin.estudiante@demo.cl",
      name: "Benjamín Lagos",
      schoolId: schoolHC.id,
      courseId: hcCourses[3].id,
      grade: 4,
      modality: "HC" as const,
    },
    {
      email: "isidora.tp@demo.cl",
      name: "Isidora Fuentes",
      schoolId: schoolTP.id,
      courseId: tpCourses[2].id,
      grade: 3,
      modality: "TP" as const,
      specialty: "Agropecuaria",
    },
    {
      email: "tomas.tp@demo.cl",
      name: "Tomás Herrera",
      schoolId: schoolTP.id,
      courseId: tpCourses[3].id,
      grade: 4,
      modality: "TP" as const,
      specialty: "Agropecuaria",
    },
  ];

  const studentRows: {
    user: typeof users.$inferSelect;
    student: typeof students.$inferSelect;
  }[] = [];
  for (const s of studentDefs) {
    const [u] = await db
      .insert(users)
      .values({
        email: s.email,
        passwordHash,
        fullName: s.name,
        role: "student",
        schoolId: s.schoolId,
      })
      .returning();
    const [st] = await db
      .insert(students)
      .values({
        userId: u.id,
        schoolId: s.schoolId,
        courseId: s.courseId,
        gradeLevel: s.grade,
        modality: s.modality,
        specialtyTp: s.specialty,
        interestsSummary: "Exploración en curso",
        strengthsSummary: "Curiosidad y trabajo en equipo",
        expectations: "Conocer rutas reales después de 4° medio",
        onboardingCompleted: true,
        profileCompleted: s.email === "sofia.estudiante@demo.cl",
      })
      .returning();
    studentRows.push({ user: u, student: st });
  }

  // Assign Sofía and Mateo to orientador HC
  await db.insert(studentAssignments).values(
    studentRows
      .filter((r) => r.student.schoolId === schoolHC.id)
      .map((r) => ({
        professionalId: proHC.id,
        studentId: r.student.id,
      })),
  );

  // Consents for Sofía
  const sofia = studentRows[0];
  await db.insert(consents).values([
    {
      studentId: sofia.student.id,
      type: "terms",
      accepted: true,
      signedAt: new Date(),
      documentVersion: "1.0",
    },
    {
      studentId: sofia.student.id,
      type: "data",
      accepted: true,
      signedAt: new Date(),
      documentVersion: "1.0",
    },
  ]);

  // Assessment
  const [assessment] = await db
    .insert(assessments)
    .values({
      code: "intereses-enruta-v1",
      title: "Cuestionario de intereses ENRUTA",
      description:
        "Instrumento propio de exploración de intereses. Resultados orientativos, no diagnósticos.",
      targetGrades: [1, 2, 3, 4],
      requiresConsent: true,
    })
    .returning();

  const [version] = await db
    .insert(assessmentVersions)
    .values({
      assessmentId: assessment.id,
      version: 1,
      scoringRules: { method: "riasec_weighted_likert", scale: [1, 5] },
      isActive: true,
    })
    .returning();

  const [section] = await db
    .insert(assessmentSections)
    .values({
      versionId: version.id,
      title: "¿Qué te llama la atención?",
      orderIndex: 0,
    })
    .returning();

  const items: { prompt: string; dim: string }[] = [
    { prompt: "Me gusta reparar, armar o mejorar cosas con mis manos.", dim: "R" },
    { prompt: "Disfruto estar al aire libre o en contacto con la naturaleza.", dim: "R" },
    { prompt: "Me interesa entender cómo funcionan las cosas (máquinas, cuerpos, sistemas).", dim: "I" },
    { prompt: "Me gusta investigar, experimentar o resolver enigmas.", dim: "I" },
    { prompt: "Me motiva dibujar, diseñar, escribir o crear contenido.", dim: "A" },
    { prompt: "Me gusta expresar ideas de forma original o artística.", dim: "A" },
    { prompt: "Me gusta ayudar a otras personas a aprender o sentirse mejor.", dim: "S" },
    { prompt: "Disfruto trabajar en equipo y escuchar distintas opiniones.", dim: "S" },
    { prompt: "Me interesa liderar proyectos o convencer a otros de una idea.", dim: "E" },
    { prompt: "Me motiva emprender o vender una idea o producto.", dim: "E" },
    { prompt: "Me siento cómodo/a organizando información, datos o horarios.", dim: "C" },
    { prompt: "Prefiero seguir procesos claros y ordenados.", dim: "C" },
    { prompt: "Me atrae usar herramientas, equipos o software técnico.", dim: "R" },
    { prompt: "Me gusta analizar datos o buscar patrones.", dim: "I" },
    { prompt: "Disfruto actividades creativas aunque no sean perfectas.", dim: "A" },
    { prompt: "Me interesa cuidar, orientar o acompañar a otras personas.", dim: "S" },
    { prompt: "Me gusta tomar la iniciativa cuando hay un problema grupal.", dim: "E" },
    { prompt: "Valoro la precisión y el detalle en lo que hago.", dim: "C" },
  ];

  for (let i = 0; i < items.length; i++) {
    const [q] = await db
      .insert(questions)
      .values({
        sectionId: section.id,
        type: "likert",
        prompt: items[i].prompt,
        helpText: "1 = Nada de acuerdo · 5 = Muy de acuerdo",
        required: true,
        orderIndex: i,
        config: { scaleMin: 1, scaleMax: 5, primaryDimension: items[i].dim },
      })
      .returning();

    const labels = [
      { label: "1 · Nada de acuerdo", value: "1", n: 1 },
      { label: "2 · Poco de acuerdo", value: "2", n: 2 },
      { label: "3 · Más o menos", value: "3", n: 3 },
      { label: "4 · De acuerdo", value: "4", n: 4 },
      { label: "5 · Muy de acuerdo", value: "5", n: 5 },
    ];
    await db.insert(questionOptions).values(
      labels.map((l, oi) => ({
        questionId: q.id,
        label: l.label,
        value: l.value,
        scores: { [items[i].dim]: 3 },
        orderIndex: oi,
      })),
    );
  }

  // ── Demo assessments + vocational reports (critical for pro/student demos) ──
  console.log("Seeding demo assessment submissions and reports...");
  const seededQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.sectionId, section.id))
    .orderBy(asc(questions.orderIndex));

  async function seedStudentAssessment(opts: {
    student: (typeof studentRows)[0];
    likertByDim: Record<string, string>;
    dimensions: Record<string, number>;
    topDimensions: string[];
    reportStatus: "pending_review" | "delivered";
    reviewedBy?: string;
  }) {
    const [response] = await db
      .insert(assessmentResponses)
      .values({
        versionId: version.id,
        studentId: opts.student.student.id,
        status: "submitted",
        progressPct: 100,
        submittedAt: new Date(),
      })
      .returning();

    for (const q of seededQuestions) {
      const dim =
        (q.config as { primaryDimension?: string } | null)?.primaryDimension ??
        "S";
      const value = opts.likertByDim[dim] ?? "3";
      await db.insert(assessmentAnswers).values({
        responseId: response.id,
        questionId: q.id,
        value,
      });
    }

    const [result] = await db
      .insert(assessmentResults)
      .values({
        responseId: response.id,
        studentId: opts.student.student.id,
        dimensions: opts.dimensions,
        topDimensions: opts.topDimensions,
        summary: `Perfil demo con énfasis en ${opts.topDimensions.join(", ")}. Resultados orientativos.`,
        flags: [],
      })
      .returning();

    const content = buildReportContent({
      studentName: opts.student.user.fullName,
      gradeLevel: opts.student.student.gradeLevel,
      dimensions: opts.dimensions,
      topDimensions: opts.topDimensions,
      interestsSummary: opts.student.student.interestsSummary,
      strengthsSummary: opts.student.student.strengthsSummary,
    });

    const [report] = await db
      .insert(vocationalReports)
      .values({
        studentId: opts.student.student.id,
        schoolId: opts.student.student.schoolId,
        resultId: result.id,
        status: opts.reportStatus,
        content,
        dimensionsSnapshot: opts.dimensions,
        generatedBy: "system",
        reviewedBy: opts.reviewedBy ?? null,
        reviewNotes:
          opts.reportStatus === "delivered"
            ? "Validado en seed demo. Lenguaje orientativo revisado."
            : null,
        deliveredAt: opts.reportStatus === "delivered" ? new Date() : null,
      })
      .returning();

    if (opts.reportStatus === "pending_review") {
      await db.insert(alerts).values({
        schoolId: opts.student.student.schoolId,
        studentId: opts.student.student.id,
        level: "follow_up",
        type: "report_pending_review",
        title: "Informe pendiente de revisión",
        description: `El informe de ${opts.student.user.fullName} está listo para validación profesional.`,
        status: "open",
        assigneeId: orientador.id,
      });
    }

    return report;
  }

  // Sofía: informe listo para mediación (cola pro)
  await seedStudentAssessment({
    student: sofia,
    likertByDim: { S: "5", I: "5", A: "4", R: "2", E: "3", C: "3" },
    dimensions: { R: 32, I: 78, A: 55, S: 96, E: 42, C: 40 },
    topDimensions: ["S", "I", "A"],
    reportStatus: "pending_review",
  });

  // Benjamín (4°): informe ya entregado
  const benjamin = studentRows.find(
    (r) => r.user.email === "benjamin.estudiante@demo.cl",
  );
  if (benjamin) {
    await seedStudentAssessment({
      student: benjamin,
      likertByDim: { E: "5", C: "4", I: "4", R: "3", S: "3", A: "2" },
      dimensions: { R: 45, I: 62, A: 28, S: 40, E: 88, C: 70 },
      topDimensions: ["E", "C", "I"],
      reportStatus: "delivered",
      reviewedBy: orientador.id,
    });
  }

  // Fuentes e indicadores públicos de referencia
  console.log("Seeding public reference data (INE / SIES / MINEDUC)...");
  await db.insert(publicDataSources).values(
    PUBLIC_SOURCES.map((s) => ({
      code: s.code,
      name: s.name,
      organization: s.organization,
      url: s.url,
      description: s.description,
      licenseNote: s.licenseNote,
      referenceYear: s.referenceYear,
      lastImportedAt: new Date(),
    })),
  );
  await db.insert(laborMarketStats).values(
    LABOR_SECTORS.map((s) => ({
      sectorCode: s.sectorCode,
      sectorName: s.sectorName,
      region: s.region,
      employmentSharePct: s.employmentSharePct,
      youthRelevance: s.youthRelevance,
      formalJobOutlook: s.formalJobOutlook,
      skillDemandNote: s.skillDemandNote,
      riasecTags: [...s.riasecTags],
      sourceCode: s.sourceCode,
      referenceYear: s.referenceYear,
    })),
  );
  await db.insert(educationAreaStats).values(
    EDUCATION_AREAS.map((s) => ({
      areaCode: s.areaCode,
      areaName: s.areaName,
      institutionTypes: [...s.institutionTypes],
      enrollmentSharePct: s.enrollmentSharePct,
      typicalDurationYears: s.typicalDurationYears,
      continuationNote: s.continuationNote,
      riasecTags: [...s.riasecTags],
      sourceCode: s.sourceCode,
      referenceYear: s.referenceYear,
    })),
  );
  await db.insert(regionalInsights).values(
    REGIONAL_INSIGHTS.map((s) => ({
      region: s.region,
      headline: s.headline,
      opportunitySectors: [...s.opportunitySectors],
      educationNotes: s.educationNotes,
      cautionNote: s.cautionNote,
      sourceCode: s.sourceCode,
      referenceYear: s.referenceYear,
    })),
  );

  // Catalog
  const catalog = [
    {
      type: "career" as const,
      title: "Ingeniería en Informática",
      description:
        "Diseño, desarrollo y mantención de sistemas de software y soluciones digitales.",
      activities: "Programar, analizar requisitos, trabajar en equipos ágiles.",
      skills: ["lógica", "resolución de problemas", "trabajo en equipo"],
      dimensions: { R: 40, I: 85, A: 35, S: 25, E: 40, C: 55 },
      duration: "4–5 años",
      modality: "presencial / online",
      workAreas: ["tecnología", "servicios", "industria"],
      accessRoutes: "Universidad o IP; vía PAES u otros mecanismos.",
    },
    {
      type: "career" as const,
      title: "Psicología",
      description:
        "Estudio del comportamiento y acompañamiento a personas y comunidades.",
      activities: "Entrevistas, evaluación, intervención, investigación.",
      skills: ["empatía", "escucha", "análisis"],
      dimensions: { R: 15, I: 60, A: 40, S: 90, E: 35, C: 40 },
      duration: "5 años + especialización",
      modality: "presencial",
      workAreas: ["salud", "educación", "organizaciones"],
      accessRoutes: "Universidad.",
    },
    {
      type: "career" as const,
      title: "Enfermería",
      description: "Cuidado de la salud y acompañamiento de pacientes.",
      activities: "Atención clínica, educación en salud, trabajo en equipo.",
      skills: ["cuidado", "precisión", "resistencia emocional"],
      dimensions: { R: 45, I: 55, A: 20, S: 85, E: 30, C: 50 },
      duration: "5 años",
      modality: "presencial",
      workAreas: ["salud pública", "clínicas", "comunidad"],
      accessRoutes: "Universidad.",
    },
    {
      type: "career" as const,
      title: "Pedagogía en Educación Media",
      description: "Formación de docentes para enseñanza media.",
      activities: "Planificar clases, evaluar, acompañar estudiantes.",
      skills: ["comunicación", "paciencia", "organización"],
      dimensions: { R: 20, I: 45, A: 40, S: 90, E: 40, C: 45 },
      duration: "4–5 años",
      modality: "presencial",
      workAreas: ["educación"],
      accessRoutes: "Universidad; programas de pedagogía.",
    },
    {
      type: "career" as const,
      title: "Diseño Gráfico",
      description: "Comunicación visual para marcas, productos y medios.",
      activities: "Diseñar piezas, prototipar, trabajar con clientes.",
      skills: ["creatividad", "software de diseño", "comunicación"],
      dimensions: { R: 25, I: 30, A: 90, S: 35, E: 50, C: 35 },
      duration: "4 años / IP",
      modality: "presencial / online",
      workAreas: ["agencia", "freelance", "medios"],
      accessRoutes: "Universidad o IP.",
    },
    {
      type: "trade" as const,
      title: "Técnico/a en Agropecuaria",
      description:
        "Producción agrícola y pecuaria con foco en territorio y sustentabilidad.",
      activities: "Manejo de cultivos, animales, maquinaria y registros.",
      skills: ["trabajo práctico", "observación", "responsabilidad"],
      dimensions: { R: 90, I: 45, A: 20, S: 30, E: 35, C: 40 },
      duration: "2–3 años / TP media",
      modality: "presencial",
      workAreas: ["agro", "empresas rurales", "emprendimiento"],
      accessRoutes: "Especialidad TP, CFT, IP.",
    },
    {
      type: "trade" as const,
      title: "Electricidad y automatización",
      description: "Instalaciones eléctricas y sistemas automatizados.",
      activities: "Instalar, diagnosticar fallas, mantener equipos.",
      skills: ["precisión", "seguridad", "resolución práctica"],
      dimensions: { R: 85, I: 55, A: 15, S: 20, E: 30, C: 50 },
      duration: "2–3 años",
      modality: "presencial",
      workAreas: ["construcción", "industria", "servicios"],
      accessRoutes: "CFT, IP, certificaciones.",
    },
    {
      type: "trade" as const,
      title: "Gastronomía",
      description: "Preparación de alimentos y gestión de cocina.",
      activities: "Cocinar, planificar menús, higiene y servicio.",
      skills: ["creatividad práctica", "organización", "resistencia"],
      dimensions: { R: 70, I: 25, A: 60, S: 45, E: 40, C: 35 },
      duration: "2–3 años",
      modality: "presencial",
      workAreas: ["restaurantes", "hotelería", "emprendimiento"],
      accessRoutes: "CFT, IP, oficios.",
    },
    {
      type: "route" as const,
      title: "Emprendimiento local",
      description: "Crear un proyecto propio vinculado a necesidades del territorio.",
      activities: "Validar idea, prototipar, vender, gestionar finanzas básicas.",
      skills: ["iniciativa", "persistencia", "aprendizaje continuo"],
      dimensions: { R: 40, I: 35, A: 45, S: 40, E: 90, C: 45 },
      duration: "variable",
      modality: "híbrida",
      workAreas: ["comercio", "servicios", "producción"],
      accessRoutes: "Capacitaciones, incubadoras, estudio + trabajo.",
    },
    {
      type: "route" as const,
      title: "Fuerzas Armadas y de Orden",
      description:
        "Carreras institucionales con formación propia y servicio público.",
      activities: "Formación disciplinar, servicio, especialidades técnicas.",
      skills: ["disciplina", "trabajo en equipo", "resistencia"],
      dimensions: { R: 60, I: 35, A: 15, S: 50, E: 40, C: 55 },
      duration: "según institución",
      modality: "presencial",
      workAreas: ["servicio público", "seguridad", "logística"],
      accessRoutes: "Procesos de postulación institucionales.",
    },
    {
      type: "career" as const,
      title: "Administración de Empresas",
      description: "Gestión de organizaciones, finanzas y personas.",
      activities: "Planificar, analizar indicadores, coordinar equipos.",
      skills: ["organización", "comunicación", "números"],
      dimensions: { R: 20, I: 40, A: 25, S: 45, E: 75, C: 80 },
      duration: "4 años / IP",
      modality: "presencial / online",
      workAreas: ["empresas", "sector público", "emprendimiento"],
      accessRoutes: "Universidad, IP, CFT.",
    },
    {
      type: "route" as const,
      title: "Estudio y trabajo",
      description:
        "Combinar formación continua con inserción laboral temprana.",
      activities: "Estudiar de noche/online, trabajar de día, practicar oficios.",
      skills: ["organización del tiempo", "autonomía"],
      dimensions: { R: 50, I: 40, A: 30, S: 40, E: 55, C: 50 },
      duration: "flexible",
      modality: "híbrida",
      workAreas: ["diversos"],
      accessRoutes: "CFT/IP vespertino, certificaciones, trabajo directo.",
    },
  ];

  for (const c of catalog) {
    const slug = slugify(c.title);
    const link = CATALOG_PUBLIC_LINKS[slug];
    await db.insert(catalogItems).values({
      type: c.type,
      title: c.title,
      slug,
      description: c.description,
      activities: c.activities,
      skills: c.skills,
      interestTags: c.skills,
      dimensions: c.dimensions,
      duration: c.duration,
      modality: c.modality,
      workAreas: c.workAreas,
      accessRoutes: c.accessRoutes,
      requirements: "Revisar requisitos vigentes de cada institución.",
      laborSectorCode: link?.laborSectorCode,
      educationAreaCode: link?.educationAreaCode,
      chileMetrics: CATALOG_CHILE_METRICS[slug] ?? null,
      targetGrades: link?.targetGrades ?? [1, 2, 3, 4],
      trackTags: link?.trackTags ?? [],
    });
  }

  for (const c of EXTRA_PUBLIC_CATALOG) {
    const slug = slugify(c.title);
    const link = CATALOG_PUBLIC_LINKS[slug];
    await db.insert(catalogItems).values({
      type: c.type,
      title: c.title,
      slug,
      description: c.description,
      activities: c.activities,
      skills: c.skills,
      interestTags: c.skills,
      dimensions: c.dimensions,
      duration: c.duration,
      modality: c.modality,
      workAreas: c.workAreas,
      accessRoutes: c.accessRoutes,
      requirements: "Revisar requisitos vigentes de cada institución.",
      laborSectorCode: c.laborSectorCode,
      educationAreaCode: c.educationAreaCode,
      chileMetrics: CATALOG_CHILE_METRICS[slug] ?? null,
      targetGrades: link?.targetGrades ?? [2, 3, 4],
      trackTags: link?.trackTags ?? [],
    });
  }

  // Backfill codes / metrics for all known slugs
  for (const [slug, link] of Object.entries(CATALOG_PUBLIC_LINKS)) {
    await db
      .update(catalogItems)
      .set({
        laborSectorCode: link.laborSectorCode,
        educationAreaCode: link.educationAreaCode,
        chileMetrics: CATALOG_CHILE_METRICS[slug] ?? null,
        targetGrades: link.targetGrades ?? [1, 2, 3, 4],
        trackTags: link.trackTags ?? [],
      })
      .where(eq(catalogItems.slug, slug));
  }

  await db.insert(institutions).values([
    {
      name: "Universidad del Valle Central (demo)",
      type: "university",
      region: "Metropolitana",
      description: "Oferta HC y profesional de demostración.",
    },
    {
      name: "Instituto Profesional Ruta Sur (demo)",
      type: "ip",
      region: "O'Higgins",
      description: "Carreras técnicas y profesionales.",
    },
    {
      name: "CFT Horizonte (demo)",
      type: "cft",
      region: "Metropolitana",
      description: "Formación técnica de ciclo corto.",
    },
    {
      name: "Agroempresa El Roble (demo)",
      type: "company",
      region: "O'Higgins",
      description: "Empresa para visitas y charlas TP.",
    },
  ]);

  await db.insert(events).values([
    {
      schoolId: schoolHC.id,
      title: "Charla: Un día en la vida de una ingeniera de software",
      description: "Experiencia real y espacio de preguntas.",
      type: "charla",
      startsAt: new Date("2026-09-15T15:00:00-03:00"),
      modality: "online",
      location: "Meet ENRUTA",
      capacity: 40,
      recommendedGrades: [2, 3, 4],
      organizer: "Universidad del Valle Central",
    },
    {
      schoolId: schoolTP.id,
      title: "Visita a Agroempresa El Roble",
      description: "Recorrido por faenas y conversación con técnicos.",
      type: "visita",
      startsAt: new Date("2026-09-20T09:00:00-03:00"),
      modality: "presencial",
      location: "San Fernando",
      capacity: 25,
      recommendedGrades: [3, 4],
      organizer: "Agroempresa El Roble",
    },
    {
      schoolId: schoolHC.id,
      title: "Taller: Manejo de la frustración en la toma de decisiones",
      description: "Herramientas socioemocionales para la etapa de exploración.",
      type: "taller",
      startsAt: new Date("2026-10-01T11:00:00-03:00"),
      modality: "presencial",
      location: "Sala de orientación",
      capacity: 30,
      recommendedGrades: [3, 4],
      organizer: "Equipo de orientación",
    },
  ]);

  // Sofía portfolio + life project stub
  await db.insert(portfolioItems).values({
    studentId: sofia.student.id,
    type: "reflexion",
    title: "Lo que descubrí esta semana",
    body: "Me di cuenta de que me gusta resolver problemas y también ayudar a mis compañeros.",
    yearLabel: "3° medio",
  });

  await db.insert(lifeProjects).values({
    studentId: sofia.student.id,
    mainGoal: "Explorar carreras vinculadas a tecnología y trabajo con personas.",
    alternatives: "Informática, pedagogía en media, diseño de experiencias.",
    motivations: "Quiero un trabajo con impacto y aprendizaje constante.",
    strengths: "Curiosidad, constancia, trabajo en equipo.",
    obstacles: "Inseguridad sobre costos de estudios.",
    resources: "Familia, orientación escolar, becas por investigar.",
    supportPeople: "Orientadora Camila, apoderada, profesora de matemáticas.",
    actions: [
      { title: "Completar cuestionario de intereses", done: false },
      { title: "Guardar 3 alternativas en el explorador", done: false },
    ],
    planB: "IP o CFT en área digital mientras trabajo.",
    reflection: "Todavía no decido y está bien. Quiero explorar con calma.",
  });

  await db.insert(alerts).values([
    {
      schoolId: schoolHC.id,
      studentId: studentRows[1].student.id,
      level: "follow_up",
      type: "incomplete_assessment",
      title: "Cuestionario incompleto",
      description: "Mateo aún no completa el cuestionario de intereses.",
      status: "open",
      assigneeId: orientador.id,
    },
  ]);

  // Apoderado de Sofía
  const [guardianUser] = await db
    .insert(users)
    .values({
      email: "apoderado.sofia@demo.cl",
      passwordHash,
      fullName: "Carolina Ramírez (apoderada)",
      role: "guardian",
      schoolId: schoolHC.id,
    })
    .returning();
  const [guardian] = await db
    .insert(guardians)
    .values({ userId: guardianUser.id, phone: "+56 9 1234 5678" })
    .returning();
  await db.insert(guardianStudents).values({
    guardianId: guardian.id,
    studentId: sofia.student.id,
    authorized: true,
    canViewSensitive: false,
    familyExpectations:
      "Queremos que explore con calma y conozca opciones técnicas y universitarias.",
  });

  // Partner
  const [partnerUser] = await db
    .insert(users)
    .values({
      email: "partner@agroelroble.cl",
      passwordHash,
      fullName: "Encargado Vinculación El Roble",
      role: "partner",
    })
    .returning();
  await db.insert(partnerProfiles).values({
    userId: partnerUser.id,
    organizationName: "Agroempresa El Roble",
    organizationType: "empresa",
    description: "Empresa demo para visitas y charlas del sector agropecuario.",
    region: "O'Higgins",
    contactEmail: "partner@agroelroble.cl",
  });

  const planRows = await db
    .insert(commercialPlans)
    .values([
      {
        code: "diagnostico",
        name: "ENRUTA Diagnóstico",
        description:
          "Diagnóstico institucional, instrumentos, perfil grupal y talleres iniciales.",
        modules: ["diagnostics", "assessments", "reports"],
        priceNote: "Precio configurable por admin",
      },
      {
        code: "piloto",
        name: "ENRUTA Piloto",
        description:
          "Acompañamiento, plataforma, actividades, charlas y exploración.",
        modules: [
          "diagnostics",
          "assessments",
          "reports",
          "events",
          "catalog",
          "games",
          "portfolio",
        ],
        priceNote: "Precio configurable por admin",
      },
      {
        code: "4anos",
        name: "ENRUTA 4 Años",
        description:
          "Programa completo 1° a 4° medio con seguimiento longitudinal.",
        modules: [
          "diagnostics",
          "assessments",
          "reports",
          "events",
          "catalog",
          "games",
          "portfolio",
          "life_project",
          "follow_ups",
        ],
        priceNote: "Precio configurable por admin",
      },
    ])
    .returning();

  const plan4 = planRows.find((p) => p.code === "4anos")!;
  await db.insert(schoolPlans).values([
    { schoolId: schoolHC.id, planId: plan4.id, status: "active" },
    { schoolId: schoolTP.id, planId: plan4.id, status: "active" },
  ]);

  // Feature flags por colegio
  for (const school of [schoolHC, schoolTP]) {
    await db.insert(featureFlags).values([
      { schoolId: school.id, key: "portfolio", enabled: true, planCode: "4anos" },
      { schoolId: school.id, key: "events", enabled: true, planCode: "4anos" },
      { schoolId: school.id, key: "games", enabled: true, planCode: "piloto" },
      {
        schoolId: school.id,
        key: "follow_ups",
        enabled: true,
        planCode: "4anos",
      },
      {
        schoolId: school.id,
        key: "life_project",
        enabled: true,
        planCode: "4anos",
      },
      {
        schoolId: school.id,
        key: "diagnostics",
        enabled: true,
        planCode: "4anos",
      },
    ]);
  }

  // Seguimientos + notificación para Sofía
  const now = Date.now();
  await db.insert(followUps).values(
    [30, 90, 180].map((d) => ({
      studentId: sofia.student.id,
      dayOffset: d,
      status: "pending",
      dueAt: new Date(now + d * 24 * 60 * 60 * 1000),
    })),
  );
  await db.insert(notifications).values([
    {
      userId: sofia.user.id,
      title: "Bienvenida a ENRUTA",
      body: "Tu ruta está lista. Completa el cuestionario cuando quieras.",
      href: "/app/cuestionarios",
    },
    {
      userId: orientador.id,
      title: "Alerta de seguimiento",
      body: "Mateo tiene un cuestionario incompleto.",
      href: "/pro/alertas",
    },
  ]);

  console.log("Seed complete.");
  console.log("Demo password for all users:", DEMO_PASSWORD);
  console.log("Invite codes: HC-DEMO, TP-DEMO");
  console.log(
    "Users: admin@enruta.cl, orientador@losandes.cl, sofia.estudiante@demo.cl, apoderado.sofia@demo.cl, partner@agroelroble.cl",
  );
  void admin;
  void profesor;
  void utp;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
