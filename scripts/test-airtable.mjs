// scripts/test-airtable.mjs
// Step 4: checks that we can read the Airtable table.
// It prints how many records it found and the exact column names.
// It never prints the token.

// Read the secrets we saved in .env.local
const token = process.env.AIRTABLE_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;
const table = process.env.AIRTABLE_TABLE;

// Stop early with a clear message if something is missing
if (!token || !baseId || !table) {
  console.error("A value is missing in .env.local. Check AIRTABLE_TOKEN, AIRTABLE_BASE_ID and AIRTABLE_TABLE.");
  process.exit(1);
}
// Debug: show the exact values being used. JSON.stringify makes hidden
// spaces and stray quotes visible. The token itself is NOT printed, only its length.
console.log("Base ID:", JSON.stringify(baseId));
console.log("Table:", JSON.stringify(table));
console.log("Token length:", token ? token.length : "missing");
// Airtable sends records in pages of up to 100, so we keep asking
// for the next page until there is none left.
async function fetchAllRecords() {
  const records = [];
  let offset;

  do {
    // encodeURIComponent turns spaces in the table name into %20
    const url = new URL(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`
    );
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Explain the most common problems in plain language
    if (!response.ok) {
          console.error(await response.text()); // Airtable's own explanation
      if (response.status === 401) console.error("401: Airtable rejected the token. Check AIRTABLE_TOKEN.");
      else if (response.status === 403) console.error("403: The token does not have access to this base, or is missing the data.records:read permission.");
      else if (response.status === 404) console.error("404: Base ID or table name not found. Check AIRTABLE_BASE_ID and AIRTABLE_TABLE.");
      else console.error(`Airtable returned an error: ${response.status}`);
      process.exit(1);
    }

    const data = await response.json();
    records.push(...data.records);
    offset = data.offset; // undefined when there are no more pages
  } while (offset);

  return records;
}

const records = await fetchAllRecords();

// Airtable leaves out empty fields, so collect the column names
// from every record, not just the first one.
const fieldNames = new Set();
for (const record of records) {
  Object.keys(record.fields).forEach((name) => fieldNames.add(name));
}

console.log(`Found ${records.length} records.`);
console.log("\nColumn names that have data:");
[...fieldNames].forEach((name) => console.log(` - ${name}`));

// Show the first record's fields (names only, so nothing long floods the screen)
console.log("\nFirst record's fields:", Object.keys(records[0]?.fields ?? {}));