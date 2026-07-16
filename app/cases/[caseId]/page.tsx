"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users, FileQuestion, Sparkles } from "lucide-react";
import { useDetectiveStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/game/empty-state";
import { stringToHue, initials } from "@/lib/utils";

const difficultyStyles: Record<string, string> = {
  Easy: "bg-secondary-100 text-secondary-700",
  Medium: "bg-accent-100 text-accent-700",
  Hard: "bg-red-100 text-red-700",
};

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const router = useRouter();
  const c = useDetectiveStore((s) => s.cases.find((x) => x.meta.caseId === caseId));
  const getOrStartProgress = useDetectiveStore((s) => s.getOrStartProgress);

  if (!c) {
    return (
      <div className="container py-10">
        <EmptyState icon={FileQuestion} title="Case not found" description="This case may have been unpublished or removed." action={{ label: "Back to Case Library", href: "/cases" }} />
      </div>
    );
  }

  const handleStart = () => {
    getOrStartProgress(c.meta.caseId);
    router.push(`/cases/${c.meta.caseId}/investigate`);
  };

  return (
    <div className="container max-w-4xl py-10 space-y-6">
      <Link href="/cases" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Case Library
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={difficultyStyles[c.meta.difficulty]}>{c.meta.difficulty}</Badge>
          <Badge variant="outline">{c.meta.category}</Badge>
        </div>
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{c.meta.title}</h1>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> Suggested time: {c.meta.timeLimit} minutes</span>
          <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {c.suspects.length} suspects</span>
          <span className="inline-flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> {c.events.length} pieces of evidence</span>
        </div>
      </motion.div>

      <Card className="glass-card">
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="font-display text-base font-bold text-primary-700">The Story</h2>
            <p className="mt-1.5 leading-relaxed text-foreground/90">{c.meta.story}</p>
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-primary-700">Your Question</h2>
            <p className="mt-1.5 leading-relaxed text-foreground/90">{c.meta.question}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-display text-base font-bold">Suspects</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {c.suspects.map((suspect) => (
              <div key={suspect} className="flex items-center gap-2 rounded-full border border-border bg-white py-1.5 pl-1.5 pr-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback style={{ backgroundColor: `hsl(${stringToHue(suspect)}, 70%, 92%)`, color: `hsl(${stringToHue(suspect)}, 45%, 35%)` }}>
                    {initials(suspect)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold">{suspect}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-3 rounded-3xl bg-gradient-hero p-8 text-center text-white">
        <p className="font-display text-xl font-bold">Ready to open the case file?</p>
        <p className="text-white/90 text-sm max-w-md">
          You&apos;ll see every event on a timeline you can search, filter, and sort. Take your time — nothing is scored until you submit.
        </p>
        <Button size="lg" onClick={handleStart} className="mt-2 bg-white text-primary-700 hover:bg-white/90">
          Start Investigation
        </Button>
      </div>
    </div>
  );
}
