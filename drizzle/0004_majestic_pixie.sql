ALTER TABLE "catalog_items" ADD COLUMN "chile_metrics" jsonb;--> statement-breakpoint
ALTER TABLE "catalog_items" ADD COLUMN "target_grades" jsonb DEFAULT '[1,2,3,4]'::jsonb;--> statement-breakpoint
ALTER TABLE "catalog_items" ADD COLUMN "track_tags" jsonb DEFAULT '[]'::jsonb;