"use client";

import { useEffect, useRef } from "react";
import { useDetectiveStore } from "./store";
import { parseCaseCsv } from "./csv-parser";
import { seedCaseCsvs } from "./seed-data";

/**
 * Loads the three bundled sample cases into the store the first time the app
 * runs in a browser. Safe to call from many components — it only seeds once
 * and never overwrites cases that already exist.
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
    for (const csv of seedCaseCsvs) {
      const result = parseCaseCsv(csv);
      if (result.valid && result.parsedCase) {
        addOrReplaceCase(result.parsedCase);
        setCaseStatus(result.parsedCase.meta.caseId, "published");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
