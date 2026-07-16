"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Target, Trophy, BookOpen } from "lucide-react";
import { useDetectiveStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CaseCard } from "@/components/game/case-card";
import { EmptyState } from "@/components/game/empty-state";

export default function DashboardPage() {
  const cases = useDetectiveStore((s) => s.cases.filter((c) => c.status === "published"));
  const submissions = useDetectiveStore((s) => s.submissions);
  const progress = useDetectiveStore((s) => s.progress);

  const solved = new Set(submissions.filter((s) => s.correct).map((s) => s.caseId)).size;
  const attempts = submissions.length;
  const accuracy = attempts > 0 ? Math.round((submissions.filter((s) => s.correct).length / attempts) * 100) : 0;

  const inProgressCaseId = Object.values(progress).find(
    (p) => !submissions.some((s) => s.caseId === p.caseId)
  )?.caseId;
  const inProgressCase = cases.find((c) => c.meta.caseId === inProgressCaseId);

  const featured = cases.slice(0, 3);

  return (
    <div className="container py-10 space-y-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 text-white sm:p-12"
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <Badge variant="outline" className="border-white/40 text-white mb-4">
            🕵️ Welcome back, detective
          </Badge>
          <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Every clue tells a story. Go find it.
          </h1>
          <p className="mt-3 text-white/90">
            Read the evidence, spot the patterns, and decide who did it — no prior experience needed.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="default" className="bg-white text-primary-700 hover:bg-white/90">
              <Link href="/cases">
                Browse Case Library <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {inProgressCase && (
              <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                <Link href={`/cases/${inProgressCase.meta.caseId}/investigate`}>
                  Continue &quot;{inProgressCase.meta.title}&quot;
                </Link>
              </Button>
            )}
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Trophy} label="Cases solved" value={solved} accent="secondary" />
        <StatCard icon={Target} label="Accuracy" value={`${accuracy}%`} accent="primary" />
        <StatCard icon={Flame} label="Investigations started" value={attempts} accent="accent" />
      </section>

      {/* Featured cases */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Featured cases</h2>
          <Link href="/cases" className="text-sm font-semibold text-primary-600 hover:underline">
            View all →
          </Link>
        </div>
        {featured.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No cases published yet"
            description="An admin needs to upload and publish a case CSV before you can start investigating."
            action={{ label: "Go to Admin", href: "/admin/upload" }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c, i) => (
              <motion.div
                key={c.meta.caseId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <CaseCard case={c} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: "primary" | "secondary" | "accent";
}) {
  const bg = { primary: "bg-primary-50 text-primary-600", secondary: "bg-secondary-50 text-secondary-600", accent: "bg-accent-50 text-accent-600" }[accent];
  return (
    <Card className="glass-card">
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${bg}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-2xl font-extrabold font-display">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
