"use client";
import { useSeedCases } from "@/lib/use-seed-cases";

/** Thin client wrapper so the root layout can stay a server component. */
export function SeedProvider({ children }: { children: React.ReactNode }) {
  useSeedCases();
  return <>{children}</>;
}
