// lib/filters.ts
// The rules for narrowing the list of options: sector tiles, search and filters.
// Kept separate from the screen code so the rules are easy to read and change.
import type { AdaptationOption } from "./options";

// ---- Sector tiles ----
// "all" shows everything. "All sectors" shows only options that apply to every sector.
export type SectorFilter = "all" | "Aquaculture" | "Mariculture" | "Fisheries" | "All sectors";

export function matchesSector(option: AdaptationOption, sector: SectorFilter): boolean {
  if (sector === "all") return true;
  if (sector === "All sectors") return option.sectors.includes("All sectors");
  // An option that applies to all sectors also counts under each single sector.
  return option.sectors.includes(sector) || option.sectors.includes("All sectors");
}

// ---- Filter groups (the tick lists on the side) ----
export type GroupKey = "hazards" | "subCategory" | "valueChainStages" | "ecosystems";

// The order and names shown on the page.
export const GROUPS: { key: GroupKey; label: string }[] = [
  { key: "hazards", label: "Climate hazard" },
  { key: "subCategory", label: "Sub-category" },
  { key: "valueChainStages", label: "Value Chain Stage" },
  { key: "ecosystems", label: "Ecosystem Type" },
];

// For each group, the values the user has ticked.
export type Selected = Record<GroupKey, string[]>;

export const emptySelected = (): Selected => ({
  hazards: [],
  subCategory: [],
  valueChainStages: [],
  ecosystems: [],
});

// Sub-category is a single value, the others are lists. This makes them all lists.
function valuesOf(option: AdaptationOption, key: GroupKey): string[] {
  if (key === "subCategory") return option.subCategory ? [option.subCategory] : [];
  return option[key];
}

// Every different value that appears in the data, sorted, for the tick list.
export function uniqueValues(options: AdaptationOption[], key: GroupKey): string[] {
  const all = new Set<string>();
  for (const option of options) valuesOf(option, key).forEach((v) => all.add(v));
  return [...all].sort((a, b) => a.localeCompare(b));
}

// Rule: within one group, an option needs at least ONE of the ticked values.
// Across groups, ALL groups with ticks must match.
export function matchesFilters(option: AdaptationOption, selected: Selected): boolean {
  return GROUPS.every(({ key }) => {
    const ticked = selected[key];
    if (ticked.length === 0) return true; // nothing ticked, so no restriction
    return valuesOf(option, key).some((v) => ticked.includes(v));
  });
}

// ---- Search box ----
// Looks in the title, descriptions, sub-category, hazards and stages.
export function matchesSearch(option: AdaptationOption, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const text = [
    option.title,
    option.shortDescription,
    option.longDescription,
    option.subCategory,
    ...option.hazards,
    ...option.valueChainStages,
  ]
    .join(" ")
    .toLowerCase();
  return text.includes(q);
}