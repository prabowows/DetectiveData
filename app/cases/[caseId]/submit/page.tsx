"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { useDetectiveStore } from "@/lib/store";
import { SuspectCard } from "@/components/game/suspect-card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/game/empty-state";
import { FileQuestion } from "lucide-react";

export default function SubmissionPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const router = useRouter();
  const c = useDetectiveStore((s) => s.cases.find((x) => x.meta.caseId === caseId));
  const progress = useDetectiveStore((s) => s.progress[caseId as string]);
  const selectCulprit = useDetectiveStore((s) => s.selectCulprit);
  const updateReasoning = useDetectiveStore((s) => s.updateReasoning);
  const submitInvestigation = useDetectiveStore((s) => s.submitInvestigation);

  const [reasoning, setReasoning] = useState(progress?.reasoning ?? "");
  const [submitting, setSubmitting] = useState(false);

  if (!c) {
    return (
      <div className="container py-10">
        <EmptyState icon={FileQuestion} title="Case not found" description="This case may have been unpublished." action={{ label: "Back to Case Library", href: "/cases" }} />
      </div>
    );
  }

  const selectedCulprit = progress?.selectedCulprit ?? null;

  const handleSubmit = () => {
    if (!selectedCulprit) {
      toast.error("Pick a suspect first", { description: "You need to choose who you believe is responsible." });
      return;
    }
    setSubmitting(true);
    updateReasoning(c.meta.caseId, reasoning);
    setTimeout(() => {
      submitInvestigation(c.meta.caseId);
      router.push(`/cases/${c.meta.caseId}/result`);
    }, 400);
  };

  return (
    <div className="container max-w-3xl py-10 space-y-8">
      <Link
        href={`/cases/${c.meta.caseId}/investigate`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to investigation
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Who did it?</h1>
        <p className="mt-1 text-muted-foreground">{c.meta.question}</p>
      </motion.div>

      <div>
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Select the culprit
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {c.suspects.map((name) => (
            <SuspectCard
              key={name}
              name={name}
              selected={selectedCulprit === name}
              onSelect={() => selectCulprit(c.meta.caseId, name)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Investigation reasoning
        </h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Explain the evidence that led you to this conclusion. This isn&apos;t scored in v1.0, but it helps you think it through.
        </p>
        <Textarea
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="I believe it was… because the evidence shows…"
          className="min-h-[160px]"
        />
      </div>

      <Button size="lg" className="w-full" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Submitting…" : "Submit Investigation"} <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
