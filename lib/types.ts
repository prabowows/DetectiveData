/**
 * Core domain types for Detective Data.
 * These mirror the CSV Case Definition Language exactly (see lib/csv-parser.ts).
 */

export type Difficulty = "Easy" | "Medium" | "Hard";

export type EventSource =
  | "CCTV"
  | "GPS"
  | "Chat"
  | "Email"
  | "Attendance"
  | "Transaction"
  | "Forensic"
  | "Witness"
  | "IoT Sensor"
  | "Incident"
  | string;

/** A single row from the EVENT section of a case CSV. */
export interface CaseEvent {
  id: string;
  time: string;
  source: EventSource;
  actor: string;
  action: string;
  object?: string;
  target?: string;
  location: string;
  description: string;
  importance: number;
}

/** The META section of a case CSV — the case's story, question, and answer key. */
export interface CaseMeta {
  caseId: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  timeLimit: number; // minutes
  maxScore: number;
  story: string;
  question: string;
  culprit: string;
  solution: string;
  referenceEvents: string[]; // EVENT ids that support the solution
  hint: string;
}

/** A fully parsed case: META + EVENT rows, plus derived data (suspect list). */
export interface Case {
  meta: CaseMeta;
  events: CaseEvent[];
  suspects: string[]; // unique Actor names, derived from events (excludes "System")
  status: CaseStatus;
  createdAt: string;
  playCount: number;
  correctCount: number;
}

export type CaseStatus = "draft" | "published" | "archived";

export interface ValidationIssue {
  level: "error" | "warning";
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  parsedCase: Case | null;
}

/** Player's in-progress investigation state for one case, autosaved locally. */
export interface InvestigationProgress {
  caseId: string;
  notes: string;
  selectedCulprit: string | null;
  reasoning: string;
  startedAt: string;
  updatedAt: string;
}

/** A completed submission, stored for the result page and analytics. */
export interface Submission {
  caseId: string;
  selectedCulprit: string;
  reasoning: string;
  correct: boolean;
  submittedAt: string;
  timeSpentSeconds: number;
}

export type SortField = "time" | "importance" | "source" | "actor";
export type SortDirection = "asc" | "desc";

export interface TimelineFilters {
  search: string;
  sources: string[];
  groupBySource: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
}
