"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { LogoItem, WorkWithWebsiteData } from "@/types/strapi";

interface WorkWithWebsiteProps {
  data: WorkWithWebsiteData | null;
}

const FALLBACK_NAMES = [
  "Weebly",
  "Drupal",
  "Webflow",
  "Squarespace",
  "Shopify",
  "Joomla!",
  "Wix",
  "WordPress",
];

function extractLogoMedia(
  item: LogoItem,
): { url: string; width: number; height: number } | null {
  if (!item.logo) return null;

  if (item.logo.url) {
    return {
      url: item.logo.url,
      width: item.logo.width || 180,
      height: item.logo.height || 60,
    };
  }

  const nested = item.logo as unknown as {
    data?: {
      url?: string;
      width?: number;
      height?: number;
      attributes?: { url?: string; width?: number; height?: number };
    };
  };

  const nestedUrl = nested.data?.url ?? nested.data?.attributes?.url;
  if (!nestedUrl) return null;

  return {
    url: nestedUrl,
    width: nested.data?.width ?? nested.data?.attributes?.width ?? 180,
    height: nested.data?.height ?? nested.data?.attributes?.height ?? 60,
  };
}

export default function WorkWithWebsite({ data }: WorkWithWebsiteProps) {
  const heading = data?.heading?.trim() || "Works With Any Website";
  const items = data?.logo_items ?? [];
  const hasContent = items.length > 0;
  const itemsRef = useRef<HTMLDivElement | null>(null);
  const [hasItemsEntered, setHasItemsEntered] = useState(false);

  useEffect(() => {
    const target = itemsRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasItemsEntered(true);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white pb-14 pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[20px] font-medium leading-tight text-black md:text-[20px]">
          {heading}
        </h2>

        <div
          ref={itemsRef}
          className="mt-10 flex flex-nowrap items-center justify-center gap-6 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-8 lg:gap-10"
        >
          {hasContent
            ? items.map((item, index) => {
                const logo = extractLogoMedia(item);

                if (!logo) {
                  return (
                    <span
                      key={item.id}
                      className={`shrink-0 text-center text-[20px] font-medium leading-[100%] tracking-[0] text-black/80 [font-family:var(--font-inter)] transition-all duration-700 ease-out ${
                        hasItemsEntered
                          ? "translate-y-0 opacity-100"
                          : "translate-y-10 opacity-0"
                      }`}
                      style={{ transitionDelay: `${index * 90}ms` }}
                    >
                      {item.name}
                    </span>
                  );
                }

                const img = (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getStrapiImageUrl(logo.url)}
                    alt={item.name}
                    width={logo.width}
                    height={logo.height}
                    className="h-8 w-auto max-w-[130px] shrink-0 object-contain md:h-[34px] md:max-w-[150px]"
                    loading="lazy"
                  />
                );

                return item.url ? (
                  <Link
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`shrink-0 transition-all duration-700 ease-out hover:opacity-80 ${
                      hasItemsEntered
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 90}ms` }}
                    aria-label={item.name}
                  >
                    {img}
                  </Link>
                ) : (
                  <div
                    key={item.id}
                    className={`shrink-0 transition-all duration-700 ease-out ${
                      hasItemsEntered
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 90}ms` }}
                  >
                    {img}
                  </div>
                );
              })
            : FALLBACK_NAMES.map((name, index) => (
                <span
                  key={name}
                  className={`shrink-0 text-center text-[20px] font-medium leading-[100%] tracking-[0] text-black/75 [font-family:var(--font-inter)] transition-all duration-700 ease-out ${
                    hasItemsEntered
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  {name}
                </span>
              ))}
        </div>
      </div>
    </section>
  );
}
