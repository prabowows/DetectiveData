"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { PartyPopper, HeartHandshake, BadgeCheck, ArrowRight, RotateCcw } from "lucide-react";
import { useDetectiveStore } from "@/lib/store";
import { useCelebrationConfetti } from "@/components/game/confetti";
import { EventCard } from "@/components/game/event-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/game/empty-state";
import { FileQuestion } from "lucide-react";
import { stringToHue, initials } from "@/lib/utils";

export default function ResultPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const c = useDetectiveStore((s) => s.cases.find((x) => x.meta.caseId === caseId));
  const latestSubmissionFor = useDetectiveStore((s) => s.latestSubmissionFor);
  const submission = caseId ? latestSubmissionFor(caseId) : undefined;
  const [ready, setReady] = useState(false);

  useCelebrationConfetti(ready && !!submission?.correct);

  useEffect(() => {
    setReady(true);
    if (!c) return;
    const firstRef = c.meta.referenceEvents[0];
    if (!firstRef) return;
    const timer = setTimeout(() => {
      document.getElementById(`event-${firstRef}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 600);
    return () => clearTimeout(timer);
  }, [c]);

  if (!c) {
    return (
      <div className="container py-10">
        <EmptyState icon={FileQuestion} title="Case not found" description="This case may have been unpublished." action={{ label: "Back to Case Library", href: "/cases" }} />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container py-10">
        <EmptyState
          icon={FileQuestion}
          title="No submission yet"
          description="Investigate the case and submit your answer to see your result."
          action={{ label: "Start investigating", href: `/cases/${c.meta.caseId}` }}
        />
      </div>
    );
  }

  const referenceEvents = c.events.filter((e) => c.meta.referenceEvents.includes(e.id));
  const hue = stringToHue(submission.selectedCulprit);

  return (
    <div className="container max-w-3xl py-10 space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`rounded-3xl p-8 text-center text-white ${
          submission.correct ? "bg-gradient-to-br from-secondary-500 to-primary-500" : "bg-gradient-to-br from-accent-500 to-primary-600"
        }`}
      >
        {submission.correct ? (
          <PartyPopper className="mx-auto h-12 w-12" />
        ) : (
          <HeartHandshake className="mx-auto h-12 w-12" />
        )}
        <h1 className="mt-3 font-display text-3xl font-extrabold">
          {submission.correct ? "Case Solved!" : "Not quite — keep sharpening those skills"}
        </h1>
        <p className="mt-2 text-white/90">
          {submission.correct
            ? "Your reading of the evidence was spot on. Great detective work."
            : "Every investigation is practice. Review the evidence trail below and see what you'd catch next time."}
        </p>
      </motion.div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-6">
          <Avatar className="h-14 w-14">
            <AvatarFallback style={{ backgroundColor: `hsl(${hue}, 75%, 92%)`, color: `hsl(${hue}, 45%, 32%)` }} className="text-lg font-bold">
              {initials(submission.selectedCulprit)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">You chose</p>
            <p className="font-display text-lg font-bold">{submission.selectedCulprit}</p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Official culprit</p>
            <p className="font-display text-lg font-bold">{c.meta.culprit}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardContent className="p-6">
          <h2 className="flex items-center gap-1.5 font-display text-base font-bold text-primary-700">
            <BadgeCheck className="h-4.5 w-4.5" /> Official Solution
          </h2>
          <p className="mt-2 leading-relaxed text-foreground/90">{c.meta.solution}</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 font-display text-base font-bold">Supporting Evidence</h2>
        <div className="space-y-3">
          {referenceEvents.map((e) => (
            <EventCard key={e.id} event={e} id={`event-${e.id}`} highlighted />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link href={`/cases/${c.meta.caseId}/investigate`}>
            <RotateCcw className="h-4 w-4" /> Review the full timeline
          </Link>
        </Button>
        <Button asChild size="lg" className="flex-1">
          <Link href="/cases">
            Next case <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
