"use client";

import { useEffect, useRef, useState } from "react";
import { Check, NotebookPen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useDetectiveStore } from "@/lib/store";

export function NotesPanel({ caseId }: { caseId: string }) {
  const progress = useDetectiveStore((s) => s.progress[caseId]);
  const updateNotes = useDetectiveStore((s) => s.updateNotes);
  const [localNotes, setLocalNotes] = useState(progress?.notes ?? "");
  const [saved, setSaved] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalNotes(progress?.notes ?? "");
  }, [caseId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (value: string) => {
    setLocalNotes(value);
    setSaved(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateNotes(caseId, value);
      setSaved(true);
    }, 500);
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-display text-sm font-bold">
          <NotebookPen className="h-4 w-4 text-primary-600" /> Your Notes
        </h3>
        <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
          {saved ? (
            <>
              <Check className="h-3 w-3 text-secondary-600" /> Saved
            </>
          ) : (
            "Saving…"
          )}
        </span>
      </div>
      <p className="text-xs text-muted-foreground -mt-1">
        Jot down anything that stands out. These notes are private and never scored.
      </p>
      <Textarea
        value={localNotes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="e.g. Andi was alone in the office right before the laptop went missing…"
        className="min-h-[220px] flex-1 resize-none bg-white/70"
      />
    </div>
  );
}
