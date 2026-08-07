import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", [
  "student",
  "guardian",
  "counselor",
  "psychologist",
  "head_teacher",
  "school_admin",
  "enruta_admin",
  "partner",
]);

export const schoolModalityEnum = pgEnum("school_modality", [
  "HC",
  "TP",
  "mixed",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "draft",
  "generated",
  "pending_review",
  "validated",
  "delivered",
  "updated",
]);

export const alertLevelEnum = pgEnum("alert_level", [
  "info",
  "follow_up",
  "priority",
  "restricted",
]);

export const alertStatusEnum = pgEnum("alert_status", [
  "open",
  "in_progress",
  "closed",
]);

export const responseStatusEnum = pgEnum("response_status", [
  "in_progress",
  "submitted",
]);

export const catalogTypeEnum = pgEnum("catalog_type", [
  "career",
  "trade",
  "route",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "charla",
  "taller",
  "visita",
  "feria",
  "webinar",
  "mentoria",
  "pasantia",
  "otro",
]);

export const schools = pgTable("schools", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  modality: schoolModalityEnum("modality").notNull().default("HC"),
  region: varchar("region", { length: 100 }),
  commune: varchar("commune", { length: 100 }),
  urbanRural: varchar("urban_rural", { length: 20 }).default("urbano"),
  connectivityLevel: varchar("connectivity_level", { length: 30 }).default(
    "media",
  ),
  peiSummary: text("pei_summary"),
  pmeSummary: text("pme_summary"),
  inviteCode: varchar("invite_code", { length: 40 }).notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 80 }).notNull(),
  gradeLevel: integer("grade_level").notNull(),
  specialtyTp: varchar("specialty_tp", { length: 120 }),
  year: integer("year").notNull().default(2026),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    fullName: varchar("full_name", { length: 200 }).notNull(),
    role: userRoleEnum("role").notNull(),
    schoolId: uuid("school_id").references(() => schools.id, {
      onDelete: "set null",
    }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  courseId: uuid("course_id").references(() => courses.id, {
    onDelete: "set null",
  }),
  gradeLevel: integer("grade_level").notNull().default(1),
  birthYear: integer("birth_year"),
  modality: schoolModalityEnum("modality").default("HC"),
  specialtyTp: varchar("specialty_tp", { length: 120 }),
  interestsSummary: text("interests_summary"),
  strengthsSummary: text("strengths_summary"),
  expectations: text("expectations"),
  familyContext: text("family_context"),
  territorialContext: text("territorial_context"),
  personalHistory: text("personal_history"),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  profileCompleted: boolean("profile_completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const professionals = pgTable("professionals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 120 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const studentAssignments = pgTable(
  "student_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    professionalId: uuid("professional_id")
      .notNull()
      .references(() => professionals.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("assignment_unique").on(t.professionalId, t.studentId),
  ],
);

export const consents = pgTable("consents", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 40 }).notNull(),
  accepted: boolean("accepted").notNull().default(false),
  documentVersion: varchar("document_version", { length: 20 })
    .notNull()
    .default("1.0"),
  signedAt: timestamp("signed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const assessments = pgTable("assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 60 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  targetGrades: integer("target_grades").array(),
  requiresConsent: boolean("requires_consent").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const assessmentVersions = pgTable("assessment_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  version: integer("version").notNull().default(1),
  scoringRules: jsonb("scoring_rules").$type<Record<string, unknown>>(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const assessmentSections = pgTable("assessment_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  versionId: uuid("version_id")
    .notNull()
    .references(() => assessmentVersions.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => assessmentSections.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 40 }).notNull().default("likert"),
  prompt: text("prompt").notNull(),
  helpText: text("help_text"),
  required: boolean("required").notNull().default(true),
  orderIndex: integer("order_index").notNull().default(0),
  config: jsonb("config").$type<Record<string, unknown>>(),
});

export const questionOptions = pgTable("question_options", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 200 }).notNull(),
  value: varchar("value", { length: 80 }).notNull(),
  scores: jsonb("scores").$type<Record<string, number>>().default({}),
  orderIndex: integer("order_index").notNull().default(0),
});

