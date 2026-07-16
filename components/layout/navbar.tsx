"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShieldCheck, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/cases", label: "Case Library", icon: Search },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];

export function Navbar() {
  const pathname = usePathname();
  const isInvestigation = pathname?.includes("/investigate");

  if (isInvestigation) {
    // The investigation desk wants maximum screen real estate — keep only a slim bar.
    return (
      <header className="sticky top-0 z-40 glass border-b">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display text-base font-extrabold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-hero text-white text-sm">🔎</span>
            Detective Data
          </Link>
          <Link href="/cases" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            Exit investigation
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 glass border-b">
      <div className="container flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-lg text-white shadow-sm">
            🔎
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-extrabold tracking-tight">Detective Data</p>
            <p className="text-[11px] font-medium text-muted-foreground -mt-0.5">Investigate. Think. Solve.</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl bg-muted p-1 sm:flex">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                  active ? "bg-white text-primary-700 shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <nav className="flex items-center gap-1 sm:hidden">
          {links.map(({ href, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl",
                  active ? "bg-primary-500 text-white" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
