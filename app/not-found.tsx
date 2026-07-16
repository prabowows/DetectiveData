"use client";

import Link from "next/link";
import { CompassIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center gap-4 py-10 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-hero text-white shadow-lg">
        <CompassIcon className="h-10 w-10" />
      </div>
      <h1 className="font-display text-3xl font-extrabold">This trail goes cold</h1>
      <p className="max-w-sm text-muted-foreground">
        We couldn&apos;t find that page. Maybe it moved, or maybe the case was never filed.
      </p>
      <Button asChild size="lg">
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
