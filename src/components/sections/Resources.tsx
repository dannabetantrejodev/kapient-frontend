"use client";

import { useEffect, useRef, useState } from "react";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { ResourcesData } from "@/types/strapi";

interface ResourcesProps {
  data: ResourcesData | null;
}

const FALLBACK_HEADING = "Latest Insights";
const FALLBACK_SUBHEADING =
  "Expert perspectives on digital marketing, SEO, and business growth strategies";

const FALLBACK_CARDS = [
  {
    id: "guide-1",
    category: "Guide",
    title: "How to Fix a Broken Contact Form in 5 Steps",
    description:
      "A step-by-step guide to diagnosing and resolving the most common contact form issues.",
    link_label: "Read guide",
    link_url: "#",
    image: null,
    icon_key: "book",
  },
  {
    id: "guide-2",
    category: "Case Study",
    title: "How Acme Co. Reduced Downtime by 85%",
    description:
      "Learn how a mid-sized e-commerce store used Kapinet to protect $120k in monthly revenue.",
    link_label: "Read case study",
    link_url: "#",
    image: null,
    icon_key: "chart",
  },
  {
    id: "guide-3",
    category: "Checklist",
    title: "The Ultimate Website Health Checklist",
    description:
      "12 things every business owner should check on their website every month — with a downloadable PDF.",
    link_label: "Get checklist",
    link_url: "#",
    image: null,
    icon_key: "check",
  },
];

function ResourceIcon({ iconKey }: { iconKey: string | null }) {
  const base = "h-6 w-6";
  switch ((iconKey ?? "").toLowerCase()) {
    case "book":
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      );
    case "chart":
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
    case "check":
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      );
    case "video":
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
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  Guide: "bg-blue-100 text-blue-700",
  "Case Study": "bg-purple-100 text-purple-700",
  Checklist: "bg-green-100 text-green-700",
  Video: "bg-amber-100 text-amber-700",
  Tutorial: "bg-cyan-100 text-cyan-700",
};

function getCategoryColor(category: string | null): string {
  if (!category) return "bg-gray-100 text-gray-600";
  return CATEGORY_COLORS[category] ?? "bg-gray-100 text-gray-600";
}

export default function Resources({ data }: ResourcesProps) {
  const heading = data?.heading?.trim() || FALLBACK_HEADING;
  const subheading = data?.subheading?.trim() || FALLBACK_SUBHEADING;
  const cards = data?.cards?.length ? data.cards : FALLBACK_CARDS;
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
      setTypedLength((previous) => {
        const next = previous + 1;
        if (next >= subheading.length) {
          window.clearInterval(timer);
          return subheading.length;
        }
        return next;
      });
    }, 28);

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
      { threshold: 0.2 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  const animatedSubheading = hasStartedTyping
    ? subheading.slice(0, typedLength)
    : "";

  return (
    <section className="bg-gradient-to-b from-white via-[#f2f5ff] to-[#c7d5ff] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mt-2 text-[36px] leading-[0.95] text-black [font-family:var(--font-anton)] lg:text-[64px] md:text-[52px]">
            {heading}
          </h2>

          {subheading && (
            <p
              ref={subheadingRef}
              className="mx-auto mt-6 max-w-[680px] text-base leading-relaxed text-black/80 md:text-[20px]"
            >
              {animatedSubheading}
            </p>
          )}
        </div>

        {/* Resource cards */}
        <div
          ref={cardsRef}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map((card, index) => {
            const imageUrl = card.image?.url
              ? getStrapiImageUrl(card.image.url)
              : null;

            return (
              <article
                key={card.id ?? index}
                className={`group flex cursor-pointer flex-col overflow-hidden rounded-[24px] bg-[#f6f8ff] shadow-[0_10px_20px_rgba(16,24,40,0.12)] transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(79,115,246,0.22)] ${
                  hasCardsEntered
                    ? "translate-x-0 opacity-100"
                    : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                {/* Image or icon area */}
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={card.title}
                    className="h-[190px] w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-[190px] items-center justify-center bg-gradient-to-br from-[#4f73f6]/10 to-[#5edce9]/10">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#4f73f6] shadow-sm">
                      <ResourceIcon iconKey={card.icon_key} />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                  {/* Category pill */}
                  {card.category && (
                    <span
                      className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColor(card.category)}`}
                    >
                      {card.category}
                    </span>
                  )}

                  <h3 className="mt-3 text-[24px] font-normal leading-[100%] tracking-[0] text-black [font-family:var(--font-anton)]">
                    {card.title}
                  </h3>

                  {card.description && (
                    <p className="mt-3 flex-1 text-[16px] font-normal leading-[25px] tracking-[0] text-black/80 [font-family:var(--font-inter)]">
                      {card.description}
                    </p>
                  )}

                  {/* Link */}
                  {card.link_label && (
                    <a
                      href={card.link_url ?? "#"}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4f73f6] transition-colors hover:text-[#3a5ce0]"
                    >
                      {card.link_label}
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
