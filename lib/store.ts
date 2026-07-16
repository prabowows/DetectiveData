import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Case, InvestigationProgress, Submission } from "./types";

interface DetectiveDataState {
  cases: Case[];
  progress: Record<string, InvestigationProgress>;
  submissions: Submission[];

  // Admin actions
  addOrReplaceCase: (c: Case) => void;
  setCaseStatus: (caseId: string, status: Case["status"]) => void;
  deleteCase: (caseId: string) => void;
  setCases: (cases: Case[]) => void;

  // Player actions
  getOrStartProgress: (caseId: string) => InvestigationProgress;
  updateNotes: (caseId: string, notes: string) => void;
  updateReasoning: (caseId: string, reasoning: string) => void;
  selectCulprit: (caseId: string, culprit: string) => void;
  submitInvestigation: (caseId: string) => Submission | null;
  latestSubmissionFor: (caseId: string) => Submission | undefined;
}

export const useDetectiveStore = create<DetectiveDataState>()(
  persist(
    (set, get) => ({
      cases: [],
      progress: {},
      submissions: [],

      addOrReplaceCase: (c) =>
        set((state) => {
          const withoutExisting = state.cases.filter((existing) => existing.meta.caseId !== c.meta.caseId);
          return { cases: [...withoutExisting, c] };
        }),

      setCaseStatus: (caseId, status) =>
        set((state) => ({
          cases: state.cases.map((c) => (c.meta.caseId === caseId ? { ...c, status } : c)),
        })),

      deleteCase: (caseId) =>
        set((state) => ({
          cases: state.cases.filter((c) => c.meta.caseId !== caseId),
        })),

      setCases: (cases) =>
        set(() => ({
          cases,
        })),

      getOrStartProgress: (caseId) => {
        const existing = get().progress[caseId];
        if (existing) return existing;
        const fresh: InvestigationProgress = {
          caseId,
          notes: "",
          selectedCulprit: null,
          reasoning: "",
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ progress: { ...state.progress, [caseId]: fresh } }));
        return fresh;
      },

      updateNotes: (caseId, notes) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [caseId]: {
              ...(state.progress[caseId] ?? get().getOrStartProgress(caseId)),
              notes,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      updateReasoning: (caseId, reasoning) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [caseId]: {
              ...(state.progress[caseId] ?? get().getOrStartProgress(caseId)),
              reasoning,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      selectCulprit: (caseId, culprit) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [caseId]: {
              ...(state.progress[caseId] ?? get().getOrStartProgress(caseId)),
              selectedCulprit: culprit,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      submitInvestigation: (caseId) => {
        const state = get();
        const prog = state.progress[caseId];
        const targetCase = state.cases.find((c) => c.meta.caseId === caseId);
        if (!prog || !prog.selectedCulprit || !targetCase) return null;

        const correct = prog.selectedCulprit === targetCase.meta.culprit;
        const startedAt = new Date(prog.startedAt).getTime();
        const submission: Submission = {
          caseId,
          selectedCulprit: prog.selectedCulprit,
          reasoning: prog.reasoning,
          correct,
          submittedAt: new Date().toISOString(),
          timeSpentSeconds: Math.max(0, Math.round((Date.now() - startedAt) / 1000)),
        };

        set((s) => ({
          submissions: [...s.submissions, submission],
          cases: s.cases.map((c) =>
            c.meta.caseId === caseId
              ? { ...c, playCount: c.playCount + 1, correctCount: c.correctCount + (correct ? 1 : 0) }
              : c
          ),
        }));

        return submission;
      },

      latestSubmissionFor: (caseId) => {
        const subs = get().submissions.filter((s) => s.caseId === caseId);
        return subs[subs.length - 1];
      },
    }),
    {
      name: "detective-data-storage",
    }
  )
);
