"use client";
// The popup shows the full option. It closes with the close button or Escape.
import { useEffect, useRef } from "react";
import Image from "next/image";
import type { AdaptationOption } from "@/lib/options";
import { photoFor } from "@/lib/photo-map";
import { hazardClass, sectorColour } from "@/lib/display";

type Props = {
  option: AdaptationOption;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function OptionModal({ option, onClose, onPrev, onNext }: Props) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const handlers = useRef({ onClose, onPrev, onNext });

  useEffect(() => {
    handlers.current = { onClose, onPrev, onNext };
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") handlers.current.onClose();
      if (event.key === "ArrowLeft") handlers.current.onPrev();
      if (event.key === "ArrowRight") handlers.current.onNext();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const photo = photoFor(option.title, option.subCategory);
  const sections = [
    ["Gender & Social Inclusion Considerations", option.genderAndSocialInclusion],
    ["Key Sources", option.keySources],
    ["Tools & guides for implementation", option.toolsAndGuides],
    ["Trade-offs & risks", option.tradeoffsAndRisks],
    ["Intervention in practice", option.interventionInPractice],
    ["References", option.references],
  ].filter(([, text]) => text);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={option.title}
        style={{ "--c": sectorColour(option.sectors) } as React.CSSProperties}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-hero">
          {photo ? (
            <Image src={photo} alt="" width={800} height={400} className="modal-photo" />
          ) : (
            <div className="modal-photo card-photo-empty" />
          )}
          <button ref={closeButton} type="button" className="modal-close" aria-label="Close" onClick={onClose}>
            ✕
          </button>
          {photo && <span className="photo-credit">Photo: WorldFish</span>}
        </div>

        <div className="modal-body">
          <div className="sector">
            <i className="sector-dot" />
            {option.sectors.join(" · ")} · {option.subCategory}
          </div>

          <h2 className="modal-title">{option.title}</h2>

          <div className="tags">
            {option.hazards.map((hazard) => (
              <span key={hazard} className={hazardClass(hazard)}>
                {hazard}
              </span>
            ))}
          </div>

          {option.longDescription && (
            <section>
              <h3>Long Description</h3>
              <p>{option.longDescription}</p>
            </section>
          )}

          {sections.map(([heading, text]) => (
            <section key={heading}>
              <h3>{heading}</h3>
              <p>{text}</p>
            </section>
          ))}

          <div className="modal-nav">
            <button type="button" onClick={onPrev}>← Previous option</button>
            <button type="button" onClick={onNext}>Next option →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
