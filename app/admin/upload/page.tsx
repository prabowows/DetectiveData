"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Download, Rocket } from "lucide-react";
import { toast } from "sonner";
import { useDetectiveStore } from "@/lib/store";
import { parseCaseCsv } from "@/lib/csv-parser";
import type { ValidationResult } from "@/lib/types";
import { CsvUploader } from "@/components/admin/csv-uploader";
import { ValidationReport } from "@/components/admin/validation-report";
import { CasePreview } from "@/components/admin/case-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UploadCsvPage() {
  const router = useRouter();
  const cases = useDetectiveStore((s) => s.cases);
  const addOrReplaceCase = useDetectiveStore((s) => s.addOrReplaceCase);
  const setCaseStatus = useDetectiveStore((s) => s.setCaseStatus);

  const [result, setResult] = useState<ValidationResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (text: string, name: string) => {
    setFileName(name);
    const existingIds = cases.map((c) => c.meta.caseId);
    const parsed = parseCaseCsv(text, existingIds);
    setResult(parsed);
    if (parsed.valid) {
      toast.success("CSV parsed successfully", { description: "Review the preview below, then publish when ready." });
    } else {
      toast.error("CSV has errors", { description: "Fix the issues listed below and re-upload." });
    }
  };

  const handlePublish = () => {
    if (!result?.parsedCase) return;
    addOrReplaceCase(result.parsedCase);
    setCaseStatus(result.parsedCase.meta.caseId, "published");
    toast.success(`"${result.parsedCase.meta.title}" published!`, { description: "Players can now find it in the Case Library." });
    router.push("/admin/cases");
  };

  const handleSaveDraft = () => {
    if (!result?.parsedCase) return;
    addOrReplaceCase(result.parsedCase);
    setCaseStatus(result.parsedCase.meta.caseId, "draft");
    toast.success("Saved as draft", { description: "It won't appear in the Case Library until you publish it." });
    router.push("/admin/cases");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold">Upload CSV</h1>
        <p className="text-muted-foreground">
          Upload a Case Definition CSV with a META section and an EVENT section. The schema never changes — this is how every case, forever, gets into Detective Data.
        </p>
      </div>

      <CsvUploader onFile={handleFile} />

      <Card className="border-dashed">
        <CardContent className="flex items-center justify-between p-4">
          <p className="text-sm text-muted-foreground">Not sure about the format? Download a working example to start from.</p>
          <a href="/sample-case-template.csv" download>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" /> Download template
            </Button>
          </a>
        </CardContent>
      </Card>

      {result && (
        <>
          <ValidationReport issues={result.issues} />

          {result.parsedCase && (
            <>
              <div className="flex items-center gap-2 rounded-2xl bg-secondary-50 p-4 text-secondary-800">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">
                  Parsed &quot;{fileName}&quot; into case <span className="font-bold">{result.parsedCase.meta.caseId}</span> — preview it below before publishing.
                </p>
              </div>
              <CasePreview case={result.parsedCase} />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" size="lg" className="flex-1" onClick={handleSaveDraft}>
                  Save as draft
                </Button>
                <Button size="lg" className="flex-1" onClick={handlePublish}>
                  <Rocket className="h-4 w-4" /> Publish case
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
