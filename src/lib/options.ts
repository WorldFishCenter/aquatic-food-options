// lib/options.ts
// Reads the adaptation options from Airtable and tidies them
// into a simple shape the website can use.
// This file only runs on the server, so the token is never sent to the browser.

// The shape of one adaptation option on our site.
export type AdaptationOption = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  subCategory: string;
  hazards: string[];
  sectors: string[];
  valueChainStages: string[];
  ecosystems: string[];
  examplesAndTools: string;
  genderAndSocialInclusion: string;
  maladaptationRisks: string;
  keySources: string;
  toolsAndGuides: string;
  synergies: string;
  tradeoffsAndRisks: string;
  interventionInPractice: string;
  references: string;
};

// This is the small part of an Airtable response that the mapper needs.
type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

// Airtable may return one value, a semicolon-separated string, or several values.
function toList(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [value];
  return values
    .flatMap((item) => typeof item === "string" ? item.split(";") : [String(item ?? "")])
    .map((item) => item.trim())
    .filter(Boolean);
}

// Long text fields are optional, so missing values become an empty string.
function toText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

// Sector labels include detail after a colon, but the site only shows main sectors.
function simplifySectors(raw: string[]): string[] {
  const main = new Set<string>();
  for (const item of raw) {
    const name = item.split(":")[0].trim().toLowerCase();
    if (name === "all sectors") return ["All sectors"];
    if (name === "aquaculture") main.add("Aquaculture");
    if (name === "mariculture") main.add("Mariculture");
    if (name === "fisheries" || name === "marine") main.add("Fisheries");
  }
  if (main.size === 3) {
    return ["All sectors"];
  }
  return [...main];
}

// Fetches every record from Airtable (it sends them in pages of 100).
export async function getOptions(): Promise<AdaptationOption[]> {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE;

  if (!token || !baseId || !table) {
    throw new Error("Missing Airtable settings in .env.local");
  }

  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`
    );
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`Airtable error ${response.status}`);
    }

    const data = (await response.json()) as {
      records?: AirtableRecord[];
      offset?: string;
    };
    records.push(...(data.records ?? []));
    offset = data.offset; // undefined when there are no more pages
  } while (offset);

  // Turn each Airtable record into our tidy shape.
  return records.map((record) => {
    const f: Record<string, unknown> = record.fields ?? {};
    return {
      id: record.id,
      title: String(f["Adaptation Option"] ?? "").trim(),
      shortDescription: toText(f["Short Description (draft)"] ?? f["Short Description"]),
      longDescription: toText(f["Long Description"]),
      subCategory: toText(f["Adaptation Sub-category"]),
      hazards: toList(f["Climate Hazard"]),
      sectors: simplifySectors(toList(f["Sector [add]"] ?? f["Sector"])),
      valueChainStages: toList(f["Value Chain Stage [add]"] ?? f["Value Chain Stage"]),
      ecosystems: toList(f["Ecosystem Type"]),
      examplesAndTools: toText(f["Examples & Tools (from current list)"] ?? f["Examples & Tools"]),
      genderAndSocialInclusion: toText(f["Gender & Social Inclusion Considerations"]),
      maladaptationRisks: toText(f["Maladaptation Risks & Trade-offs"]),
      keySources: toText(f["Key Sources"]),
      toolsAndGuides: toText(f["Tools & guides for implementation"]),
      synergies: toText(f["Synergies"]),
      tradeoffsAndRisks: toText(f["Trade-offs & risks"]),
      interventionInPractice: toText(f["Intervention in practice"]),
      references: toText(f["References"]),
    };
  });
}