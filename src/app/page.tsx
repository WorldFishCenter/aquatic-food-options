// app/page.tsx
// The home page: a title and the catalog of adaptation options.
import { getOptions } from "@/lib/options";
import { photoFor } from "@/lib/photo-map";
import Catalog from "@/components/Catalog";
import Image from "next/image";

export default async function Home() {
  // Read the options from Airtable on the server, so the token stays private.
  const options = await getOptions();

  // Helpful while we build: list options that have no photo in the terminal.
  const noPhoto = options.filter((o) => !photoFor(o.title, o.subCategory));
  if (noPhoto.length) {
    console.warn("No photo for:", noPhoto.map((o) => o.title));
  }

  return (
    <main className="wrap">
      {/* Banner: a wide photo with the title on top of a dark blue tint */}
<header className="banner">
  {/* "fill" makes the photo cover the banner. "priority" loads it first. */}
  <Image
    src="/photos/03_improved-pond-water-management.jpg"
    alt=""
    fill
    priority
    sizes="100vw"
    className="banner-img"
  />
  <div className="banner-text">
    <h1>Adaptation options</h1>
    <p className="lede">
      Practical ways to help fish farmers, fishers and coastal communities
      adapt to a changing climate.
    </p>
  </div>
  <span className="banner-credit">Photo: WorldFish</span>
</header>
      {/* The Catalog shows the grid and expands cards in place */}
      <Catalog options={options} />
    </main>
  );
}