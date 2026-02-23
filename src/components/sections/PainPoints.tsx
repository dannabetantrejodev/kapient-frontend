"use client";

import { useEffect, useRef, useState } from "react";
import type { PainPointCardData, PainPointsData } from "@/types/strapi";
import { getStrapiImageUrl } from "@/lib/strapi";

interface PainPointsProps {
  data: PainPointsData | null;
}

interface NormalizedCard {
  id: number | string;
  title: string;
  description: string;
  imageUrl: string | null;
  iconKey: "network" | "ranking" | "shield";
  statLabel?: string | null;
  statDelta?: string | null;
}

const DEFAULT_BADGE = "Never Miss a Sale Again";
const DEFAULT_HEADING = "Your website might be losing customers silently";
const DEFAULT_SUBHEADING =
  "Broken contact forms, slow loading pages, or expired certificates often go unnoticed until sales drop and customers stop reaching out.";

const FALLBACK_CARDS: NormalizedCard[] = [
  {
    id: "network",
    imageUrl: null,
    iconKey: "network",
    title: "Never Lose a Customer to a Broken Website",
    description:
      "We make sure your website is running smoothly, so your forms and contact info always work, meaning no more missed inquiries or lost sales.",
  },
  {
    id: "ranking",
    imageUrl: null,
    iconKey: "ranking",
    title: "Boost Your Google Ranking",
    description:
      "A fast, error-free website helps you rank higher on Google. Kapinet works 24/7 to spot and diagnose website errors, and gives detailed, easy-to-follow instructions to fix issues quickly.",
    statLabel: "#1",
    statDelta: "+98%",
  },
  {
    id: "shield",
    imageUrl: null,
    iconKey: "shield",
    title: "Avoid Embarrassing Tech Issues",
    description:
      "Embarrassing technical glitches and hidden problems can hurt your brand image. Kapinet helps you detect and fix issues first, before customers notice.",
  },
];

function normalizeIconKey(
  raw: PainPointCardData["icon_key"],
  index: number,
): "network" | "ranking" | "shield" {
  if (raw === "network" || raw === "ranking" || raw === "shield") {
    return raw;
  }

  return FALLBACK_CARDS[index]?.iconKey ?? "network";
}

