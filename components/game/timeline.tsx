"use client";

import { AnimatePresence } from "framer-motion";
import type { CaseEvent, TimelineFilters } from "@/lib/types";
import { EventCard } from "./event-card";
import { EmptyState } from "./empty-state";
import { SearchX } from "lucide-react";

export function filterAndSortEvents(events: CaseEvent[], filters: TimelineFilters): CaseEvent[] {
  const query = filters.search.trim().toLowerCase();
  let result = events.filter((e) => {
    const matchesQuery =
      query === "" ||
      e.actor.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query) ||
      e.location.toLowerCase().includes(query) ||
      e.action.toLowerCase().includes(query) ||
      e.source.toLowerCase().includes(query);
    const matchesSource = filters.sources.length === 0 || filters.sources.includes(e.source);
    return matchesQuery && matchesSource;
  });

  const dir = filters.sortDirection === "asc" ? 1 : -1;
  result = [...result].sort((a, b) => {
    switch (filters.sortField) {
      case "importance":
        return (a.importance - b.importance) * dir;
      case "source":
        return a.source.localeCompare(b.source) * dir;
      case "actor":
        return a.actor.localeCompare(b.actor) * dir;
      case "time":
      default:
        return a.time.localeCompare(b.time) * dir;
    }
  });

  return result;
}

export function Timeline({
  events,
  filters,
  highlightedIds,
}: {
  events: CaseEvent[];
  filters: TimelineFilters;
  highlightedIds?: string[];
}) {
  const filtered = filterAndSortEvents(events, filters);

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No events match your search"
        description="Try a different keyword or clear your source filters to see the full timeline again."
      />
    );
  }

  if (filters.groupBySource) {
    const groups = new Map<string, CaseEvent[]>();
    for (const e of filtered) {
      const list = groups.get(e.source) ?? [];
      list.push(e);
      groups.set(e.source, list);
    }
    return (
      <div className="space-y-6">
        {Array.from(groups.entries()).map(([source, groupEvents]) => (
          <div key={source}>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {source} · {groupEvents.length} event{groupEvents.length > 1 ? "s" : ""}
            </p>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {groupEvents.map((e) => (
                  <EventCard key={e.id} event={e} id={`event-${e.id}`} highlighted={highlightedIds?.includes(e.id)} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {filtered.map((e) => (
          <EventCard key={e.id} event={e} id={`event-${e.id}`} highlighted={highlightedIds?.includes(e.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}
