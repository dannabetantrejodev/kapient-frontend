import Link from "next/link";
import type { FooterData, FooterLink } from "@/types/strapi";

interface FooterProps {
  data: FooterData | null;
}

const FALLBACK_HEADLINE =
  "Helping your website stay fast, secure, and error-free. Never miss a sale again.";
const FALLBACK_CTA_LABEL = "Get Started";
const FALLBACK_CTA_URL = "#";

const FALLBACK_QUICK_LINKS: FooterLink[] = [
  { id: 1, label: "Home", url: "#" },
  { id: 2, label: "About", url: "#" },
  { id: 3, label: "Support", url: "#" },
  { id: 4, label: "Agency", url: "#" },
];

const FALLBACK_RESOURCE_LINKS: FooterLink[] = [
  { id: 5, label: "Blog", url: "#" },
  { id: 6, label: "Contact", url: "#" },
  { id: 7, label: "FAQs", url: "#" },
  { id: 8, label: "Terms of Service", url: "#" },
];

const FALLBACK_SERVICE_LINKS: FooterLink[] = [
  { id: 9, label: "Website Monitoring", url: "#" },
  { id: 10, label: "Error Detection & Fixing", url: "#" },
  { id: 11, label: "SEO Performance Boost", url: "#" },
  { id: 12, label: "Compatibility Check", url: "#" },
];

function withLegacyFallback(
  primary: FooterLink[] | null | undefined,
  legacy: FooterLink[] | null | undefined,
  from: number,
  to: number,
  fallback: FooterLink[],
): FooterLink[] {
  if (primary?.length) return primary;
  const legacySlice = legacy?.slice(from, to) ?? [];
  if (legacySlice.length) return legacySlice;
  return fallback;
}

export default function Footer({ data }: FooterProps) {
  const headline = data?.headline?.trim() || FALLBACK_HEADLINE;
  const ctaLabel = data?.cta_label?.trim() || FALLBACK_CTA_LABEL;
  const ctaUrl = data?.cta_url?.trim() || FALLBACK_CTA_URL;

  const quickLinks = withLegacyFallback(
    data?.quick_links,
    data?.footer_links,
    0,
    4,
    FALLBACK_QUICK_LINKS,
  );
  const resourceLinks = withLegacyFallback(
    data?.resource_links,
    data?.footer_links,
    4,
    8,
    FALLBACK_RESOURCE_LINKS,
  );
  const serviceLinks = withLegacyFallback(
    data?.service_links,
    data?.footer_links,
    8,
    12,
    FALLBACK_SERVICE_LINKS,
  );

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-12  lg:gap-10">
          <div className="max-w-[320px]">
            <h2 className="text-[18px] leading-[32px] text-black [font-family:var(--font-anton)] md:text-[24px]">
              {headline}
            </h2>

            <div className="mt-8">
              <Link
                href={ctaUrl}
                className="group inline-flex items-center gap-4 rounded-[10px] bg-gradient-to-r from-[#4f73f6] to-[#5edce9] py-1 pl-7 pr-1 text-[16px] text-[#141414] shadow-[0_10px_22px_rgba(79,115,246,0.25)] transition-opacity hover:opacity-95"
              >
                <span>{ctaLabel}</span>
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
          </div>

          <div className="grid gap-20 grid-cols-2">
            <div>
              <h3 className="text-[20px] leading-none text-black [font-family:var(--font-anton)]">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      className="text-[20px] text-black/90 hover:text-black"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[20px] leading-none text-black [font-family:var(--font-anton)] ">
                Resources
              </h3>
              <ul className="mt-4 space-y-2">
                {resourceLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      className="text-[20px] text-black/90 hover:text-black"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* <div>
              <h3 className="text-[20px] leading-none text-black [font-family:var(--font-anton)]">
                Services
              </h3>
              <ul className="mt-4 space-y-2">
                {serviceLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      className="text-[20px] text-black/90 hover:text-black"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
