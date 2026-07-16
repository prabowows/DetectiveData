"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Clock3 } from "lucide-react";
import { useDetectiveStore } from "@/lib/store";
import { StorySidebar } from "@/components/game/story-sidebar";
import { FilterBar } from "@/components/game/filter-bar";
import { Timeline } from "@/components/game/timeline";
import { NotesPanel } from "@/components/game/notes-panel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/game/empty-state";
import type { TimelineFilters } from "@/lib/types";
import { FileQuestion } from "lucide-react";

const defaultFilters: TimelineFilters = {
  search: "",
  sources: [],
  groupBySource: false,
  sortField: "time",
  sortDirection: "asc",
};

export default function InvestigationPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const router = useRouter();
  const c = useDetectiveStore((s) => s.cases.find((x) => x.meta.caseId === caseId));
  const getOrStartProgress = useDetectiveStore((s) => s.getOrStartProgress);
  const [filters, setFilters] = useState<TimelineFilters>(defaultFilters);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!caseId) return;
    getOrStartProgress(caseId);
  }, [caseId, getOrStartProgress]);

  useEffect(() => {
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const sources = useMemo(() => (c ? Array.from(new Set(c.events.map((e) => e.source))) : []), [c]);

  if (!c) {
    return (
      <div className="container py-10">
        <EmptyState icon={FileQuestion} title="Case not found" description="This case may have been unpublished." action={{ label: "Back to Case Library", href: "/cases" }} />
      </div>
    );
  }

  const limitSeconds = c.meta.timeLimit * 60;
  const progressPct = Math.min(100, Math.round((elapsedSeconds / limitSeconds) * 100));
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return (
    <div className="container py-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground">
            {minutes}:{seconds.toString().padStart(2, "0")} elapsed · suggested {c.meta.timeLimit} min
          </span>
        </div>
        <div className="flex items-center gap-3 sm:w-64">
          <Progress value={progressPct} className="h-2" />
          <Button onClick={() => router.push(`/cases/${c.meta.caseId}/submit`)}>
            Submit Investigation <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_300px] xl:grid-cols-[300px_1fr_320px]">
        {/* Left: Story / Question / Hint */}
        <aside className="glass-card order-1 p-5 lg:sticky lg:top-[88px] lg:h-[calc(100vh-104px)]">
          <StorySidebar meta={c.meta} />
        </aside>

        {/* Center: Timeline */}
        <section className="order-3 space-y-4 lg:order-2">
          <div className="glass-card p-4">
            <FilterBar filters={filters} onChange={setFilters} sources={sources} />
          </div>
          <Timeline events={c.events} filters={filters} />
        </section>

        {/* Right: Notes */}
        <aside className="glass-card order-2 p-5 lg:sticky lg:top-[88px] lg:order-3 lg:h-[calc(100vh-104px)]">
          <NotesPanel caseId={c.meta.caseId} />
        </aside>
      </div>
    </div>
  );
}
