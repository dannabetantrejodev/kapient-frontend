"use client";

import Link from "next/link";
import { useState } from "react";
import type { PricingPlanData } from "@/types/strapi";

interface PricingProps {
  data: PricingPlanData[];
}

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function formatPrice(price: PricingPlanData["price"]): string {
  if (price === null || price === undefined || price === "") return "Custom";
  return `${price}`;
}

export default function Pricing({ data }: PricingProps) {
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");

  if (!data?.length) return null;

  const filtered = data.filter(
    (plan) => !plan.interval || plan.interval === interval,
  );
  const hasMonthly = data.some((plan) => plan.interval === "monthly");
  const hasYearly = data.some((plan) => plan.interval === "yearly");
  const showToggle = hasMonthly && hasYearly;

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-500">
            Choose the plan that works best for you. No hidden fees, cancel
            anytime.
          </p>
        </div>

        {showToggle && (
          <div className="mb-12 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${
                interval === "monthly" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Monthly
            </span>
            <button
              type="button"
              onClick={() =>
                setInterval((current) =>
                  current === "monthly" ? "yearly" : "monthly",
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                interval === "yearly" ? "bg-blue-600" : "bg-gray-200"
              }`}
              aria-label="Toggle billing interval"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  interval === "yearly" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                interval === "yearly" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Yearly
              <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Save 20%
              </span>
            </span>
          </div>
        )}

        <div className="grid items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {(showToggle ? filtered : data).map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl p-8 transition-all ${
                plan.is_featured
                  ? "scale-105 bg-blue-600 text-white shadow-2xl shadow-blue-500/30"
                  : "border border-gray-200 bg-white shadow-sm hover:shadow-md"
              }`}
            >
              {plan.is_featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-amber-400 px-4 py-1 text-xs font-bold uppercase tracking-wide text-amber-900">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`mb-2 text-xl font-bold ${
                    plan.is_featured ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                {plan.description && (
                  <p
                    className={`text-sm ${
                      plan.is_featured ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {plan.description}
                  </p>
                )}
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span
                    className={`text-4xl font-bold ${
                      plan.is_featured ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.price === null || plan.price === undefined || plan.price === ""
                      ? formatPrice(plan.price)
                      : `$${formatPrice(plan.price)}`}
                  </span>
                  {plan.price !== null &&
                    plan.price !== undefined &&
                    plan.price !== "" &&
                    plan.interval && (
                      <span
                        className={`mb-1 text-sm ${
                          plan.is_featured ? "text-blue-200" : "text-gray-400"
                        }`}
                      >
                        /{plan.interval === "monthly" ? "mo" : "yr"}
                      </span>
                    )}
                </div>
              </div>

              {!!plan.features?.length && (
                <ul className="mb-8 flex flex-1 flex-col gap-3">
                  {plan.features.map((feature, index) => (
                    <li
                      key={`${plan.id}-${index}`}
                      className="flex items-start gap-3"
                    >
                      <span className={plan.is_featured ? "text-blue-200" : ""}>
                        <CheckIcon />
                      </span>
                      <span
                        className={`text-sm ${
                          plan.is_featured ? "text-blue-50" : "text-gray-600"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {plan.cta_label && (
                <Link
                  href={plan.cta_url ?? "#"}
                  className={`mt-auto inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-colors ${
                    plan.is_featured
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.cta_label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
