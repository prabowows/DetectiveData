import Link from "next/link";
import { Clock, Users, Trophy } from "lucide-react";
import type { Case } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const difficultyStyles: Record<Case["meta"]["difficulty"], string> = {
  Easy: "bg-secondary-100 text-secondary-700",
  Medium: "bg-accent-100 text-accent-700",
  Hard: "bg-red-100 text-red-700",
};

export function CaseCard({ case: c }: { case: Case }) {
  const solveRate = c.playCount > 0 ? Math.round((c.correctCount / c.playCount) * 100) : null;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-2 w-full bg-gradient-hero" />
      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-2">
          <Badge className={difficultyStyles[c.meta.difficulty]}>{c.meta.difficulty}</Badge>
          <Badge variant="outline">{c.meta.category}</Badge>
        </div>
        <h3 className="font-display text-lg font-bold leading-snug">{c.meta.title}</h3>
        <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">{c.meta.story}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {c.meta.timeLimit} min
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {c.suspects.length} suspects
          </span>
          {solveRate !== null && (
            <span className="inline-flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" /> {solveRate}% solve rate
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6">
        <Button asChild className="w-full">
          <Link href={`/cases/${c.meta.caseId}`}>Open case file</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
