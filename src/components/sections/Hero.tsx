import Link from "next/link";
import type { HeroData } from "@/types/strapi";

interface HeroProps {
  data: HeroData | null;
}

export default function Hero({ data }: HeroProps) {
  if (!data) return null;

  return (
    <section className="relative min-h-[calc(100vh-2rem)] overflow-hidden bg-white pt-20">
      <div className="mx-auto mt-25 flex  max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-[807px] flex-col items-center text-center">
          {data.badge_text && (
            <span className="mb-10 inline-flex rounded-full bg-[#63F6FF] px-8 py-2.5 text-base font-medium leading-none text-black sm:px-10">
              {data.badge_text}
            </span>
          )}

          <h1 className="text-[32px] md:text-[52px] leading-[52px] font-normal tracking-[0] text-center text-black lg:text-[64px] md:leading-[76px] [font-family:var(--font-anton)]">
            {data.heading}
          </h1>

          {data.subheading && (
            <p className="mt-8 max-w-[900px] text-[20px] leading-[1.45] text-black/90">
              {data.subheading}
            </p>
          )}

          {data.primary_cta_label && (
            <div className="mt-10">
              <Link
                href={data.primary_cta_url ?? "#"}
                className="group inline-flex items-center gap-4 rounded-[10px] bg-gradient-to-r from-[#4f73f6] to-[#5edce9] py-1 pl-7 pr-1 text-[16px] font-medium text-[#141414] shadow-[0_12px_24px_rgba(79,115,246,0.2)] transition-opacity hover:opacity-95"
              >
                <span>{data.primary_cta_label}</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#f2f7fb] text-[#4f73f6] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
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
          )}
        </div>
      </div>
    </section>
  );
}
