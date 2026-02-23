"use client";

import { useEffect, useRef, useState } from "react";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { BusinessImpactData, ImpactCardData } from "@/types/strapi";

interface BusinessImpactProps {
  data: BusinessImpactData | null;
}

interface NormalizedImpactCard {
  id: number | string;
  iconKey: string | null;
  stat: string;
  label: string;
  description: string;
  imageUrl: string | null;
  imagePosition: "left" | "right";
}

const FALLBACK_HEADING = "Real Business Consequences";
const FALLBACK_SUBHEADING =
  "Broken flows quietly cost trust and revenue. Kapinet helps teams catch issues early and avoid expensive surprises.";

const FALLBACK_CARDS: NormalizedImpactCard[] = [
  {
    id: "impact-1",
    iconKey: "shield",
    stat: "Trust & Revenue",
    label: "Real Business Consequences",
    description:
      "A broken website can lead to lost trust, missed opportunities, and direct revenue loss.",
    imageUrl: null,
    imagePosition: "left",
  },
  {
    id: "impact-2",
    iconKey: "chart",
    stat: "What You Cannot Miss",
    label: "What You Cannot Afford to Miss",
    description:
      "Slow pages and broken forms can hurt conversions and customer confidence before anyone reports it.",
    imageUrl: null,
    imagePosition: "right",
  },
];

function extractCardImage(card: ImpactCardData): string | null {
  if (card.image?.url) {
    return getStrapiImageUrl(card.image.url);
  }

  const nested = card.image as unknown as {
    data?: {
      url?: string;
      attributes?: {
        url?: string;
      };
    };
  };

  const nestedUrl = nested?.data?.url ?? nested?.data?.attributes?.url;
  if (!nestedUrl) return null;

  return getStrapiImageUrl(nestedUrl);
}

function normalizeImagePosition(
  value: ImpactCardData["image_position"],
  index: number,
): "left" | "right" {
  if (value === "left" || value === "right") {
    return value;
  }

  return FALLBACK_CARDS[index]?.imagePosition ?? "right";
}

function normalizeCards(
  cards: ImpactCardData[] | null | undefined,
): NormalizedImpactCard[] {
  if (!cards?.length) return FALLBACK_CARDS;

  return cards.map((card, index) => {
    const fallback =
      FALLBACK_CARDS[index] ?? FALLBACK_CARDS[FALLBACK_CARDS.length - 1];

    return {
      id: card.id ?? fallback.id,
      iconKey: card.icon_key ?? fallback.iconKey,
      stat: card.stat?.trim() || fallback.stat,
      label: card.label?.trim() || fallback.label,
      description: card.description?.trim() || fallback.description,
      imageUrl: extractCardImage(card),
      imagePosition: normalizeImagePosition(card.image_position, index),
    };
  });
}

function ImpactIcon({ iconKey }: { iconKey: string | null }) {
  const base = "h-8 w-8";

  switch ((iconKey ?? "").toLowerCase()) {
    case "shield":
      return (
        <svg
          className={base}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      );
    case "users":
      return (
        <svg
          className={base}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      );
    case "zap":
      return (
        <svg
          className={base}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      );
    default:
      return (
        <svg
          className={base}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      );
  }
}

function CardMedia({
  imageUrl,
  label,
  iconKey,
}: {
  imageUrl: string | null;
  label: string;
  iconKey: string | null;
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={label}
        className="h-[250px] w-full rounded-[24px] border-[12px] border-[#4f73f6] bg-white object-cover md:h-[300px]"
        loading="lazy"
      />
    );
  }

  return (
    <div className="flex h-[220px] items-center justify-center rounded-[24px] border-[12px] border-[#4f73f6] bg-white md:h-[300px]">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#e8f8fb] text-[#4f73f6]">
        <ImpactIcon iconKey={iconKey} />
      </div>
    </div>
  );
}

export default function BusinessImpact({ data }: BusinessImpactProps) {
  const heading = data?.heading?.trim() || FALLBACK_HEADING;
  const subheading = data?.subheading?.trim() || FALLBACK_SUBHEADING;
  const cards = normalizeCards(data?.cards);
  const subheadingRef = useRef<HTMLParagraphElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [visibleCards, setVisibleCards] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const target = subheadingRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasStartedTyping(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStartedTyping) return;

    const timer = window.setInterval(() => {
      setTypedLength((prev) => {
        const next = prev + 1;
        if (next >= subheading.length) {
          window.clearInterval(timer);
          return subheading.length;
        }
        return next;
      });
    }, 14);

    return () => window.clearInterval(timer);
  }, [hasStartedTyping, subheading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const indexAttr = (entry.target as HTMLElement).dataset.cardIndex;
          if (!indexAttr) return;

          const cardIndex = Number(indexAttr);
          if (Number.isNaN(cardIndex)) return;

          setVisibleCards((prev) =>
            prev[cardIndex] ? prev : { ...prev, [cardIndex]: true },
          );

          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );

    cardRefs.current.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [cards.length]);

  const animatedSubheading = hasStartedTyping
    ? subheading.slice(0, typedLength)
    : "";

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[864px] text-center">
          <h2 className="mt-7 text-[25px] leading-tight text-black md:text-[45px] [font-family:var(--font-anton)]">
            {heading}
          </h2>

          {subheading && (
            <p
              ref={subheadingRef}
              className="mx-auto mt-5 max-w-[864px] text-base leading-relaxed text-black/75 md:text-[20px]"
            >
              {animatedSubheading}
            </p>
          )}
        </div>

        <div className="mt-14 space-y-8">
          {cards.map((card, index) => {
            const imageOrder =
              card.imagePosition === "left" ? "lg:order-1" : "lg:order-2";
            const contentOrder =
              card.imagePosition === "left" ? "lg:order-2" : "lg:order-1";
            const isVisible = Boolean(visibleCards[index]);

            return (
              <article
                key={card.id ?? index}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                data-card-index={index}
                className={`grid items-center gap-12  p-6 transition-all duration-700 ease-out md:p-8 lg:grid-cols-2 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 130}ms` }}
              >
                <div className={contentOrder}>
                  <h3 className="mt-3 text-[20px] md:text-[35px] leading-[0.98] text-black [font-family:var(--font-anton)]">
                    {card.label}
                  </h3>

                  <p className="mt-4 text-[20px] leading-relaxed text-black/75 ">
                    {card.description}
                  </p>
                </div>

                <div className={imageOrder}>
                  <CardMedia
                    imageUrl={card.imageUrl}
                    label={card.label}
                    iconKey={card.iconKey}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
