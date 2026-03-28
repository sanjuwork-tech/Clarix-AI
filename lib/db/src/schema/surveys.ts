import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const surveysTable = pgTable("surveys", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: text("age").notNull(),
  gender: text("gender").notNull(),
  qualification: text("qualification").notNull(),
  qualificationOther: text("qualification_other"),
  services: text("services").array().notNull().default([]),
  experience: text("experience"),
  ideas: text("ideas").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSurveySchema = createInsertSchema(surveysTable).omit({ id: true, createdAt: true });
export type InsertSurvey = z.infer<typeof insertSurveySchema>;
export type Survey = typeof surveysTable.$inferSelect;
