"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Camera, Navigation, MessageSquare, Mail, Fingerprint, Users, Wallet, Radio, AlertTriangle } from "lucide-react";
import type { CaseEvent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn, importanceLabel } from "@/lib/utils";

const sourceIcons: Record<string, React.ElementType> = {
  CCTV: Camera,
  GPS: Navigation,
  Chat: MessageSquare,
  Email: Mail,
  Attendance: Users,
  Transaction: Wallet,
  Forensic: Fingerprint,
  Witness: Users,
  "IoT Sensor": Radio,
  Incident: AlertTriangle,
};

const importanceStyles = {
  High: "border-accent-300 bg-accent-50/60",
  Medium: "border-primary-200 bg-primary-50/40",
  Low: "border-border bg-white",
};

export function EventCard({
  event,
  highlighted,
  id,
}: {
  event: CaseEvent;
  highlighted?: boolean;
  id?: string;
}) {
  const Icon = sourceIcons[event.source] ?? Radio;
  const level = importanceLabel(event.importance);

  return (
    <motion.div
      id={id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-2xl border-2 p-4 shadow-sm transition-all duration-300 hover:shadow-md",
        importanceStyles[level],
        highlighted && "ring-4 ring-accent-300 border-accent-400 scale-[1.01]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white shadow-sm">
            <Icon className="h-4.5 w-4.5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">{event.actor}</p>
            <p className="text-xs text-muted-foreground">{event.source}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            <Clock className="h-3 w-3" /> {event.time}
          </span>
          <Badge
            variant={level === "High" ? "accent" : level === "Medium" ? "default" : "muted"}
            className="text-[10px] px-2 py-0"
          >
            {level} importance
          </Badge>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/90">
        <span className="font-semibold">{event.action}</span>
        {event.object ? <span> · {event.object}</span> : null}
        {event.target ? <span> → {event.target}</span> : null}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>

      <div className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <MapPin className="h-3 w-3" /> {event.location}
      </div>
    </motion.div>
  );
}
