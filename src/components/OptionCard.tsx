// components/OptionCard.tsx
// One adaptation option shown as a card. Its details expand in place.
import Image from "next/image";
import type { AdaptationOption } from "@/lib/options";
import { photoFor } from "@/lib/photo-map";
import { sectorColour, hazardClass } from "@/lib/display";

type Props = {
  option: AdaptationOption;
  onOpen: () => void;
};

export default function OptionCard({ option, onOpen }: Props) {
  const photo = photoFor(option.title, option.subCategory);
  const visibleHazards = option.hazards.slice(0, 3);
  const extraHazards = option.hazards.length - visibleHazards.length;

  return (
    // "--c" is a CSS variable the styles use for the accent colour.
    <article
      className="card"
      style={{ "--c": sectorColour(option.sectors) } as React.CSSProperties}
      onClick={onOpen}
    >
      {/* Photo at the top, or a plain block if there is no photo yet */}
      {photo ? (
        <Image src={photo} alt="" width={800} height={400} className="card-photo" />
      ) : (
        <div className="card-photo card-photo-empty" />
      )}

      <div className="card-body">
        <div>
          <div className="sector">
            <i className="sector-dot" />
            {option.sectors.join(" · ")}
          </div>
          <div className="sub">{option.subCategory}</div>
        </div>

        <h3>{option.title}</h3>

        {/* Short Description is draft content, shown briefly on the card. */}
        {option.shortDescription && <p className="short">{option.shortDescription}</p>}

        {/* Cards show up to three hazards until the card is expanded. */}
        <div className="tags">
          {visibleHazards.map((hazard) => (
            <span key={hazard} className={hazardClass(hazard)}>
              {hazard}
            </span>
          ))}
          {extraHazards > 0 && <span className="tag tag-more">+{extraHazards} more</span>}
        </div>

        <div className="card-foot">
          {option.valueChainStages.length > 0 && <div>
            <small>Stage</small>
            {option.valueChainStages.join(" · ")}
          </div>}
          {/* This button opens the popup for the full option. */}
          <button type="button" className="more" onClick={(event) => { event.stopPropagation(); onOpen(); }}>
            Read more →
          </button>
        </div>
      </div>
    </article>
  );
}