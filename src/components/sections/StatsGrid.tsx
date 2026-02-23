"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { StatsCardGroupData, StatsGridData } from "@/types/strapi";

interface StatsGridProps {
  data: StatsGridData | null;
}

interface NormalizedGroup {
  id: number | string;
  descriptionTitle: string;
  descriptionText: string;
  statValue: string;
  statCaption: string;
}

const FALLBACK_BADGE = "Website Error Monitoring";
const FALLBACK_HEADING =
  "Reduced Technical Errors Can Improve Your Bottom Line";
const FALLBACK_SUBHEADING =
  "Your website could be losing customers without you even knowing it.";

const FALLBACK_GROUPS: NormalizedGroup[] = [
  {
    id: "group-1",
    descriptionTitle: "Better HTTPS Configurations",
    descriptionText:
      "More than 95% of websites have undetected redirect or HTTPS configuration issues.",
    statValue: "95%",
    statCaption: "",
  },
  {
    id: "group-2",
    descriptionTitle: "Accurate Physical Address",
    descriptionText:
      "46% of consumers lose trust in a business after finding an incorrect address online.",
    statValue: "46%",
    statCaption: "",
  },
  {
    id: "group-3",
    descriptionTitle: "More Organic Traffic",
    descriptionText: "Top 3 Google results capture over half of all clicks.",
    statValue: "40%",
    statCaption: "",
  },
  {
    id: "group-4",
    descriptionTitle: "Faster Page Loads",
    descriptionText:
      "Each extra second of load time can cost ecommerce stores significant revenue.",
    statValue: "$14,000",
    statCaption: "",
  },
];

const DESC_LAYOUT: string[] = [
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-4 lg:row-start-2",
  "lg:col-start-1 lg:row-start-3",
  "lg:col-start-3 lg:row-start-3",
];

const STAT_LAYOUT: string[] = [
  "lg:col-start-4 lg:row-start-1",
  "lg:col-start-3 lg:row-start-2",
  "lg:col-start-2 lg:row-start-3",
  "lg:col-start-4 lg:row-start-3",
];

interface ParsedStatValue {
  prefix: string;
  suffix: string;
  target: number;
  decimals: number;
}

function parseStatValue(value: string): ParsedStatValue | null {
  const trimmedValue = value.trim();
  const numericMatch = trimmedValue.match(/-?\d[\d,]*(?:\.\d+)?/);
  if (!numericMatch) return null;

  const numericPart = numericMatch[0];
  const normalizedNumber = numericPart.replace(/,/g, "");
  const target = Number(normalizedNumber);
  if (Number.isNaN(target)) return null;

  const startIndex = numericMatch.index ?? 0;
  const decimalDigits = normalizedNumber.split(".")[1]?.length ?? 0;

  return {
    prefix: trimmedValue.slice(0, startIndex),
    suffix: trimmedValue.slice(startIndex + numericPart.length),
    target,
    decimals: decimalDigits,
  };
}

function formatAnimatedStatValue(
  parsedValue: ParsedStatValue,
  currentValue: number,
): string {
  const roundedValue =
    parsedValue.decimals > 0
      ? Number(currentValue.toFixed(parsedValue.decimals))
      : Math.round(currentValue);

  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: parsedValue.decimals,
    maximumFractionDigits: parsedValue.decimals,
  }).format(roundedValue);

  return `${parsedValue.prefix}${formattedNumber}${parsedValue.suffix}`;
}

function normalizeGroups(
  groups: StatsCardGroupData[] | null | undefined,
): NormalizedGroup[] {
  return FALLBACK_GROUPS.map((fallback, index) => {
    const source = groups?.[index];

    return {
      id: source?.id ?? fallback.id,
      descriptionTitle:
        source?.description_title?.trim() || fallback.descriptionTitle,
      descriptionText:
        source?.description_text?.trim() || fallback.descriptionText,
      statValue: source?.stat_value?.trim() || fallback.statValue,
      statCaption: source?.stat_caption?.trim() || fallback.statCaption,
    };
  });
}

function extractFeaturedImageUrl(data: StatsGridData | null): string | null {
  if (data?.featured_image?.url) {
    return getStrapiImageUrl(data.featured_image.url);
  }

  const nested = data?.featured_image as unknown as {
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

function DescriptionCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="flex min-h-[180px] flex-col rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(16,24,40,0.08)] lg:h-full">
      <div className="mb-8 inline-flex h-8 w-8 items-center justify-center rounded-full border-[5px] border-[#55d5eb] bg-[#d9f5ff]">
        <span className="h-2 w-2 rounded-full bg-[#5a79f7]" />
      </div>

      <div className="mt-auto"></div>
      <h3 className="text-[24px] leading-[0.95] text-black [font-family:var(--font-anton)]">
        {title}
      </h3>

      <p className=" pt-4 text-sm leading-relaxed text-black/75">
        {description}
      </p>
    </article>
  );
}

