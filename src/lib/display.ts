// lib/display.ts
// Colours and tag styles used by the cards,
// kept in one place so they always match.

// Each sector has its own colour, taken from the design.
const SECTOR_COLOURS: Record<string, string> = {
  Aquaculture: "var(--teal)",
  Mariculture: "var(--ocean)",
  Fisheries: "var(--kelp)",
  "All sectors": "var(--terracotta)",
};

// The first sector decides the accent colour.
export function sectorColour(sectors: string[]): string {
  return SECTOR_COLOURS[sectors[0]] ?? "var(--muted)";
}

// Picks the tag colour class based on the hazard's name.
export function hazardClass(hazard: string): string {
  const h = hazard.toLowerCase();
  if (h.includes("heat")) return "tag tag-heat";
  if (h.includes("drought")) return "tag tag-drought";
  if (h.includes("multiple")) return "tag tag-multi";
  if (h.includes("salin")) return "tag tag-salt";
  return "tag tag-water"; // floods, storms, sea-level rise, rain, etc.
}