import type { FeatureData } from "@/types/strapi";

interface FeaturesProps {
  data: FeatureData[];
}

export default function Features({ data }: FeaturesProps) {
  if (!data?.length) return null;

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Platform Features
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((feature) => (
            <article
              key={feature.id}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {feature.title || "Feature"}
              </h3>
              {feature.description && (
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
