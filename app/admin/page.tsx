"use client";

import Link from "next/link";
import { FileStack, CheckCircle2, Users2, UploadCloud, ArrowRight } from "lucide-react";
import { useDetectiveStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CaseCard } from "@/components/game/case-card";
import { EmptyState } from "@/components/game/empty-state";

export default function AdminDashboardPage() {
  const cases = useDetectiveStore((s) => s.cases);
  const submissions = useDetectiveStore((s) => s.submissions);

  const published = cases.filter((c) => c.status === "published").length;
  const draft = cases.filter((c) => c.status === "draft").length;
  const totalPlays = submissions.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage cases, upload new CSVs, and keep an eye on how players are doing.</p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/upload">
            <UploadCloud className="h-4 w-4" /> Upload a case
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={FileStack} label="Total cases" value={cases.length} accent="primary" />
        <StatCard icon={CheckCircle2} label="Published" value={published} accent="secondary" />
        <StatCard icon={Users2} label="Total plays" value={totalPlays} accent="accent" />
      </div>

      {draft > 0 && (
        <Card className="border-accent-200 bg-accent-50/60">
          <CardContent className="flex items-center justify-between p-5">
            <p className="text-sm font-medium text-accent-800">
              You have {draft} draft case{draft > 1 ? "s" : ""} that {draft > 1 ? "aren't" : "isn't"} visible to players yet.
            </p>
            <Button asChild variant="outline" size="sm" className="border-accent-300 text-accent-800">
              <Link href="/admin/cases">
                Review drafts <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Recent cases</h2>
          <Link href="/admin/cases" className="text-sm font-semibold text-primary-600 hover:underline">
            Manage all →
          </Link>
        </div>
        {cases.length === 0 ? (
          <EmptyState
            icon={UploadCloud}
            title="No cases yet"
            description="Upload your first Case Definition CSV to get started."
            action={{ label: "Upload CSV", href: "/admin/upload" }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cases.slice(0, 3).map((c) => (
              <CaseCard key={c.meta.caseId} case={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: number; accent: "primary" | "secondary" | "accent" }) {
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