function StatisticCard({
  value,
  caption,
  shouldAnimate,
}: {
  value: string;
  caption: string;
  shouldAnimate: boolean;
}) {
  const parsedValue = useMemo(() => parseStatValue(value), [value]);
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    if (!parsedValue || !shouldAnimate) {
      return;
    }

    const durationMs = 2200;
    let animationFrame = 0;
    const startTime = performance.now();

    const runFrame = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / durationMs, 1);
      const nextValue = parsedValue.target * progress;

      setCurrentNumber(nextValue);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(runFrame);
      }
    };

    animationFrame = window.requestAnimationFrame(runFrame);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [parsedValue, shouldAnimate]);

  const displayValue = useMemo(() => {
    if (!parsedValue) return value;

    const rawValue = shouldAnimate ? currentNumber : 0;
    return formatAnimatedStatValue(parsedValue, rawValue);
  }, [currentNumber, parsedValue, shouldAnimate, value]);

  return (
    <article className="flex min-h-[170px] flex-col justify-center rounded-2xl bg-gradient-to-br from-[#5d8ef4] to-[#5b79ee] p-5 shadow-[0_10px_30px_rgba(16,24,40,0.15)] lg:h-full">
      <p className="text-center text-[64px] leading-none text-[#dcfbff] [font-family:var(--font-anton)]">
        {displayValue}
      </p>
      {caption && (
        <p className="mt-3 text-center text-sm leading-relaxed text-[#e6f6ff]/85">
          {caption}
        </p>
      )}
    </article>
  );
}

export default function StatsGrid({ data }: StatsGridProps) {
  const badge = data?.badge_text?.trim() || FALLBACK_BADGE;
  const heading = data?.heading?.trim() || FALLBACK_HEADING;
  const subheading = data?.subheading?.trim() || FALLBACK_SUBHEADING;
  const groups = normalizeGroups(data?.groups);
  const featuredImageUrl = extractFeaturedImageUrl(data);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [visibleCards, setVisibleCards] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const cardIndex = Number(
            (entry.target as HTMLElement).dataset.cardIndex,
          );
          if (Number.isNaN(cardIndex)) return;

          setVisibleCards((previous) =>
            previous[cardIndex] ? previous : { ...previous, [cardIndex]: true },
          );
          observerInstance.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );

    cardRefs.current.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [groups.length]);

  return (
    <section className="bg-gradient-to-r from-[#68bee7] to-[#4f73f6] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[941px] text-center">
          <span className="inline-flex rounded-full bg-[#57d4eb]/85 px-6 py-2 text-sm font-medium text-[#0f172a]">
            {badge}
          </span>

          <h2 className="mt-7 text-[25px] leading-[40px] md:leading-[80px] text-black [font-family:var(--font-anton)] md:text-[52px] lg:text-[64px]">
            {heading}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#0f172a]/85 md:text-[20px]">
            {subheading}
          </p>
        </div>

        <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3">
          <article
            ref={(element) => {
              cardRefs.current[0] = element;
            }}
            data-card-index={0}
            className={`overflow-hidden rounded-2xl bg-white p-2 shadow-[0_10px_30px_rgba(16,24,40,0.12)] transition-all duration-700 ease-out md:col-span-2 lg:row-span-2 ${
              visibleCards[0]
                ? "translate-x-0 opacity-100"
                : "translate-x-16 opacity-0"
            }`}
          >
            {featuredImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featuredImageUrl}
                alt="Technical issue preview"
                className="h-full min-h-[250px] w-full rounded-xl object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full min-h-[250px] items-center justify-center rounded-xl bg-gradient-to-br from-[#edf7ff] to-[#dcecff]">
                <p className="text-center text-[42px] leading-[0.95] text-[#4f73f6] [font-family:var(--font-anton)]">
                  Featured
                  <br />
                  Image
                </p>
              </div>
            )}
          </article>

          {groups.map((group, index) => (
            <div
              key={`${group.id}-description`}
              ref={(element) => {
                cardRefs.current[index + 1] = element;
              }}
              data-card-index={index + 1}
              className={`${DESC_LAYOUT[index] ?? ""} transition-all duration-700 ease-out ${
                visibleCards[index + 1]
                  ? "translate-x-0 opacity-100"
                  : "translate-x-16 opacity-0"
              }`}
              style={{ transitionDelay: `${(index + 1) * 90}ms` }}
            >
              <DescriptionCard
                title={group.descriptionTitle}
                description={group.descriptionText}
              />
            </div>
          ))}

          {groups.map((group, index) => (
            <div
              key={`${group.id}-stat`}
              ref={(element) => {
                cardRefs.current[index + groups.length + 1] = element;
              }}
              data-card-index={index + groups.length + 1}
              className={`${STAT_LAYOUT[index] ?? ""} transition-all duration-700 ease-out ${
                visibleCards[index + groups.length + 1]
                  ? "translate-x-0 opacity-100"
                  : "translate-x-16 opacity-0"
              }`}
              style={{
                transitionDelay: `${(index + groups.length + 1) * 90}ms`,
              }}
            >
              <StatisticCard
                value={group.statValue}
                caption={group.statCaption}
                shouldAnimate={Boolean(visibleCards[index + groups.length + 1])}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
