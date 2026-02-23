"use client";

import { useEffect, useRef, useState } from "react";
import type { HowItWorksData } from "@/types/strapi";

interface HowItWorksProps {
  data: HowItWorksData | null;
}

const FALLBACK_BADGE = "How It Works";
const FALLBACK_HEADING = "Smart Monitoring. Instant Alerts. Zero Guesswork.";
const FALLBACK_SUBHEADING =
  "Kapient continuously scans your website from multiple checkpoints to detect hidden issues before they affect your customers. From performance drops to technical errors, we catch problems early and guide you step-by-step to fix them fast.";

const FALLBACK_ISSUES = [
  "Missing Inquiry Forms",
  "Poor Search Rank",
  "Pages With Errors",
  "Little Or No Online Reviews",
  "Website security vulnerabilities",
  "Expired SSL Certificates",
];

const FALLBACK_MONITORING_ITEMS = [
  "Technical SEO Monitoring",
  "Continuous Source Code Scans",
  "Error Detection and Repair",
  "Online Review Monitoring",
  "SSL Certificate Validation",
  "Email Reputation Monitoring",
];

function normalizeMonitoringItems(data: HowItWorksData | null): string[] {
  const titles =
    data?.steps
      ?.map((step) => step.title?.trim())
      .filter((title): title is string => Boolean(title)) ?? [];

  if (!titles.length) {
    return FALLBACK_MONITORING_ITEMS;
  }

  return titles.slice(0, 6);
}

export default function HowItWorks({ data }: HowItWorksProps) {
  const badge = data?.badge_text?.trim() || FALLBACK_BADGE;
  const heading = data?.heading?.trim() || FALLBACK_HEADING;
  const subheading = data?.subheading?.trim() || FALLBACK_SUBHEADING;
  const monitoringItems = normalizeMonitoringItems(data);
  const subheadingRef = useRef<HTMLParagraphElement | null>(null);
  const desktopGridRef = useRef<HTMLDivElement | null>(null);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [hasDesktopGridFadedIn, setHasDesktopGridFadedIn] = useState(false);

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
    }, 14);

    return () => window.clearInterval(timer);
  }, [hasStartedTyping, subheading]);

  useEffect(() => {
    const target = desktopGridRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasDesktopGridFadedIn(true);
        observer.disconnect();
      },
      { threshold: 1 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  const animatedSubheading = hasStartedTyping
    ? subheading.slice(0, typedLength)
    : "";

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full bg-[#63F6FF] px-6 py-2 text-sm font-medium text-[#0f172a]">
            {badge}
          </span>

          <h2 className="mx-auto mt-7 max-w-4xl text-[25px] leading-[0.95] text-black [font-family:var(--font-anton)] lg:text-[64px] md:text-[52px]">
            {heading}
          </h2>

          <p
            ref={subheadingRef}
            className={`mx-auto mt-7 max-w-[839px] text-base leading-relaxed text-black/85 transition-opacity duration-500 md:text-[20px] ${
              hasStartedTyping ? "opacity-100" : "opacity-0"
            }`}
          >
            {animatedSubheading}
          </p>
        </div>

        <div className="mt-14 space-y-10 lg:hidden">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {FALLBACK_ISSUES.map((issue) => (
              <span
                key={issue}
                className="inline-flex rounded-full bg-[#5edce9] px-4 py-2 text-sm font-medium text-[#0f172a]"
              >
                {issue}
              </span>
            ))}
          </div>

          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[22px] bg-[#4f73f6] shadow-[0_16px_30px_rgba(79,115,246,0.3)]">
            <span className="text-3xl text-white [font-family:var(--font-anton)]">
              Kapient
            </span>
          </div>

          <div className="mx-auto max-w-md space-y-3">
            {monitoringItems.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex items-center rounded-full bg-[#5edce9] px-4 py-2 text-sm text-[#0f172a]"
              >
                <span className="mr-3 inline-flex h-4 w-4 items-center justify-center rounded-full border-[3px] border-[#53cde7] bg-[#6280f3]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d9f8ff]" />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-20 hidden lg:block">
          <div
            ref={desktopGridRef}
            className={`grid grid-cols-[1.2fr_auto_1.2fr] items-center gap-10 transition-opacity duration-700 ease-out ${
              hasDesktopGridFadedIn ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 pr-4">
              <span className="inline-flex w-full -rotate-[8deg] items-center justify-center rounded-full bg-[#5edce9] px-4 py-2 text-center text-base leading-tight text-[#0f172a]">
                {FALLBACK_ISSUES[0]}
              </span>
              <span className="inline-flex w-full items-center justify-center rounded-full bg-[#5edce9] px-4 py-2 text-center text-base leading-tight text-[#0f172a]">
                {FALLBACK_ISSUES[1]}
              </span>
              <span className="inline-flex w-full items-center justify-center rounded-full bg-[#5edce9] px-4 py-2 text-center text-base leading-tight text-[#0f172a]">
                {FALLBACK_ISSUES[2]}
              </span>
              <span className="inline-flex w-full -rotate-[6deg] items-center justify-center rounded-full bg-[#5edce9] px-4 py-2 text-center text-base leading-tight text-[#0f172a]">
                {FALLBACK_ISSUES[3]}
              </span>
              <span className="inline-flex w-full -rotate-[8deg] items-center justify-center rounded-full bg-[#5edce9] px-4 py-2 text-center text-base leading-tight text-[#0f172a]">
                {FALLBACK_ISSUES[4]}
              </span>
              <span className="inline-flex w-full -rotate-[6deg] items-center justify-center rounded-full bg-[#5edce9] px-4 py-2 text-center text-base leading-tight text-[#0f172a]">
                {FALLBACK_ISSUES[5]}
              </span>
            </div>

            <div className="relative">
              <div className="relative z-10 flex h-44 w-44 items-center justify-center rounded-[30px] bg-[#4f73f6] shadow-[0_20px_35px_rgba(79,115,246,0.35)]">
                <span className="text-[46px] leading-none text-white [font-family:var(--font-anton)]">
                  Kapient
                </span>
              </div>
              <div className="absolute left-full top-1/2 h-0 w-20 -translate-y-1/2 border-t border-dashed border-[#7a7a7a]" />
            </div>

            <div className="relative pl-20">
              <div className="absolute left-8 top-[14px] bottom-[14px] border-l border-dashed border-[#7a7a7a]" />

              <div className="space-y-7">
                {monitoringItems.map((item, index) => (
                  <div key={`${item}-${index}`} className="relative">
                    <div className="absolute -left-12 top-1/2 w-12 -translate-y-1/2 border-t border-dashed border-[#7a7a7a]" />
                    <span className="inline-flex items-center rounded-full bg-[#5edce9] px-5 py-2 text-lg text-[#0f172a]">
                      <span className="mr-3 inline-flex h-4 w-4 items-center justify-center rounded-full border-[3px] border-[#53cde7] bg-[#6280f3]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#d9f8ff]" />
                      </span>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
