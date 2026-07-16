"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, Rocket, PauseCircle, Trash2, FolderKanban } from "lucide-react";
import { useDetectiveStore } from "@/lib/store";
import type { Case } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CasePreview } from "@/components/admin/case-preview";
import { EmptyState } from "@/components/game/empty-state";

const statusStyles: Record<Case["status"], string> = {
  published: "bg-secondary-100 text-secondary-700",
  draft: "bg-accent-100 text-accent-700",
  archived: "bg-muted text-muted-foreground",
};

export default function CaseManagementPage() {
  const cases = useDetectiveStore((s) => s.cases);
  const setCaseStatus = useDetectiveStore((s) => s.setCaseStatus);
  const deleteCase = useDetectiveStore((s) => s.deleteCase);
  const [previewCase, setPreviewCase] = useState<Case | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Case | null>(null);

  const handleToggleStatus = (c: Case) => {
    const next = c.status === "published" ? "archived" : "published";
    setCaseStatus(c.meta.caseId, next);
    toast.success(next === "published" ? `"${c.meta.title}" published` : `"${c.meta.title}" unpublished`);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCase(deleteTarget.meta.caseId);
    toast.success(`"${deleteTarget.meta.title}" deleted`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold">Case Management</h1>
        <p className="text-muted-foreground">Publish, unpublish, preview, or delete any case. Changes take effect immediately.</p>
      </div>

      {cases.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No cases yet" description="Upload a CSV to create your first case." action={{ label: "Upload CSV", href: "/admin/upload" }} />
      ) : (
        <div className="space-y-3">
          {cases.map((c) => (
            <Card key={c.meta.caseId}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Badge className={statusStyles[c.status]}>{c.status}</Badge>
                    <Badge variant="outline">{c.meta.difficulty}</Badge>
                    <Badge variant="muted">{c.meta.category}</Badge>
                  </div>
                  <p className="truncate font-display text-base font-bold">{c.meta.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.meta.caseId} · {c.events.length} events · {c.playCount} plays
                    {c.playCount > 0 ? ` · ${Math.round((c.correctCount / c.playCount) * 100)}% solve rate` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPreviewCase(c)}>
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </Button>
                  <Button variant={c.status === "published" ? "outline" : "default"} size="sm" onClick={() => handleToggleStatus(c)}>
                    {c.status === "published" ? (
                      <>
                        <PauseCircle className="h-3.5 w-3.5" /> Unpublish
                      </>
                    ) : (
                      <>
                        <Rocket className="h-3.5 w-3.5" /> Publish
                      </>
                    )}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(c)}>
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!previewCase} onOpenChange={(open) => !open && setPreviewCase(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle>Case preview</DialogTitle>
          </DialogHeader>
          {previewCase && <CasePreview case={previewCase} />}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete &quot;{deleteTarget?.meta.title}&quot;?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This removes the case and its evidence timeline for everyone. Past submissions stay in Analytics, but players will no longer be able to open this case.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" /> Delete case
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
