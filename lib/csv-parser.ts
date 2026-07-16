import Papa from "papaparse";
import { z } from "zod";
import type { Case, CaseEvent, CaseMeta, ValidationIssue, ValidationResult } from "./types";
import { REQUIRED_META_KEYS, rawEventSchema, rawMetaSchema } from "./csv-schema";

interface RawRow {
  Type: string;
  Key: string;
  Value: string;
  ID: string;
  Time: string;
  Source: string;
  Actor: string;
  Action: string;
  Object: string;
  Target: string;
  Location: string;
  Description: string;
  Importance: string;
}

/**
 * Parses and validates a Detective Data Case Definition CSV.
 *
 * The CSV never changes shape: every row is either a META row (Type=META,
 * using the Key/Value columns) or an EVENT row (Type=EVENT, using the
 * timeline columns). This function never mutates the schema — it only reads it.
 */
export function parseCaseCsv(csvText: string, existingCaseIds: string[] = []): ValidationResult {
  const issues: ValidationIssue[] = [];

  const parsed = Papa.parse<RawRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().replace(/^\uFEFF/, ""),
  });

  if (parsed.errors.length > 0) {
    for (const err of parsed.errors) {
      issues.push({
        level: "error",
        field: `row ${err.row ?? "?"}`,
        message: err.message,
      });
    }
  }

  const rows = parsed.data.filter((r) => r && (r.Type === "META" || r.Type === "EVENT"));

  if (rows.length === 0) {
    issues.push({
      level: "error",
      field: "file",
      message: "No META or EVENT rows found. Check that the CSV has a Type column set to META or EVENT.",
    });
    return { valid: false, issues, parsedCase: null };
  }

  // ---- META section ----
  const metaRows = rows.filter((r) => r.Type === "META");
  const metaMap: Record<string, string> = {};
  for (const row of metaRows) {
    const key = (row.Key ?? "").trim();
    if (!key) {
      issues.push({ level: "warning", field: "META", message: "A META row is missing its Key and was skipped." });
      continue;
    }
    metaMap[key] = row.Value ?? "";
  }

  for (const requiredKey of REQUIRED_META_KEYS) {
    if (!(requiredKey in metaMap) || metaMap[requiredKey].trim() === "") {
      issues.push({
        level: "error",
        field: requiredKey,
        message: `Missing required META field: ${requiredKey}`,
      });
    }
  }

  let meta: CaseMeta | null = null;
  const metaParse = rawMetaSchema.safeParse(metaMap);
  if (metaParse.success) {
    const m = metaParse.data;
    meta = {
      caseId: m.CASE_ID.trim(),
      title: m.TITLE.trim(),
      difficulty: m.DIFFICULTY,
      category: m.CATEGORY.trim(),
      timeLimit: m.TIME_LIMIT,
      maxScore: m.MAX_SCORE,
      story: m.STORY.trim(),
      question: m.QUESTION.trim(),
      culprit: m.CULPRIT.trim(),
      solution: m.SOLUTION.trim(),
      referenceEvents: m.REFERENCE_EVENTS.split("|").map((s) => s.trim()).filter(Boolean),
      hint: m.HINT.trim(),
    };
    if (existingCaseIds.includes(meta.caseId)) {
      issues.push({
        level: "warning",
        field: "CASE_ID",
        message: `A case with ID "${meta.caseId}" already exists. Publishing will overwrite it.`,
      });
    }
  } else if (metaParse instanceof z.ZodError || "error" in metaParse) {
    for (const zerr of metaParse.error.issues) {
      issues.push({ level: "error", field: String(zerr.path[0] ?? "META"), message: zerr.message });
    }
  }

  // ---- EVENT section ----
  const eventRows = rows.filter((r) => r.Type === "EVENT");
  if (eventRows.length === 0) {
    issues.push({ level: "error", field: "EVENT", message: "The case has no EVENT rows — there is no timeline to investigate." });
  }

  const events: CaseEvent[] = [];
  const seenIds = new Set<string>();
  for (const [index, row] of eventRows.entries()) {
    const eventParse = rawEventSchema.safeParse(row);
    if (!eventParse.success) {
      for (const zerr of eventParse.error.issues) {
        issues.push({
          level: "error",
          field: `EVENT row ${index + 1} (${zerr.path[0]})`,
          message: zerr.message,
        });
      }
      continue;
    }
    const e = eventParse.data;
    if (seenIds.has(e.ID)) {
      issues.push({ level: "error", field: "EVENT.ID", message: `Duplicate event ID "${e.ID}" — IDs must be unique.` });
      continue;
    }
    seenIds.add(e.ID);
    events.push({
      id: e.ID,
      time: e.Time,
      source: e.Source,
      actor: e.Actor,
      action: e.Action,
      object: e.Object || undefined,
      target: e.Target || undefined,
      location: e.Location,
      description: e.Description,
      importance: e.Importance,
    });
  }

  // Cross-check REFERENCE_EVENTS point at real event IDs
  if (meta) {
    for (const refId of meta.referenceEvents) {
      if (!seenIds.has(refId)) {
        issues.push({
          level: "error",
          field: "REFERENCE_EVENTS",
          message: `REFERENCE_EVENTS points to event ID "${refId}", which does not exist in the EVENT section.`,
        });
      }
    }
    if (!events.some((e) => e.actor === meta.culprit)) {
      issues.push({
        level: "error",
        field: "CULPRIT",
        message: `CULPRIT "${meta.culprit}" does not appear as an Actor in any EVENT row.`,
      });
    }
  }

  const hasErrors = issues.some((i) => i.level === "error");
  if (hasErrors || !meta) {
    return { valid: false, issues, parsedCase: null };
  }

  const suspects = Array.from(new Set(events.map((e) => e.actor))).filter(
    (actor) => actor.toLowerCase() !== "system"
  );

  const parsedCase: Case = {
    meta,
    events: events.sort((a, b) => a.time.localeCompare(b.time)),
    suspects,
    status: "draft",
    createdAt: new Date().toISOString(),
    playCount: 0,
    correctCount: 0,
  };

  return { valid: true, issues, parsedCase };
}

/** Serializes a Case back into the two-section CSV format (used for export/backup). */
export function caseToCsv(c: Case): string {
  const rows: string[][] = [
    ["Type", "Key", "Value", "ID", "Time", "Source", "Actor", "Action", "Object", "Target", "Location", "Description", "Importance"],
  ];
  const metaEntries: [string, string][] = [
    ["CASE_ID", c.meta.caseId],
    ["TITLE", c.meta.title],
    ["DIFFICULTY", c.meta.difficulty],
    ["CATEGORY", c.meta.category],
    ["TIME_LIMIT", String(c.meta.timeLimit)],
    ["MAX_SCORE", String(c.meta.maxScore)],
    ["STORY", c.meta.story],
    ["QUESTION", c.meta.question],
    ["CULPRIT", c.meta.culprit],
    ["SOLUTION", c.meta.solution],
    ["REFERENCE_EVENTS", c.meta.referenceEvents.join("|")],
    ["HINT", c.meta.hint],
  ];
  for (const [key, value] of metaEntries) {
    rows.push(["META", key, value, "", "", "", "", "", "", "", "", "", ""]);
  }
  for (const e of c.events) {
    rows.push([
      "EVENT", "", "", e.id, e.time, e.source, e.actor, e.action, e.object ?? "", e.target ?? "", e.location, e.description, String(e.importance),
    ]);
  }
  return Papa.unparse(rows);
}
