import { AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import type { ValidationIssue } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

export function ValidationReport({ issues }: { issues: ValidationIssue[] }) {
  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warning");

  if (issues.length === 0) {
    return (
      <Card className="border-secondary-200 bg-secondary-50/60">
        <CardContent className="flex items-center gap-3 p-5">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary-600" />
          <p className="text-sm font-medium text-secondary-800">
            Everything checks out — this CSV is valid and ready to preview.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {errors.length > 0 && (
        <Card className="border-red-200 bg-red-50/60">
          <CardContent className="p-5">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-red-700">
              <XCircle className="h-4 w-4" /> {errors.length} error{errors.length > 1 ? "s" : ""} to fix before publishing
            </p>
            <ul className="space-y-1.5">
              {errors.map((issue, i) => (
                <li key={i} className="text-sm text-red-800">
                  <span className="font-semibold">{issue.field}:</span> {issue.message}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {warnings.length > 0 && (
        <Card className="border-accent-200 bg-accent-50/60">
          <CardContent className="p-5">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-accent-700">
              <AlertTriangle className="h-4 w-4" /> {warnings.length} warning{warnings.length > 1 ? "s" : ""}
            </p>
            <ul className="space-y-1.5">
              {warnings.map((issue, i) => (
                <li key={i} className="text-sm text-accent-800">
                  <span className="font-semibold">{issue.field}:</span> {issue.message}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
