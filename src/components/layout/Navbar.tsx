"use client";

import { useState } from "react";
import Link from "next/link";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { NavbarData } from "@/types/strapi";

interface NavbarProps {
  data: NavbarData | null;
}

function extractLogoMediaUrl(logo: NavbarData["logo"]): string {
  if (!logo) return "";

  if (typeof logo.url === "string" && logo.url.length > 0) {
    return logo.url;
  }

  // Supports both flattened (Strapi v5) and nested (Strapi v4-like) payload shapes.
  const nestedLogo = logo as unknown as {
    data?: { url?: string; attributes?: { url?: string } };
  };

  return nestedLogo.data?.url ?? nestedLogo.data?.attributes?.url ?? "";
}

export default function Navbar({ data }: NavbarProps) {
  const fallback: NavbarData = {
    id: 0,
    logo_text: "Kapinet",
    logo: null,
    logo_url: null,
    nav_links: [],
    primary_cta_label: "Signup",
    primary_cta_url: "#",
    secondary_cta_label: "Login",
    secondary_cta_url: "#",
  };

  const nav = data ?? fallback;
  const signupLabel = nav.primary_cta_label;
  const signupUrl = nav.primary_cta_url ?? "#";
  const loginLabel = nav.secondary_cta_label;
  const loginUrl = nav.secondary_cta_url ?? "#";
  const navLinks = nav.nav_links ?? [];
  const logoFromMedia = getStrapiImageUrl(extractLogoMediaUrl(nav.logo));
  const logoFromLegacy = getStrapiImageUrl(nav.logo_url);
  const logoImageUrl = logoFromMedia || logoFromLegacy || "/next.svg";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-black/5 bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid h-20 grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <Link
            href="/"
            onClick={closeMenu}
            className="w-fit transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f6ff6] focus-visible:ring-offset-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoImageUrl}
              alt={nav.logo?.alternativeText || nav.logo_text || "Kapinet logo"}
              width={172}
              height={48}
              className="h-10 w-auto sm:h-12"
              loading="eager"
            />
          </Link>

          {navLinks.length > 0 && (
            <ul className="hidden items-center gap-10 lg:col-start-2 lg:flex">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.url}
                    target={link.open_new_tab ? "_blank" : undefined}
                    rel={link.open_new_tab ? "noopener noreferrer" : undefined}
                    className="text-[20px] font-medium tracking-[-0.01em] text-black transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f6ff6] focus-visible:ring-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-end gap-6 lg:col-start-3">
            {loginLabel && (
              <Link
                href={loginUrl}
                className="hidden text-[20px] font-medium tracking-[-0.01em] text-black transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f6ff6] focus-visible:ring-offset-2 lg:inline-flex"
              >
                {loginLabel}
              </Link>
            )}

            {signupLabel && (
              <Link
                href={signupUrl}
                className="group hidden items-center gap-4 rounded-[10px] bg-gradient-to-r from-[#4b6ff6] to-[#53d6ec] py-1.5 pl-5 pr-1.5 text-[clamp(0.95rem,0.8rem+0.45vw,1.2rem)] font-medium tracking-[-0.01em] text-[#111827] transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f6ff6] focus-visible:ring-offset-2 lg:inline-flex"
              >
                <span>{signupLabel}</span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#f4f8fb] text-[#4b6ff6] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
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
            )}

            <button
              type="button"
              onClick={() => setIsMenuOpen((previous) => !previous)}
              className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="tablet-mobile-menu"
            >
              {isMenuOpen ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div
        id="tablet-mobile-menu"
        className={`overflow-hidden border-t border-black/10 bg-white transition-[max-height,opacity] duration-300 lg:hidden ${
          isMenuOpen
            ? "max-h-[80vh] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          {navLinks.length > 0 && (
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={`mobile-${link.id}`}>
                  <Link
                    href={link.url}
                    target={link.open_new_tab ? "_blank" : undefined}
                    rel={link.open_new_tab ? "noopener noreferrer" : undefined}
                    onClick={closeMenu}
                    className="block rounded-md px-3 py-2 text-[18px] font-medium text-black transition-colors hover:bg-black/5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {(loginLabel || signupLabel) && (
            <div className="mt-4 flex flex-col gap-3 border-t border-black/10 pt-4">
              {loginLabel && (
                <Link
                  href={loginUrl}
                  onClick={closeMenu}
                  className="inline-flex w-full items-center justify-center rounded-[10px] border border-black/15 px-4 py-2.5 text-[18px] font-medium text-black transition-colors hover:bg-black/5"
                >
                  {loginLabel}
                </Link>
              )}

              {signupLabel && (
                <Link
                  href={signupUrl}
                  onClick={closeMenu}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-[10px] bg-gradient-to-r from-[#4b6ff6] to-[#53d6ec] py-2.5 pl-5 pr-3 text-[18px] font-medium text-[#111827] transition-opacity hover:opacity-95"
                >
                  <span>{signupLabel}</span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#f4f8fb] text-[#4b6ff6] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <svg
                      className="h-4 w-4"
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
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
