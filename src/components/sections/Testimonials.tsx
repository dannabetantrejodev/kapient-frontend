import type { TestimonialData } from "@/types/strapi";
import { getStrapiImageUrl } from "@/lib/strapi";

interface TestimonialsProps {
  data: TestimonialData[];
}

function StarRating({ rating }: { rating: number | null | undefined }) {
  const stars = Math.max(0, Math.min(5, rating ?? 5));

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className={`h-4 w-4 ${index < stars ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function getAuthorName(testimonial: TestimonialData): string {
  return (
    testimonial.author_name?.trim() ||
    testimonial.name?.trim() ||
    "Anonymous"
  );
}

export default function Testimonials({ data }: TestimonialsProps) {
  if (!data?.length) return null;

  return (
    <section className="bg-gray-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Loved by teams worldwide
          </h2>
          <p className="text-lg text-gray-500">
            Do not just take our word for it. See what customers say.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((testimonial) => {
            const avatarUrl = getStrapiImageUrl(testimonial.avatar?.url);
            const authorName = getAuthorName(testimonial);

            return (
              <article
                key={testimonial.id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <StarRating rating={testimonial.rating} />

                <blockquote className="flex-1 text-sm leading-relaxed text-gray-700">
                  "{testimonial.quote ?? ""}"
                </blockquote>

                <div className="flex items-center gap-3 border-t border-gray-100 pt-2">
                  {avatarUrl ? (
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatarUrl}
                        alt={authorName}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {authorName}
                    </p>
                    {(testimonial.role || testimonial.company) && (
                      <p className="text-xs text-gray-500">
                        {[testimonial.role, testimonial.company]
                          .filter(Boolean)
                          .join(" - ")}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
