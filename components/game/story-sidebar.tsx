"use client";

import { useState } from "react";
import { BookOpen, HelpCircle, Lightbulb } from "lucide-react";
import type { CaseMeta } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function StorySidebar({ meta }: { meta: CaseMeta }) {
  const [hintVisible, setHintVisible] = useState(false);

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto scrollbar-thin pr-1">
      <div>
        <Badge variant="outline" className="mb-2">
          {meta.category} · {meta.difficulty}
        </Badge>
        <h2 className="font-display text-lg font-extrabold leading-tight">{meta.title}</h2>
      </div>

      <div>
        <h3 className="flex items-center gap-1.5 font-display text-sm font-bold text-primary-700">
          <BookOpen className="h-4 w-4" /> Story
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{meta.story}</p>
      </div>

      <Separator />

      <div>
        <h3 className="flex items-center gap-1.5 font-display text-sm font-bold text-primary-700">
          <HelpCircle className="h-4 w-4" /> Question
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{meta.question}</p>
      </div>

      <Separator />

      <div>
        <h3 className="flex items-center gap-1.5 font-display text-sm font-bold text-accent-600">
          <Lightbulb className="h-4 w-4" /> Hint
        </h3>
        {hintVisible ? (
          <p className="mt-1.5 rounded-xl bg-accent-50 p-3 text-sm leading-relaxed text-accent-800">{meta.hint}</p>
        ) : (
          <Button variant="outline" size="sm" className="mt-2 border-accent-200 text-accent-700 hover:bg-accent-50" onClick={() => setHintVisible(true)}>
            Reveal a hint
          </Button>
        )}
      </div>
    </div>
  );
}
