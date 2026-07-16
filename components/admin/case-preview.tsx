import { Clock, Users, ListChecks } from "lucide-react";
import type { Case } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const difficultyStyles: Record<string, string> = {
  Easy: "bg-secondary-100 text-secondary-700",
  Medium: "bg-accent-100 text-accent-700",
  Hard: "bg-red-100 text-red-700",
};

export function CasePreview({ case: c }: { case: Case }) {
  return (
    <div className="space-y-5">
      <Card className="glass-card">
        <CardContent className="p-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={difficultyStyles[c.meta.difficulty]}>{c.meta.difficulty}</Badge>
            <Badge variant="outline">{c.meta.category}</Badge>
            <Badge variant="muted">ID: {c.meta.caseId}</Badge>
          </div>
          <h2 className="font-display text-xl font-extrabold">{c.meta.title}</h2>
          <p className="text-sm leading-relaxed text-foreground/90">{c.meta.story}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.meta.timeLimit} min · {c.meta.maxScore} pts</span>
            <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {c.suspects.length} suspects</span>
            <span className="inline-flex items-center gap-1"><ListChecks className="h-3.5 w-3.5" /> {c.events.length} events</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-2">
          <p className="text-sm font-bold">Question</p>
          <p className="text-sm text-muted-foreground">{c.meta.question}</p>
          <p className="pt-2 text-sm font-bold">Culprit (answer key)</p>
          <p className="text-sm text-muted-foreground">{c.meta.culprit}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="mb-3 text-sm font-bold">Event timeline ({c.events.length})</p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Actor</th>
                  <th className="px-3 py-2">Action</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Importance</th>
                </tr>
              </thead>
              <tbody>
                {c.events.map((e) => (
                  <tr key={e.id} className={`border-t border-border ${c.meta.referenceEvents.includes(e.id) ? "bg-accent-50/60" : ""}`}>
                    <td className="px-3 py-2 font-mono text-xs">{e.id}</td>
                    <td className="px-3 py-2">{e.time}</td>
                    <td className="px-3 py-2">{e.source}</td>
                    <td className="px-3 py-2 font-medium">{e.actor}</td>
                    <td className="px-3 py-2">{e.action}</td>
                    <td className="px-3 py-2">{e.location}</td>
                    <td className="px-3 py-2">{e.importance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Highlighted rows are the REFERENCE_EVENTS used on the Result page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
