import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { z } from "zod";

export const diagnosticsTable = pgTable("diagnostics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  examLevel: text("exam_level").notNull(),
  attemptNumber: integer("attempt_number").notNull().default(1),
  subjectsJson: text("subjects_json").notNull().default("[]"),
  weakAreas: text("weak_areas").array().notNull().default([]),
  studyHours: text("study_hours"),
  formDataJson: text("form_data_json"),
  report: text("report"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Diagnostic = typeof diagnosticsTable.$inferSelect;

export const InsertDiagnosticSchema = z.object({
  name: z.string(),
  email: z.string(),
  examLevel: z.string(),
  attemptNumber: z.number().int().default(1),
  subjectsJson: z.string().default("[]"),
  weakAreas: z.array(z.string()).default([]),
  studyHours: z.string().nullable().optional(),
  formDataJson: z.string().nullable().optional(),
});
export type InsertDiagnostic = z.infer<typeof InsertDiagnosticSchema>;
