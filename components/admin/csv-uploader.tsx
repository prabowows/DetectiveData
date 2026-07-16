"use client";

import { useCallback, useRef, useState } from "react";
import { FileSpreadsheet, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export function CsvUploader({ onFile }: { onFile: (text: string, fileName: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => onFile(String(reader.result ?? ""), file.name);
      reader.readAsText(file);
    },
    [onFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) readFile(file);
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-12 text-center transition-colors",
        dragging ? "border-primary-400 bg-primary-50" : "border-border bg-muted/30 hover:bg-muted/50"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) readFile(file);
        }}
      />
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-sm">
        {fileName ? <FileSpreadsheet className="h-8 w-8 text-secondary-500" /> : <UploadCloud className="h-8 w-8 text-primary-500" />}
      </div>
      <div>
        <p className="font-display text-base font-bold">{fileName ?? "Drop your Case CSV here"}</p>
        <p className="text-sm text-muted-foreground">{fileName ? "Click to choose a different file" : "or click to browse — .csv files only"}</p>
      </div>
    </div>
  );
}
