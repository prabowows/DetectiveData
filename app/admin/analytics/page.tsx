"use client";

import { BarChart3, TrendingUp, Users2, Percent } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useDetectiveStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/game/empty-state";

export default function AnalyticsPage() {
  const cases = useDetectiveStore((s) => s.cases);
  const submissions = useDetectiveStore((s) => s.submissions);

  const totalPlays = submissions.length;
  const totalCorrect = submissions.filter((s) => s.correct).length;
  const overallAccuracy = totalPlays > 0 ? Math.round((totalCorrect / totalPlays) * 100) : 0;
  const uniquePlayedCases = new Set(submissions.map((s) => s.caseId)).size;

  const chartData = cases
    .filter((c) => c.playCount > 0)
    .map((c) => ({
      name: c.meta.title.length > 18 ? `${c.meta.title.slice(0, 18)}…` : c.meta.title,
      plays: c.playCount,
      correct: c.correctCount,
      incorrect: c.playCount - c.correctCount,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold">Analytics</h1>
        <p className="text-muted-foreground">See how players are engaging with your cases.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Users2} label="Total plays" value={totalPlays} accent="primary" />
        <StatCard icon={Percent} label="Overall accuracy" value={`${overallAccuracy}%`} accent="secondary" />
        <StatCard icon={TrendingUp} label="Cases played at least once" value={uniquePlayedCases} accent="accent" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary-600" /> Plays and outcomes by case
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="No plays yet"
              description="Once players start submitting investigations, results will appear here."
            />
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                    cursor={{ fill: "hsl(var(--muted))" }}
                  />
                  <Bar dataKey="correct" stackId="a" fill="#10b981" name="Correct" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="incorrect" stackId="a" fill="#f97316" name="Incorrect" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Per-case breakdown</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Case</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Plays</th>
                <th className="px-3 py-2">Correct</th>
                <th className="px-3 py-2">Solve rate</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.meta.caseId} className="border-t border-border">
                  <td className="px-3 py-2.5 font-medium">{c.meta.title}</td>
                  <td className="px-3 py-2.5 capitalize text-muted-foreground">{c.status}</td>
                  <td className="px-3 py-2.5">{c.playCount}</td>
                  <td className="px-3 py-2.5">{c.correctCount}</td>
                  <td className="px-3 py-2.5">{c.playCount > 0 ? `${Math.round((c.correctCount / c.playCount) * 100)}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent: "primary" | "secondary" | "accent" }) {
  const bg = { primary: "bg-primary-50 text-primary-600", secondary: "bg-secondary-50 text-secondary-600", accent: "bg-accent-50 text-accent-600" }[accent];
  return (
    <Card>
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
