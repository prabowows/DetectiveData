import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class lists, resolving conflicts (last one wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format "HH:MM" (or any short time string) consistently across the app. */
export function formatTime(time: string): string {
  return time;
}

/** Deterministic pastel-ish color for a suspect avatar, based on their name. */
export function stringToHue(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

export function importanceLabel(importance: number): "Low" | "Medium" | "High" {
  if (importance >= 5) return "High";
  if (importance >= 3) return "Medium";
  return "Low";
}