export const assessmentResponses = pgTable("assessment_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  versionId: uuid("version_id")
    .notNull()
    .references(() => assessmentVersions.id, { onDelete: "cascade" }),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  status: responseStatusEnum("status").notNull().default("in_progress"),
  progressPct: integer("progress_pct").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const assessmentAnswers = pgTable(
  "assessment_answers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    responseId: uuid("response_id")
      .notNull()
      .references(() => assessmentResponses.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    value: jsonb("value").$type<string | string[] | number | null>(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("answer_unique").on(t.responseId, t.questionId)],
);

export const assessmentResults = pgTable("assessment_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  responseId: uuid("response_id")
    .notNull()
    .references(() => assessmentResponses.id, { onDelete: "cascade" })
    .unique(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  dimensions: jsonb("dimensions")
    .$type<Record<string, number>>()
    .notNull()
    .default({}),
  topDimensions: jsonb("top_dimensions").$type<string[]>().default([]),
  summary: text("summary"),
  flags: jsonb("flags").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ReportContent = {
  introduction: string;
  processSummary: string;
  generalProfile: string;
  interests: string;
  skills: string;
  values: string;
  strengths: string;
  toExplore: string;
  routes: string;
  trades: string;
  activities: string;
  reflectionQuestions: string[];
  nextSteps: string[];
  actionPlan: string;
  disclaimer: string;
};

export const vocationalReports = pgTable("vocational_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  resultId: uuid("result_id").references(() => assessmentResults.id, {
    onDelete: "set null",
  }),
  status: reportStatusEnum("status").notNull().default("draft"),
  content: jsonb("content").$type<ReportContent>(),
  dimensionsSnapshot: jsonb("dimensions_snapshot").$type<
    Record<string, number>
  >(),
  generatedBy: varchar("generated_by", { length: 40 }).default("system"),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const reportReviews = pgTable("report_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: uuid("report_id")
    .notNull()
    .references(() => vocationalReports.id, { onDelete: "cascade" }),
  reviewerId: uuid("reviewer_id")
    .notNull()
    .references(() => users.id),
  decision: varchar("decision", { length: 40 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: uuid("id").defaultRandom().primaryKey(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  studentId: uuid("student_id").references(() => students.id, {
    onDelete: "cascade",
  }),
  level: alertLevelEnum("level").notNull().default("info"),
  type: varchar("type", { length: 80 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  status: alertStatusEnum("status").notNull().default("open"),
  assigneeId: uuid("assignee_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  closedAt: timestamp("closed_at", { withTimezone: true }),
});

/** Indicadores Chile asociados a un ítem del catálogo (MiFuturo / INE / etc.) */
export type CatalogChileMetrics = {
  /** Empleabilidad % (horizonte en employabilityHorizon) */
  employabilityPct?: number | null;
  /** p.ej. "al 4.º año de egreso" */
  employabilityHorizon?: string | null;
  /** Ingreso bruto promedio de referencia en CLP */
  incomeAvgClp?: number | null;
  /** p.ej. "al 3.er año de egreso" */
  incomeHorizon?: string | null;
  /** Rango opcional [min, max] CLP */
  incomeRangeClp?: [number, number] | null;
  /** Código interno de fuente (SIES_MIFUTURO, INE_ENE, …) */
  sourceCode: string;
  sourceName: string;
  sourceUrl: string;
  referenceYear: number;
  /** Nombre del programa en la fuente si difiere del título ENRUTA */
  sourceProgramLabel?: string | null;
  /** Cómo se obtuvo / limitaciones */
  note: string;
  /** Cita secundaria (p.ej. medio que reporta MiFuturo) */
  secondaryCitation?: string | null;
  secondaryUrl?: string | null;
};

export const catalogItems = pgTable("catalog_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: catalogTypeEnum("type").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  description: text("description").notNull(),
  activities: text("activities"),
  skills: jsonb("skills").$type<string[]>().default([]),
  interestTags: jsonb("interest_tags").$type<string[]>().default([]),
  dimensions: jsonb("dimensions")
    .$type<Record<string, number>>()
    .notNull()
    .default({}),
  duration: varchar("duration", { length: 80 }),
  modality: varchar("modality", { length: 80 }),
  requirements: text("requirements"),
  workAreas: jsonb("work_areas").$type<string[]>().default([]),
  accessRoutes: text("access_routes"),
  regionScope: varchar("region_scope", { length: 80 }).default("nacional"),
  /** Código de área laboral para cruce con datos públicos (INE/SIES) */
  laborSectorCode: varchar("labor_sector_code", { length: 40 }),
  educationAreaCode: varchar("education_area_code", { length: 40 }),
  /**
   * Empleabilidad / ingresos de referencia (Chile).
   * Ver data/public/README.md — no sustituyen la consulta oficial actualizada.
   */
  chileMetrics: jsonb("chile_metrics").$type<CatalogChileMetrics | null>(),
  /** Grados 1–4 medio para los que el ítem es especialmente pertinente */
  targetGrades: jsonb("target_grades").$type<number[]>().default([1, 2, 3, 4]),
  /** Etiquetas de trayectoria: HC, TP, mixto */
  trackTags: jsonb("track_tags").$type<string[]>().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Catálogo de fuentes públicas usadas en análisis */
export const publicDataSources = pgTable("public_data_sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 60 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  organization: varchar("organization", { length: 160 }).notNull(),
  url: text("url"),
  description: text("description"),
  licenseNote: text("license_note"),
  referenceYear: integer("reference_year"),
  lastImportedAt: timestamp("last_imported_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Indicadores de mercado laboral por sector (agregados).
 * Valores de referencia inspirados en series públicas INE/ENE;
 * no reemplazan la consulta oficial actualizada.
 */
export const laborMarketStats = pgTable(
  "labor_market_stats",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sectorCode: varchar("sector_code", { length: 40 }).notNull(),
    sectorName: varchar("sector_name", { length: 160 }).notNull(),
    region: varchar("region", { length: 80 }).notNull().default("Nacional"),
    employmentSharePct: real("employment_share_pct"),
    youthRelevance: integer("youth_relevance"), // 1-5
    formalJobOutlook: integer("formal_job_outlook"), // 1-5
    skillDemandNote: text("skill_demand_note"),
    riasecTags: jsonb("riasec_tags").$type<string[]>().default([]),
    sourceCode: varchar("source_code", { length: 60 }).notNull(),
    referenceYear: integer("reference_year").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("labor_sector_region_year").on(
      t.sectorCode,
      t.region,
      t.referenceYear,
    ),
  ],
);

/**
 * Estadísticas de áreas formativas (educación superior / TP).
 * Referencias de matrícula y tipo de institución inspiradas en reportes SIES.
 */
export const educationAreaStats = pgTable(
  "education_area_stats",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    areaCode: varchar("area_code", { length: 40 }).notNull(),
    areaName: varchar("area_name", { length: 160 }).notNull(),
    institutionTypes: jsonb("institution_types").$type<string[]>().default([]),
    enrollmentSharePct: real("enrollment_share_pct"),
    typicalDurationYears: real("typical_duration_years"),
    continuationNote: text("continuation_note"),
    riasecTags: jsonb("riasec_tags").$type<string[]>().default([]),
    sourceCode: varchar("source_code", { length: 60 }).notNull(),
    referenceYear: integer("reference_year").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("edu_area_year").on(t.areaCode, t.referenceYear),
  ],
);

/** Insights regionales de orientación (contexto territorial) */
export const regionalInsights = pgTable(
  "regional_insights",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    region: varchar("region", { length: 80 }).notNull(),
    headline: varchar("headline", { length: 220 }).notNull(),
    opportunitySectors: jsonb("opportunity_sectors").$type<string[]>().default([]),
    educationNotes: text("education_notes"),
    cautionNote: text("caution_note"),
    sourceCode: varchar("source_code", { length: 60 }).notNull(),
    referenceYear: integer("reference_year").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("region_year_unique").on(t.region, t.referenceYear)],
);

export const institutions = pgTable("institutions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  type: varchar("type", { length: 40 }).notNull(),
  region: varchar("region", { length: 100 }),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
});

export const savedAlternatives = pgTable(
  "saved_alternatives",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    catalogItemId: uuid("catalog_item_id")
      .notNull()
      .references(() => catalogItems.id, { onDelete: "cascade" }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("saved_unique").on(t.studentId, t.catalogItemId)],
);

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  schoolId: uuid("school_id").references(() => schools.id, {
    onDelete: "cascade",
  }),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  type: eventTypeEnum("type").notNull().default("charla"),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  modality: varchar("modality", { length: 40 }).default("presencial"),
  location: varchar("location", { length: 255 }),
  capacity: integer("capacity").default(30),
  recommendedGrades: integer("recommended_grades").array(),
  organizer: varchar("organizer", { length: 200 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const eventRegistrations = pgTable(
  "event_registrations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 40 }).notNull().default("inscrito"),
    attended: boolean("attended"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("event_reg_unique").on(t.eventId, t.studentId)],
);

export const portfolioItems = pgTable("portfolio_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 40 }).notNull().default("reflexion"),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body"),
  yearLabel: varchar("year_label", { length: 20 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const lifeProjects = pgTable("life_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" })
    .unique(),
  mainGoal: text("main_goal"),
  alternatives: text("alternatives"),
  motivations: text("motivations"),
  strengths: text("strengths"),
  obstacles: text("obstacles"),
  resources: text("resources"),
  supportPeople: text("support_people"),
  actions: jsonb("actions").$type<
    { title: string; dueDate?: string; done?: boolean }[]
  >(),
  planB: text("plan_b"),
  reflection: text("reflection"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 80 }),
  entityId: uuid("entity_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const guardians = pgTable("guardians", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  phone: varchar("phone", { length: 40 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const guardianStudents = pgTable(
  "guardian_students",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    guardianId: uuid("guardian_id")
      .notNull()
      .references(() => guardians.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    authorized: boolean("authorized").notNull().default(true),
    canViewSensitive: boolean("can_view_sensitive").notNull().default(false),
    familyExpectations: text("family_expectations"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("guardian_student_unique").on(t.guardianId, t.studentId)],
);

export const partnerProfiles = pgTable("partner_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  organizationName: varchar("organization_name", { length: 200 }).notNull(),
  organizationType: varchar("organization_type", { length: 60 }).default(
    "empresa",
  ),
  description: text("description"),
  region: varchar("region", { length: 100 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const followUps = pgTable("follow_ups", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  dayOffset: integer("day_offset").notNull(),
  status: varchar("status", { length: 40 }).notNull().default("pending"),
  dueAt: timestamp("due_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  whatDidAfter: text("what_did_after"),
  decisionChanged: text("decision_changed"),
  newAlternatives: text("new_alternatives"),
  difficulties: text("difficulties"),
  supportNeeded: text("support_needed"),
  nextStep: text("next_step"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body"),
  href: varchar("href", { length: 255 }),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  schoolName: varchar("school_name", { length: 200 }),
  status: varchar("status", { length: 40 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const featureFlags = pgTable(
  "feature_flags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    schoolId: uuid("school_id").references(() => schools.id, {
      onDelete: "cascade",
    }),
    key: varchar("key", { length: 80 }).notNull(),
    enabled: boolean("enabled").notNull().default(true),
    planCode: varchar("plan_code", { length: 40 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("feature_flag_unique").on(t.schoolId, t.key)],
);

export const gameSessions = pgTable("game_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  gameCode: varchar("game_code", { length: 60 }).notNull(),
  resultSummary: text("result_summary"),
  reflection: text("reflection"),
  choices: jsonb("choices").$type<Record<string, string>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const commercialPlans = pgTable("commercial_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
  modules: jsonb("modules").$type<string[]>().default([]),
  priceNote: varchar("price_note", { length: 120 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const schoolPlans = pgTable(
  "school_plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => commercialPlans.id, { onDelete: "cascade" }),
    startsAt: timestamp("starts_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    status: varchar("status", { length: 40 }).notNull().default("active"),
  },
  (t) => [uniqueIndex("school_plan_unique").on(t.schoolId, t.planId)],
);

export const institutionalDiagnostics = pgTable("institutional_diagnostics", {
  id: uuid("id").defaultRandom().primaryKey(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  createdBy: uuid("created_by").references(() => users.id),
  modality: schoolModalityEnum("modality").default("HC"),
  studentCount: integer("student_count"),
  coursesSummary: text("courses_summary"),
  specialties: text("specialties"),
  needs: text("needs"),
  territorialContext: text("territorial_context"),
  connectivity: varchar("connectivity", { length: 40 }),
  teamAvailable: text("team_available"),
  expectations: text("expectations"),
  objectives: text("objectives"),
  pei: text("pei"),
  pme: text("pme"),
  existingActivities: text("existing_activities"),
  alliances: text("alliances"),
  localOffer: text("local_offer"),
  reportContent: text("report_content"),
  status: varchar("status", { length: 40 }).notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const guardianAuthRequests = pgTable("guardian_auth_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  guardianEmail: varchar("guardian_email", { length: 255 }).notNull(),
  guardianName: varchar("guardian_name", { length: 200 }),
  otpCode: varchar("otp_code", { length: 10 }).notNull(),
  status: varchar("status", { length: 40 }).notNull().default("pending"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const eventMaterials = pgTable("event_materials", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  materialType: varchar("material_type", { length: 40 }).default("link"),
  url: text("url"),
  filePath: text("file_path"),
  mimeType: varchar("mime_type", { length: 100 }),
  sizeBytes: integer("size_bytes"),
  scanStatus: varchar("scan_status", { length: 40 }).default("clean"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const emailOutbox = pgTable("email_outbox", {
  id: uuid("id").defaultRandom().primaryKey(),
  toEmail: varchar("to_email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  body: text("body").notNull(),
  status: varchar("status", { length: 40 }).notNull().default("queued"),
  providerMeta: jsonb("provider_meta").$type<Record<string, unknown>>(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const mineducSyncLogs = pgTable("mineduc_sync_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  schoolId: uuid("school_id").references(() => schools.id),
  operation: varchar("operation", { length: 80 }).notNull(),
  requestPayload: jsonb("request_payload").$type<Record<string, unknown>>(),
  responsePayload: jsonb("response_payload").$type<Record<string, unknown>>(),
  status: varchar("status", { length: 40 }).notNull().default("stub_ok"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  keys: jsonb("keys").$type<{ p256dh?: string; auth?: string }>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(users, ({ one }) => ({
  school: one(schools, {
    fields: [users.schoolId],
    references: [schools.id],
  }),
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  professional: one(professionals, {
    fields: [users.id],
    references: [professionals.userId],
  }),
}));

export type User = typeof users.$inferSelect;
export type Student = typeof students.$inferSelect;
export type CatalogItem = typeof catalogItems.$inferSelect;
export type VocationalReport = typeof vocationalReports.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
