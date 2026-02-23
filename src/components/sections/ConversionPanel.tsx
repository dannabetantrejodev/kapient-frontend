import Link from "next/link";
import type { ConversionPanelData } from "@/types/strapi";

interface ConversionPanelProps {
  data: ConversionPanelData | null;
}

const FALLBACK_HEADING = "Don't Lose Another Sale to a Broken Website!";
const FALLBACK_CTA_LABEL = "Get Started";
const FALLBACK_CTA_URL = "#";

export default function ConversionPanel({ data }: ConversionPanelProps) {
  const heading = data?.heading?.trim() || FALLBACK_HEADING;
  const ctaLabel = data?.cta_label?.trim() || FALLBACK_CTA_LABEL;
  const ctaUrl = data?.cta_url?.trim() || FALLBACK_CTA_URL;

  return (
    <section className="bg-white pb-20 pt-6 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(102deg,#62ace8_0%,#5a87e9_55%,#6078df_100%)] px-6 py-16 text-center md:px-10 md:py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(73, 113, 209, 0.42) 1px, transparent 1px), linear-gradient(to bottom, rgba(73, 113, 209, 0.42) 1px, transparent 1px)",
              backgroundSize: "94px 94px",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#4f72e5]/20" />

          <div className="relative z-10 mx-auto max-w-[820px]">
            <h2 className="text-[25px] leading-[0.95] text-black [font-family:var(--font-anton)] md:text-[52px] lg:text-[64px]">
              {heading}
            </h2>

            <div className="mt-10">
              <Link
                href={ctaUrl}
                className="group inline-flex items-center gap-4 rounded-[10px] bg-white py-1 pl-7 pr-1 text-[18px] text-[#141414] shadow-[0_10px_22px_rgba(15,23,42,0.1)] transition-opacity hover:opacity-95 md:text-[18px]"
              >
                <span>{ctaLabel}</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-gradient-to-r from-[#4f73f6] to-[#5edce9] text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 17 17 7m0 0H9m8 0v8"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
