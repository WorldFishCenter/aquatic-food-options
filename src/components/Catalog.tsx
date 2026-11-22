"use client";
// components/Catalog.tsx
// The whole interactive part of the page: sector tiles, search box,
// filters, the grid of cards, and inline card expansions.
import { useEffect, useMemo, useState } from "react";
import type { AdaptationOption } from "@/lib/options";
import {
  GROUPS, emptySelected, matchesFilters, matchesSearch, matchesSector, uniqueValues,
  type GroupKey, type Selected, type SectorFilter,
} from "@/lib/filters";
import OptionCard from "./OptionCard";

// The row of tiles at the top, with the colours from the design.
const TILES: { value: SectorFilter; label: string; colour: string }[] = [
  { value: "all", label: "All options", colour: "var(--ink)" },
  { value: "Aquaculture", label: "Aquaculture", colour: "var(--teal)" },
  { value: "Mariculture", label: "Mariculture", colour: "var(--ocean)" },
  { value: "Fisheries", label: "Fisheries", colour: "var(--kelp)" },
  { value: "All sectors", label: "Across all sectors", colour: "var(--terracotta)" },
];

export default function Catalog({ options }: { options: AdaptationOption[] }) {
  // Things the page remembers. Changing any of them redraws the grid.
  const [sector, setSector] = useState<SectorFilter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Selected>(emptySelected());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Whether the filter list is unfolded. On a phone we start with it folded away.
  const [filtersOpen, setFiltersOpen] = useState(true);
  useEffect(() => {
    // 861px and wider counts as a tablet or computer, so the filters stay open there.
    const frame = window.requestAnimationFrame(() => {
      setFiltersOpen(window.matchMedia("(min-width: 861px)").matches);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // The options that pass the tile, the search and the filters.
  const visible = useMemo(
    () =>
      options.filter(
        (o) => matchesSector(o, sector) && matchesSearch(o, query) && matchesFilters(o, selected)
      ),
    [options, sector, query, selected]
  );

  // The tick lists are built from the data, so new values in Airtable appear on their own.
  const groups = useMemo(
    () => GROUPS.map((g) => ({ ...g, values: uniqueValues(options, g.key) })),
    [options]
  );

  const hasActiveFilters =
    sector !== "all" || query.trim() !== "" || GROUPS.some((g) => selected[g.key].length > 0);

  // How many filter boxes are ticked, shown next to the word "Filters".
  const activeCount = GROUPS.reduce((sum, g) => sum + selected[g.key].length, 0);

  // Tick or untick one value in one sidebar group.
  function toggle(key: GroupKey, value: string) {
    setSelected((prev) => {
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      };
    });
  }

  // Remove one selected value without changing the other filters.
  function removeFilter(key: GroupKey, value: string) {
    setSelected((prev) => ({
      ...prev,
      [key]: prev[key].filter((selectedValue) => selectedValue !== value),
    }));
  }

  // Open or close one card while leaving all other cards unchanged.
  function toggleExpanded(id: string) {
    setExpandedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearAll() {
    setSector("all");
    setQuery("");
    setSelected(emptySelected());
    setExpandedIds(new Set());
  }

  // These labels make the active controls clear and easy to remove.
  const activePills = [
    ...(sector !== "all" ? [{ label: "Sector", value: sector, onRemove: () => setSector("all") }] : []),
    ...(query.trim() ? [{ label: "Search", value: query.trim(), onRemove: () => setQuery("") }] : []),
    ...GROUPS.flatMap((group) =>
      selected[group.key].map((value) => ({
        label: group.label,
        value,
        onRemove: () => removeFilter(group.key, value),
      }))
    ),
  ];

  return (
    <>
      {/* Sector tiles: click one to narrow the list */}
      <div className="tiles">
        {TILES.map((tile) => (
          <button
            key={tile.value}
            type="button"
            className="tile"
            style={{ "--c": tile.colour } as React.CSSProperties}
            aria-pressed={sector === tile.value}
            onClick={() => setSector(sector === tile.value && tile.value !== "all" ? "all" : tile.value)}
          >
            <small>{tile.label}</small>
            {/* The count comes from all options, so it does not change when you search */}
            <b>{options.filter((o) => matchesSector(o, tile.value)).length}</b>
          </button>
        ))}
      </div>
      <p className="note">
        Options can belong to more than one sector, so these counts add up to more than{" "}
        {options.length}.
      </p>

      {/* Search, active filter pills, and the result count share one row. */}
      <div className="bar">
        <input
          type="search"
          className="search"
          placeholder="Search options…"
          aria-label="Search options"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {activePills.length > 0 && (
          <div className="active-pills" aria-label="Active filters">
            {activePills.map((pill) => (
              <button
                key={`${pill.label}-${pill.value}`}
                type="button"
                className="chip"
                onClick={pill.onRemove}
                aria-label={`Remove ${pill.label}: ${pill.value}`}
              >
                {pill.label}: {pill.value} ×
              </button>
            ))}
            <button type="button" className="clear clear-inline" onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}
        <span className="count">
          Showing {visible.length} of {options.length}
        </span>
      </div>

      <div className="layout">
        {/* Filters. <details> can fold away, which is what we want on a phone. */}
        <details
          className="filters"
          open={filtersOpen}
          onToggle={(e) => setFiltersOpen(e.currentTarget.open)}
        >
          <summary>Filters{activeCount > 0 ? ` (${activeCount})` : ""}</summary>
          {groups.map((group) => (
            <div key={group.key} className="filter-group">
              <h4>{group.label}</h4>
              {/* Real checkboxes, like the Figma design. Clicking the label ticks the box. */}
              <div className="checks">
                {group.values.map((value) => (
                  <label key={value} className="check">
                    <input
                      type="checkbox"
                      checked={selected[group.key].includes(value)}
                      onChange={() => toggle(group.key, value)}
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type="button" className="clear" onClick={clearAll} disabled={!hasActiveFilters}>
            Clear all
          </button>
        </details>

        {/* The grid, or a friendly message if nothing matches */}
        {visible.length > 0 ? (
          <div className="grid">
            {visible.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                expanded={expandedIds.has(option.id)}
                onToggle={() => toggleExpanded(option.id)}
              />
            ))}
          </div>
        ) : (
          <div className="no-match">
            <p>No options match these filters.</p>
            <button type="button" className="clear" onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}
      </div>

    </>
  );
}