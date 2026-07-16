import { z } from "zod";

/**
 * The Case Definition Language has exactly two row "Type" values.
 * META rows carry one Key/Value pair each. EVENT rows carry the timeline columns.
 */
export const CSV_COLUMNS = [
  "Type",
  "Key",
  "Value",
  "ID",
  "Time",
  "Source",
  "Actor",
  "Action",
  "Object",
  "Target",
  "Location",
  "Description",
  "Importance",
] as const;

export const REQUIRED_META_KEYS = [
  "CASE_ID",
  "TITLE",
  "DIFFICULTY",
  "CATEGORY",
  "TIME_LIMIT",
  "MAX_SCORE",
  "STORY",
  "QUESTION",
  "CULPRIT",
  "SOLUTION",
  "REFERENCE_EVENTS",
  "HINT",
] as const;

export const rawMetaSchema = z.object({
  CASE_ID: z.string().min(1, "CASE_ID cannot be empty"),
  TITLE: z.string().min(1, "TITLE cannot be empty"),
  DIFFICULTY: z.enum(["Easy", "Medium", "Hard"], {
    errorMap: () => ({ message: "DIFFICULTY must be Easy, Medium, or Hard" }),
  }),
  CATEGORY: z.string().min(1, "CATEGORY cannot be empty"),
  TIME_LIMIT: z.coerce.number().int().positive("TIME_LIMIT must be a positive number of minutes"),
  MAX_SCORE: z.coerce.number().int().positive("MAX_SCORE must be a positive number"),
  STORY: z.string().min(10, "STORY should be at least a sentence long"),
  QUESTION: z.string().min(5, "QUESTION cannot be empty"),
  CULPRIT: z.string().min(1, "CULPRIT cannot be empty"),
  SOLUTION: z.string().min(10, "SOLUTION should be at least a sentence long"),
  REFERENCE_EVENTS: z.string().min(1, "REFERENCE_EVENTS cannot be empty"),
  HINT: z.string().min(1, "HINT cannot be empty"),
});

export const rawEventSchema = z.object({
  ID: z.string().min(1, "Event ID cannot be empty"),
  Time: z.string().min(1, "Time cannot be empty"),
  Source: z.string().min(1, "Source cannot be empty"),
  Actor: z.string().min(1, "Actor cannot be empty"),
  Action: z.string().min(1, "Action cannot be empty"),
  Object: z.string().optional().default(""),
  Target: z.string().optional().default(""),
  Location: z.string().min(1, "Location cannot be empty"),
  Description: z.string().min(1, "Description cannot be empty"),
  Importance: z.coerce
    .number()
    .int()
    .min(1, "Importance must be between 1 and 5")
    .max(5, "Importance must be between 1 and 5"),
});

export type RawMeta = z.infer<typeof rawMetaSchema>;
export type RawEvent = z.infer<typeof rawEventSchema>;
