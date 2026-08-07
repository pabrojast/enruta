CREATE TABLE "education_area_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"area_code" varchar(40) NOT NULL,
	"area_name" varchar(160) NOT NULL,
	"institution_types" jsonb DEFAULT '[]'::jsonb,
	"enrollment_share_pct" real,
	"typical_duration_years" real,
	"continuation_note" text,
	"riasec_tags" jsonb DEFAULT '[]'::jsonb,
	"source_code" varchar(60) NOT NULL,
	"reference_year" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "labor_market_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sector_code" varchar(40) NOT NULL,
	"sector_name" varchar(160) NOT NULL,
	"region" varchar(80) DEFAULT 'Nacional' NOT NULL,
	"employment_share_pct" real,
	"youth_relevance" integer,
	"formal_job_outlook" integer,
	"skill_demand_note" text,
	"riasec_tags" jsonb DEFAULT '[]'::jsonb,
	"source_code" varchar(60) NOT NULL,
	"reference_year" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_data_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(60) NOT NULL,
	"name" varchar(200) NOT NULL,
	"organization" varchar(160) NOT NULL,
	"url" text,
	"description" text,
	"license_note" text,
	"reference_year" integer,
	"last_imported_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "public_data_sources_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "regional_insights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"region" varchar(80) NOT NULL,
	"headline" varchar(220) NOT NULL,
	"opportunity_sectors" jsonb DEFAULT '[]'::jsonb,
	"education_notes" text,
	"caution_note" text,
	"source_code" varchar(60) NOT NULL,
	"reference_year" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "catalog_items" ADD COLUMN "labor_sector_code" varchar(40);--> statement-breakpoint
ALTER TABLE "catalog_items" ADD COLUMN "education_area_code" varchar(40);--> statement-breakpoint
CREATE UNIQUE INDEX "edu_area_year" ON "education_area_stats" USING btree ("area_code","reference_year");--> statement-breakpoint
CREATE UNIQUE INDEX "labor_sector_region_year" ON "labor_market_stats" USING btree ("sector_code","region","reference_year");--> statement-breakpoint
CREATE UNIQUE INDEX "region_year_unique" ON "regional_insights" USING btree ("region","reference_year");