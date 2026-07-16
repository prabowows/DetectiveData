"use client";

import { useMemo, useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { useDetectiveStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CaseCard } from "@/components/game/case-card";
import { EmptyState } from "@/components/game/empty-state";
import { cn } from "@/lib/utils";

const difficulties = ["All", "Easy", "Medium", "Hard"] as const;

export default function CaseLibraryPage() {
  const cases = useDetectiveStore((s) => s.cases.filter((c) => c.status === "published"));
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("All");

  const categories = useMemo(() => Array.from(new Set(cases.map((c) => c.meta.category))), [cases]);
  const [category, setCategory] = useState<string>("All");

  const filtered = cases.filter((c) => {
    const matchesQuery =
      query.trim() === "" ||
      c.meta.title.toLowerCase().includes(query.toLowerCase()) ||
      c.meta.category.toLowerCase().includes(query.toLowerCase());
    const matchesDifficulty = difficulty === "All" || c.meta.difficulty === difficulty;
    const matchesCategory = category === "All" || c.meta.category === category;
    return matchesQuery && matchesDifficulty && matchesCategory;
  });

  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Case Library</h1>
        <p className="mt-1 text-muted-foreground">Pick a case. Every one is generated from a real evidence timeline.</p>
      </div>

      <div className="glass-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cases by title or category…"
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((d) => (
            <Badge
              key={d}
              onClick={() => setDifficulty(d)}
              variant={difficulty === d ? "default" : "outline"}
              className={cn("cursor-pointer select-none px-3 py-1.5", difficulty === d && "ring-2 ring-primary-300")}
            >
              {d}
            </Badge>
          ))}
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Badge
            onClick={() => setCategory("All")}
            variant={category === "All" ? "secondary" : "outline"}
            className="cursor-pointer select-none px-3 py-1.5"
          >
            All categories
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat}
              onClick={() => setCategory(cat)}
              variant={category === cat ? "secondary" : "outline"}
              className="cursor-pointer select-none px-3 py-1.5"
            >
              {cat}
            </Badge>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={cases.length === 0 ? "No cases published yet" : "No cases match your search"}
          description={
            cases.length === 0
              ? "Check back soon — an admin needs to publish a case first."
              : "Try a different keyword or clear your filters."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CaseCard key={c.meta.caseId} case={c} />
          ))}
        </div>
      )}
    </div>
  );
}
