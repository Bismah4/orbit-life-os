import * as React from "react";
import { cn } from "@/lib/utils";
import { CATEGORY_LABEL, PRIORITY_LABEL, type Category, type Priority } from "@/lib/orbit-types";

const PRI_STYLES: Record<Priority, string> = {
  high: "bg-[color-mix(in_oklab,var(--pri-high)_18%,transparent)] text-[var(--pri-high)] ring-1 ring-[color-mix(in_oklab,var(--pri-high)_40%,transparent)]",
  med:  "bg-[color-mix(in_oklab,var(--pri-med)_18%,transparent)] text-[var(--pri-med)] ring-1 ring-[color-mix(in_oklab,var(--pri-med)_40%,transparent)]",
  low:  "bg-[color-mix(in_oklab,var(--pri-low)_18%,transparent)] text-[var(--pri-low)] ring-1 ring-[color-mix(in_oklab,var(--pri-low)_40%,transparent)]",
};

const CAT_STYLES: Record<Category, string> = {
  money:  "bg-[color-mix(in_oklab,var(--cat-money)_15%,transparent)] text-[var(--cat-money)] ring-1 ring-[color-mix(in_oklab,var(--cat-money)_30%,transparent)]",
  work:   "bg-[color-mix(in_oklab,var(--cat-work)_15%,transparent)] text-[var(--cat-work)] ring-1 ring-[color-mix(in_oklab,var(--cat-work)_30%,transparent)]",
  admin:  "bg-[color-mix(in_oklab,var(--cat-admin)_15%,transparent)] text-[var(--cat-admin)] ring-1 ring-[color-mix(in_oklab,var(--cat-admin)_30%,transparent)]",
  health: "bg-[color-mix(in_oklab,var(--cat-health)_15%,transparent)] text-[var(--cat-health)] ring-1 ring-[color-mix(in_oklab,var(--cat-health)_30%,transparent)]",
  people: "bg-[color-mix(in_oklab,var(--cat-people)_15%,transparent)] text-[var(--cat-people)] ring-1 ring-[color-mix(in_oklab,var(--cat-people)_30%,transparent)]",
  goals:  "bg-[color-mix(in_oklab,var(--cat-goals)_15%,transparent)] text-[var(--cat-goals)] ring-1 ring-[color-mix(in_oklab,var(--cat-goals)_30%,transparent)]",
};

const BASE = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium tracking-wide uppercase";

export function PriorityChip({ value, className }: { value: Priority; className?: string }) {
  return <span className={cn(BASE, PRI_STYLES[value], className)}>{PRIORITY_LABEL[value]}</span>;
}

export function CategoryChip({ value, className }: { value: Category; className?: string }) {
  return <span className={cn(BASE, CAT_STYLES[value], className)}>{CATEGORY_LABEL[value]}</span>;
}
