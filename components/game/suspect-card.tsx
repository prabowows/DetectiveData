"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { stringToHue, initials, cn } from "@/lib/utils";

export function SuspectCard({
  name,
  selected,
  onSelect,
}: {
  name: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const hue = stringToHue(name);
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "relative flex flex-col items-center gap-3 rounded-3xl border-2 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md",
        selected ? "border-primary-500 ring-4 ring-primary-100" : "border-border"
      )}
    >
      {selected && (
        <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-primary-500 text-white">
          <Check className="h-3.5 w-3.5" />
        </span>
      )}
      <Avatar className="h-20 w-20">
        <AvatarFallback
          className="text-xl font-extrabold"
          style={{ backgroundColor: `hsl(${hue}, 75%, 92%)`, color: `hsl(${hue}, 45%, 32%)` }}
        >
          {initials(name)}
        </AvatarFallback>
      </Avatar>
      <p className="font-display text-base font-bold">{name}</p>
    </motion.button>
  );
}
