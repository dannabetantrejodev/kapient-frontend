import type {
  BusinessImpactData,
  ConversionPanelData,
  FeatureData,
  FooterData,
  HeroData,
  HowItWorksData,
  LandingFaqData,
  LogoItem,
  NavbarData,
  PainPointsData,
  PricingPlanData,
  ResourcesData,
  StatsGridData,
  StrapiResponse,
  TestimonialData,
  WorkWithWebsiteData,
} from "@/types/strapi";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface UploadFile {
  id: number;
  name: string;
  url: string;
  alternativeText: string | null;
  width: number | null;
  height: number | null;
}

const WORK_WITH_WEBSITE_LOGO_ORDER: Array<{ key: string; label: string }> = [
  { key: "weebly", label: "Weebly" },
  { key: "drupal", label: "Drupal" },
  { key: "webflow", label: "Webflow" },
  { key: "squarespace", label: "Squarespace" },
  { key: "shopify", label: "Shopify" },
  { key: "joomla", label: "Joomla!" },
  { key: "wix", label: "Wix" },
  { key: "wordpress", label: "WordPress" },
];

async function fetchStrapi<T>(
  endpoint: string,
  revalidate = 60,
  options: { allowNotFound?: boolean } = {},
): Promise<T | null> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
  }

  try {
    const url = new URL(`/api/${endpoint}`, STRAPI_URL);
    const hasPopulateParam = Array.from(url.searchParams.keys()).some(
      (key) => key === "populate" || key.startsWith("populate["),
    );

    if (!hasPopulateParam) {
      url.searchParams.set("populate", "*");
    }

    const response = await fetch(url.toString(), {
      headers,
      next: { revalidate },
    });

    if (!response.ok) {
      if (response.status === 404 && options.allowNotFound) {
        return null;
      }

      console.error(
        `Strapi fetch error [${endpoint}]:`,
        response.status,
        response.statusText,
      );
      return null;
    }

    const json = await response.json();
    return json as T;
  } catch (error) {
    console.error(`Strapi network error [${endpoint}]:`, error);
    return null;
  }
}

export async function getNavbar(): Promise<NavbarData | null> {
  const response = await fetchStrapi<StrapiResponse<NavbarData>>("navbar");
  return response?.data ?? null;
}

export async function getHero(): Promise<HeroData | null> {
  const response = await fetchStrapi<StrapiResponse<HeroData>>("hero");
  return response?.data ?? null;
}

export async function getFeatures(): Promise<FeatureData[]> {
  const response = await fetchStrapi<StrapiResponse<FeatureData[]>>(
    "features?sort=order:asc",
  );
  return response?.data ?? [];
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  const response = await fetchStrapi<StrapiResponse<TestimonialData[]>>(
    "testimonials",
  );
  return response?.data ?? [];
}

export async function getPricingPlans(): Promise<PricingPlanData[]> {
  const response = await fetchStrapi<StrapiResponse<PricingPlanData[]>>(
    "pricing-plans",
  );
  return response?.data ?? [];
}

export async function getFooter(): Promise<FooterData | null> {
  const response = await fetchStrapi<StrapiResponse<FooterData>>("footer", 60, {
    allowNotFound: true,
  });
  return response?.data ?? null;
}

export async function getWorkWithWebsite(): Promise<WorkWithWebsiteData | null> {
  const response = await fetchStrapi<StrapiResponse<WorkWithWebsiteData>>(
    "work-with-website?populate[logo_items][populate]=logo",
    60,
    { allowNotFound: true },
  );
  const apiData = response?.data ?? null;

  if (
    apiData?.logo_items?.length &&
    hasWorkWithWebsiteLogoMedia(apiData.logo_items)
  ) {
    return apiData;
  }

  const files = await fetchStrapi<UploadFile[]>("upload/files", 60, {
    allowNotFound: true,
  });
  const fallback = buildWorkWithWebsiteFromUploads(files ?? []);

  if (apiData) {
    return {
      ...apiData,
      heading: apiData.heading ?? fallback?.heading ?? "Works With Any Website",
      logo_items:
        apiData.logo_items?.length && hasWorkWithWebsiteLogoMedia(apiData.logo_items)
          ? apiData.logo_items
          : (fallback?.logo_items ?? []),
    };
  }

  return fallback;
}

export async function getPainPoints(): Promise<PainPointsData | null> {
  const response = await fetchStrapi<StrapiResponse<PainPointsData>>(
    "pain-point?populate[cards][populate]=image",
    60,
    { allowNotFound: true },
  );

  return response?.data ?? null;
}

function hasWorkWithWebsiteLogoMedia(items: LogoItem[]): boolean {
  return items.some((item) => {
    if (item.logo?.url) {
      return true;
    }

    const nested = item.logo as unknown as {
      data?: { url?: string; attributes?: { url?: string } };
    };

    return Boolean(nested?.data?.url ?? nested?.data?.attributes?.url);
  });
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function buildWorkWithWebsiteFromUploads(
  files: UploadFile[],
): WorkWithWebsiteData | null {
  if (!files.length) return null;

  const logos = WORK_WITH_WEBSITE_LOGO_ORDER.map<LogoItem | null>(
    ({ key, label }) => {
      const match = files.find((file) => normalizeKey(file.name).includes(key));
      if (!match) return null;

      return {
        id: match.id,
        name: label,
        url: null,
        logo: {
          id: match.id,
          url: match.url,
          alternativeText: match.alternativeText,
          width: match.width ?? 180,
          height: match.height ?? 60,
        },
      };
    },
  ).filter((item): item is LogoItem => item !== null);

  if (!logos.length) return null;

  return {
    id: 0,
    heading: "Works With Any Website",
    logo_items: logos,
  };
}

export async function getBusinessImpact(): Promise<BusinessImpactData | null> {
  const response = await fetchStrapi<StrapiResponse<BusinessImpactData>>(
    "business-impact?populate[cards][populate]=image",
    60,
    { allowNotFound: true },
  );
  return response?.data ?? null;
}

export async function getStatsGrid(): Promise<StatsGridData | null> {
  const response = await fetchStrapi<StrapiResponse<StatsGridData>>(
    "stats-grid",
    60,
    { allowNotFound: true },
  );
  return response?.data ?? null;
}

export async function getHowItWorks(): Promise<HowItWorksData | null> {
  const response = await fetchStrapi<StrapiResponse<HowItWorksData>>(
    "how-it-works",
    60,
    { allowNotFound: true },
  );
  return response?.data ?? null;
}

export async function getResources(): Promise<ResourcesData | null> {
  const response = await fetchStrapi<StrapiResponse<ResourcesData>>(
    "resources?populate[cards][populate]=image",
    60,
    { allowNotFound: true },
  );
  return response?.data ?? null;
}

export async function getLandingFaq(): Promise<LandingFaqData | null> {
  const response = await fetchStrapi<StrapiResponse<LandingFaqData>>(
    "landing-faq",
    60,
    { allowNotFound: true },
  );
  return response?.data ?? null;
}

export async function getConversionPanel(): Promise<ConversionPanelData | null> {
  const response = await fetchStrapi<StrapiResponse<ConversionPanelData>>(
    "conversion-panel",
    60,
    { allowNotFound: true },
  );
  return response?.data ?? null;
}

export function getStrapiImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  const normalized = url.trim();
  if (!normalized || normalized === "#" || normalized === "/#") {
    return "";
  }

  if (normalized.startsWith("http")) {
    return normalized;
  }

  return `${STRAPI_URL}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
}
