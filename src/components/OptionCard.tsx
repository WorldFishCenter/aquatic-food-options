// components/OptionCard.tsx
// One adaptation option shown as a card. Its details expand in place.
import Image from "next/image";
import type { AdaptationOption } from "@/lib/options";
import { photoFor } from "@/lib/photo-map";
import { sectorColour, hazardClass } from "@/lib/display";

type Props = {
  option: AdaptationOption;
  expanded: boolean;
  onToggle: () => void;
};

export default function OptionCard({ option, expanded, onToggle }: Props) {
  const photo = photoFor(option.title, option.subCategory);
  const visibleHazards = expanded ? option.hazards : option.hazards.slice(0, 3);
  const extraHazards = option.hazards.length - visibleHazards.length;
  const extraSections = [
    ["Examples & Tools", option.examplesAndTools],
    ["Gender & Social Inclusion Considerations", option.genderAndSocialInclusion],
    ["Maladaptation Risks & Trade-offs", option.maladaptationRisks],
  ].filter(([, text]) => text);

  return (
    // "--c" is a CSS variable the styles use for the accent colour.
    <article
      className={`card${expanded ? " card-expanded" : ""}`}
      style={{ "--c": sectorColour(option.sectors) } as React.CSSProperties}
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

        {/* The summary is shortened until the card is expanded. */}
        {option.shortDescription && <p className={`short${expanded ? " short-expanded" : ""}`}>{option.shortDescription}</p>}

        {/* Cards show up to three hazards until the card is expanded. */}
        <div className="tags">
          {visibleHazards.map((hazard) => (
            <span key={hazard} className={hazardClass(hazard)}>
              {hazard}
            </span>
          ))}
          {!expanded && extraHazards > 0 && <span className="tag tag-more">+{extraHazards} more</span>}
        </div>

        {/* Expanded details keep the comparison in the same grid column. */}
        {expanded && (
          <div className="card-details">
            {option.longDescription && (
              <section>
                <h4>Long Description</h4>
                <p>{option.longDescription}</p>
              </section>
            )}
            {extraSections.map(([heading, text]) => (
              <section key={heading}>
                <h4>{heading}</h4>
                <p>{text}</p>
              </section>
            ))}
          </div>
        )}

        <div className="card-foot">
          {option.valueChainStages.length > 0 && <div>
            <small>Stage</small>
            {option.valueChainStages.join(" · ")}
          </div>}
          {/* This button is the single control for opening and closing details. */}
          <button type="button" className="more" onClick={onToggle} aria-expanded={expanded}>
            {expanded ? "Show less ↑" : "Read more →"}
          </button>
        </div>
      </div>
    </article>
  );
}