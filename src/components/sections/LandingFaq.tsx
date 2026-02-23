"use client";

import { useEffect, useRef, useState } from "react";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { LandingFaqData } from "@/types/strapi";

interface LandingFaqProps {
  data: LandingFaqData | null;
}

const FALLBACK_BADGE = "Real Business Impact";
const FALLBACK_HEADING = "Small Errors. Big Business consequences.";
const FALLBACK_SUBHEADING =
  "Many website problems are silent. You may not even know they exist until your sales start dropping.";

const FALLBACK_FAQS = [
  {
    id: "faq-1",
    question: "Your SEO Determines Business Success",
    answer:
      "Less than 1% of users ever click on a page-2 search result. Poor technical SEO can quietly erase most of your website's traffic.",
  },
  {
    id: "faq-2",
    question: "A Slow Website Can Tank Your Sales",
    answer:
      "Even a one-second slowdown can reduce conversions and increase bounce rates, especially on mobile traffic.",
  },
  {
    id: "faq-3",
    question: "Broken Forms Mean Lost Leads",
    answer:
      "If contact forms fail silently, qualified prospects never reach your team and revenue opportunities disappear.",
  },
];

function getFeaturedImageUrl(data: LandingFaqData | null): string | null {
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

export default function LandingFaq({ data }: LandingFaqProps) {
  const badge = data?.badge_text?.trim() || FALLBACK_BADGE;
  const heading = data?.heading?.trim() || FALLBACK_HEADING;
  const subheading = data?.subheading?.trim() || FALLBACK_SUBHEADING;
  const faqs = data?.faqs?.length ? data.faqs : FALLBACK_FAQS;
  const featuredImageUrl = getFeaturedImageUrl(data);

  const [openIndex, setOpenIndex] = useState(0);
  const safeOpenIndex = openIndex < faqs.length ? openIndex : 0;
  const imageCardRef = useRef<HTMLElement | null>(null);
  const faqListRef = useRef<HTMLDivElement | null>(null);
  const [hasImageEntered, setHasImageEntered] = useState(false);
  const [hasFaqEntered, setHasFaqEntered] = useState(false);

  useEffect(() => {
    const imageTarget = imageCardRef.current;
    if (!imageTarget) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasImageEntered(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(imageTarget);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const faqTarget = faqListRef.current;
    if (!faqTarget) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasFaqEntered(true);
        observer.disconnect();
      },
      { threshold: 0.18 },
    );

    observer.observe(faqTarget);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full bg-[#63F6FF] px-6 py-2 text-sm font-medium text-[#0f172a]">
            {badge}
          </span>

          <h2 className="mx-auto mt-7 max-w-4xl text-[25px] md:text-[52px] leading-[0.95] text-black [font-family:var(--font-anton)] lg:text-[64px]">
            {heading}
          </h2>

          <p className="mx-auto mt-6 max-w-[612px] text-base leading-relaxed text-black/80 md:text-[20px]">
            {subheading}
          </p>
        </div>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-2">
          <article
            ref={imageCardRef}
            className={`rounded-[40px] bg-gradient-to-b from-[#edf1fb] to-[#5678ef] p-6 transition-all duration-700 ease-out md:p-8 ${
              hasImageEntered
                ? "translate-y-0 opacity-100"
                : "translate-y-14 opacity-0"
            }`}
          >
            {featuredImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featuredImageUrl}
                alt="FAQ visual"
                className="h-[320px] w-full rounded-[34px] bg-white object-cover md:h-[420px]"
                loading="lazy"
              />
            ) : (
              <div className="flex h-[320px] w-full items-center justify-center rounded-[34px] bg-white md:h-[420px]">
                <span className="text-[180px] leading-none text-[#6485f4] [font-family:var(--font-anton)]">
                  ?
                </span>
              </div>
            )}
          </article>

          <div ref={faqListRef} className="space-y-0">
            {faqs.map((faq, index) => {
              const isOpen = safeOpenIndex === index;
              const number = String(index + 1).padStart(2, "0");

              return (
                <div
                  key={faq.id ?? index}
                  className={`relative transition-all duration-700 ease-out ${
                    hasFaqEntered
                      ? "translate-x-0 opacity-100"
                      : "translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    className={`w-full cursor-pointer overflow-hidden rounded-[22px] text-left transition-[background,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen
                        ? "rounded-[22px] bg-gradient-to-r from-[#8ca8ff] to-[#5f7eef] px-6 py-6 shadow-[0_12px_26px_rgba(95,126,239,0.25)]"
                        : "border-b border-black/20 px-6 py-6 hover:bg-black/[0.02]"
                    }`}
                    aria-expanded={isOpen}
                  >
                    <div className="grid grid-cols-[auto_1fr_auto] items-start gap-x-5">
                      <span className="text-[18px] leading-[0.95] text-black [font-family:var(--font-anton)] md:text-[24px]">
                        {number}
                      </span>

                      <div className="min-w-0">
                        <h3 className="text-[18px] leading-[0.95] text-black [font-family:var(--font-anton)] md:text-[24px]">
                          {faq.question}
                        </h3>

                        <div
                          className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin-top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isOpen
                              ? "mt-4 grid-rows-[1fr] opacity-100"
                              : "mt-0 grid-rows-[0fr] opacity-0"
                          }`}
                          aria-hidden={!isOpen}
                        >
                          <div className="overflow-hidden">
                            <p className="max-w-xl text-base leading-relaxed text-black/85 md:text-[18px]">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isOpen
                            ? "border-white/40 bg-white/20"
                            : "border-black/20 bg-transparent"
                        }`}
                      >
                        <svg
                          className={`h-4 w-4 text-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isOpen ? "rotate-180" : "rotate-0"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.2}
                            d="M6 9l6 6 6-6"
                          />
                        </svg>
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
