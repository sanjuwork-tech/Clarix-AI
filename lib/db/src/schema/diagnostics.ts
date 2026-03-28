import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const diagnosticsTable = pgTable("diagnostics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  examLevel: text("exam_level").notNull(),
  attemptNumber: integer("attempt_number").notNull().default(1),
  subjectsJson: text("subjects_json").notNull(),
  weakAreas: text("weak_areas").array().notNull().default([]),
  studyHours: text("study_hours"),
  report: text("report"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDiagnosticSchema = createInsertSchema(diagnosticsTable).omit({ id: true, createdAt: true, report: true });
export type InsertDiagnostic = z.infer<typeof insertDiagnosticSchema>;
export type Diagnostic = typeof diagnosticsTable.$inferSelect;
