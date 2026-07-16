"use client";

import { Search, ArrowUpDown, LayoutList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { SortDirection, SortField, TimelineFilters } from "@/lib/types";
import { cn } from "@/lib/utils";

const sortOptions: { field: SortField; label: string }[] = [
  { field: "time", label: "Time" },
  { field: "importance", label: "Importance" },
  { field: "source", label: "Source" },
  { field: "actor", label: "Actor" },
];

export function FilterBar({
  filters,
  onChange,
  sources,
}: {
  filters: TimelineFilters;
  onChange: (next: TimelineFilters) => void;
  sources: string[];
}) {
  const toggleSource = (source: string) => {
    const active = filters.sources.includes(source);
    onChange({
      ...filters,
      sources: active ? filters.sources.filter((s) => s !== source) : [...filters.sources, source],
    });
  };

  const toggleSort = (field: SortField) => {
    if (filters.sortField === field) {
      const nextDirection: SortDirection = filters.sortDirection === "asc" ? "desc" : "asc";
      onChange({ ...filters, sortDirection: nextDirection });
    } else {
      onChange({ ...filters, sortField: field, sortDirection: "asc" });
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search events, actors, locations…"
          className="pl-10"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground mr-1">
          <ArrowUpDown className="h-3.5 w-3.5" /> Sort:
        </span>
        {sortOptions.map(({ field, label }) => (
          <Badge
            key={field}
            onClick={() => toggleSort(field)}
            variant={filters.sortField === field ? "default" : "outline"}
            className="cursor-pointer select-none px-2.5 py-1"
          >
            {label} {filters.sortField === field && (filters.sortDirection === "asc" ? "↑" : "↓")}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground mr-1">Source:</span>
        {sources.map((source) => (
          <Badge
            key={source}
            onClick={() => toggleSource(source)}
            variant={filters.sources.includes(source) ? "secondary" : "outline"}
            className={cn("cursor-pointer select-none px-2.5 py-1", filters.sources.length === 0 && "opacity-60")}
          >
            {source}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Switch id="group-by-source" checked={filters.groupBySource} onCheckedChange={(checked) => onChange({ ...filters, groupBySource: checked })} />
        <Label htmlFor="group-by-source" className="flex items-center gap-1.5 font-medium">
          <LayoutList className="h-3.5 w-3.5" /> Group by source
        </Label>
      </div>
    </div>
  );
}
