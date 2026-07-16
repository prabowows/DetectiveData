"use client";

import { useEffect, useRef } from "react";
import { useDetectiveStore } from "./store";
import { parseCaseCsv } from "./csv-parser";
import { seedCaseCsvs } from "./seed-data";
import { createClient } from "./supabase/client";

/**
 * Loads published cases from Supabase when it is configured. The bundled sample
 * cases are retained as an offline fallback so the game remains usable before
 * an administrator has published any cases to the shared database.
 */
export function useSeedCases() {
  const cases = useDetectiveStore((s) => s.cases);
  const addOrReplaceCase = useDetectiveStore((s) => s.addOrReplaceCase);
  const setCaseStatus = useDetectiveStore((s) => s.setCaseStatus);
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    if (cases.length > 0) {
      seeded.current = true;
      return;
    }
    seeded.current = true;

    const loadCases = async () => {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("cases")
          .select("raw_csv")
          .eq("status", "published")
          .order("created_at", { ascending: true });

        if (!error && data && data.length > 0) {
          for (const record of data) {
            const result = parseCaseCsv(record.raw_csv);
            if (result.valid && result.parsedCase) {
              addOrReplaceCase({ ...result.parsedCase, status: "published" });
            }
          }
          return;
        }
      }

      for (const csv of seedCaseCsvs) {
        const result = parseCaseCsv(csv);
        if (result.valid && result.parsedCase) {
          addOrReplaceCase(result.parsedCase);
          setCaseStatus(result.parsedCase.meta.caseId, "published");
        }
      }
    };

    void loadCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