function extractCardImageUrl(card: PainPointCardData): string | null {
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

function normalizeCards(
  cards: PainPointCardData[] | null | undefined,
): NormalizedCard[] {
  if (!cards?.length) return FALLBACK_CARDS;

  return cards.map((card, index) => {
    const fallback =
      FALLBACK_CARDS[index] ?? FALLBACK_CARDS[FALLBACK_CARDS.length - 1];

    return {
      id: card.id,
      imageUrl: extractCardImageUrl(card),
      iconKey: normalizeIconKey(card.icon_key, index),
      title: card.title || fallback.title,
      description: card.description || fallback.description,
      statLabel: card.stat_label || fallback.statLabel || null,
      statDelta: card.stat_delta || fallback.statDelta || null,
    };
  });
}

function NetworkGraphic() {
  const nodes = [
    { x: 28, y: 28 },
    { x: 68, y: 16 },
    { x: 68, y: 62 },
    { x: 116, y: 20 },
    { x: 116, y: 58 },
    { x: 156, y: 36 },
    { x: 196, y: 16 },
    { x: 196, y: 58 },
    { x: 28, y: 74 },
    { x: 68, y: 90 },
    { x: 116, y: 86 },
    { x: 196, y: 90 },
  ];

  return (
    <div className="mx-auto h-40 w-full max-w-[320px] md:h-44">
      <svg
        viewBox="0 0 224 112"
        className="h-full w-full"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="#d4dcf8" strokeWidth="2">
          <line x1="116" y1="58" x2="68" y2="16" />
          <line x1="116" y1="58" x2="68" y2="62" />
          <line x1="116" y1="58" x2="116" y2="20" />
          <line x1="116" y1="58" x2="156" y2="36" />
          <line x1="116" y1="58" x2="116" y2="86" />
          <line x1="116" y1="58" x2="196" y2="16" />
          <line x1="116" y1="58" x2="196" y2="58" />
          <line x1="116" y1="58" x2="196" y2="90" />
          <line x1="116" y1="58" x2="68" y2="90" />
          <line x1="116" y1="58" x2="28" y2="28" />
          <line x1="116" y1="58" x2="28" y2="74" />
        </g>

        {nodes.map((node) => (
          <circle
            key={`${node.x}-${node.y}`}
            cx={node.x}
            cy={node.y}
            r="10"
            fill="#dae4ff"
          />
        ))}

        {nodes.map((node) => (
          <circle
            key={`inner-${node.x}-${node.y}`}
            cx={node.x}
            cy={node.y}
            r="3"
            fill="#7d93ea"
          />
        ))}

        <circle cx="116" cy="58" r="17" fill="#5d76f7" />
        <path d="M120 48L112 59H118L112 68" stroke="white" strokeWidth="2.6" />
      </svg>
    </div>
  );
}

function RankingGraphic({
  statLabel,
  statDelta,
}: {
  statLabel?: string | null;
  statDelta?: string | null;
}) {
  const bars = [24, 32, 50, 44, 56, 62];

  return (
    <div className="mx-auto flex h-40 w-full max-w-[320px] flex-col justify-end md:h-44">
      <div className="mb-3 flex items-center gap-2 [font-family:var(--font-anton)]">
        <span className="text-[36px] leading-none text-[#4f73f6]">
          {statLabel || "#1"}
        </span>
        <span className="rounded-full bg-[#d4dcff] px-2 py-0.5 text-xs text-[#5f73d8]">
          {statDelta || "+98%"}
        </span>
      </div>

      <div className="relative h-16 rounded-lg bg-white/65 p-2">
        <div className="flex h-full items-end gap-2">
          {bars.map((height, index) => (
            <div
              key={`${height}-${index}`}
              className={`w-5 rounded-sm ${index === 2 ? "bg-[#4ea3db]" : "bg-[#b4c3ec]"}`}
              style={{ height }}
            />
          ))}
        </div>

        <svg
          viewBox="0 0 168 56"
          className="pointer-events-none absolute inset-0 h-full w-full"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 36L32 38L56 28L80 30L104 22L126 22L148 12L162 14"
            stroke="#5d76f7"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="55" cy="28" r="4" fill="#d7f6ff" stroke="#5d76f7" />
        </svg>
      </div>
    </div>
  );
}

function ShieldGraphic() {
  return (
    <div className="mx-auto h-40 w-full max-w-[320px] md:h-44">
      <svg
        viewBox="0 0 224 112"
        className="h-full w-full"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="#ddd8ef" strokeWidth="2">
          <line x1="74" y1="30" x2="50" y2="20" />
          <line x1="74" y1="56" x2="42" y2="56" />
          <line x1="74" y1="82" x2="48" y2="94" />
          <line x1="150" y1="30" x2="176" y2="20" />
          <line x1="150" y1="56" x2="184" y2="56" />
          <line x1="150" y1="82" x2="178" y2="94" />
        </g>

        <circle cx="40" cy="18" r="11" fill="#d8d2e7" />
        <circle cx="34" cy="56" r="11" fill="#d8d2e7" />
        <circle cx="44" cy="94" r="11" fill="#d8d2e7" />
        <circle cx="186" cy="18" r="11" fill="#d8d2e7" />
        <circle cx="198" cy="56" r="11" fill="#d8d2e7" />
        <circle cx="188" cy="94" r="11" fill="#d8d2e7" />

        <path
          d="M112 18L140 26V62L112 88L84 62V26L112 18Z"
          fill="#7f6cf9"
          stroke="#6c57f2"
          strokeWidth="2"
        />

        <circle cx="112" cy="46" r="14" fill="#ffd94b" />
        <circle cx="107" cy="44" r="1.8" fill="#1f2937" />
        <circle cx="117" cy="44" r="1.8" fill="#1f2937" />
        <path
          d="M106 51C108 54 116 54 118 51"
          stroke="#1f2937"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function PainPointGraphic({
  iconKey,
  statLabel,
  statDelta,
}: {
  iconKey: "network" | "ranking" | "shield";
  statLabel?: string | null;
  statDelta?: string | null;
}) {
  if (iconKey === "ranking") {
    return <RankingGraphic statLabel={statLabel} statDelta={statDelta} />;
  }

  if (iconKey === "shield") {
    return <ShieldGraphic />;
  }

  return <NetworkGraphic />;
}

export default function PainPoints({ data }: PainPointsProps) {
  const badgeText = data?.badge_text?.trim() || DEFAULT_BADGE;
  const heading = data?.heading?.trim() || DEFAULT_HEADING;
  const subheading = data?.subheading?.trim() || DEFAULT_SUBHEADING;
  const cards = normalizeCards(data?.cards);
  const subheadingRef = useRef<HTMLParagraphElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [hasCardsEntered, setHasCardsEntered] = useState(false);

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
    }, 12);

    return () => window.clearInterval(timer);
  }, [hasStartedTyping, subheading]);

  useEffect(() => {
    const target = cardsRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasCardsEntered(true);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  const animatedSubheading = hasStartedTyping
    ? subheading.slice(0, typedLength)
    : "";

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center max-w-[685px]">
          <span className="inline-flex rounded-full bg-[#63F6FF] px-6 py-2 text-sm font-medium text-black">
            {badgeText}
          </span>

          <h2 className="mt-7 text-[25px] leading-[40px] md:leading-[60px] text-black md:text-[45px] [font-family:var(--font-anton)]">
            {heading}
          </h2>

          <p
            ref={subheadingRef}
            className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-black md:text-[20px]"
          >
            {animatedSubheading}
          </p>
        </div>

        <div
          ref={cardsRef}
          className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map((card, index) => (
            <article
              key={card.id}
              className={`rounded-[30px]  bg-gradient-to-b from-[#f0f2f7] via-[#e6f1f7] to-[#d5f5fb] px-6 pb-7 pt-6 transition-all duration-700 ease-out ${
                hasCardsEntered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              {card.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="mx-auto h-40 w-full max-w-[320px] object-contain md:h-44"
                  loading="lazy"
                />
              ) : (
                <PainPointGraphic
                  iconKey={card.iconKey}
                  statLabel={card.statLabel}
                  statDelta={card.statDelta}
                />
              )}

              <h3 className="mt-12 text-[24px] leading-[32px] text-black [font-family:var(--font-anton)]">
                {card.title}
              </h3>

              <p className="mt-4 text-[16px] leading-relaxed text-black/75">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
