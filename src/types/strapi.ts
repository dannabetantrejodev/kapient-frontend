export interface StrapiResponse<T> {
  data: T | null;
  meta?: unknown;
}

export interface StrapiMedia {
  id?: number;
  url?: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  attributes?: {
    url?: string;
    alternativeText?: string | null;
    width?: number | null;
    height?: number | null;
  };
  data?: {
    id?: number;
    url?: string;
    attributes?: {
      url?: string;
      alternativeText?: string | null;
      width?: number | null;
      height?: number | null;
    };
  };
}

export interface NavbarLink {
  id: number;
  label: string;
  url: string;
  open_new_tab?: boolean | null;
}

export interface NavbarData {
  id: number;
  logo_text: string;
  logo: StrapiMedia | null;
  logo_url?: string | null;
  nav_links: NavbarLink[];
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
  secondary_cta_label?: string | null;
  secondary_cta_url?: string | null;
}

export interface HeroData {
  id?: number;
  badge_text?: string | null;
  heading: string;
  subheading?: string | null;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
}

export interface FeatureData {
  id: number;
  title?: string | null;
  description?: string | null;
  icon_key?: string | null;
  order?: number | null;
}

export interface TestimonialData {
  id: number;
  quote?: string | null;
  rating?: number | null;
  author_name?: string | null;
  name?: string | null;
  role?: string | null;
  company?: string | null;
  avatar?: StrapiMedia | null;
}

export interface PricingPlanData {
  id: number;
  name?: string | null;
  description?: string | null;
  price?: string | number | null;
  interval?: "monthly" | "yearly" | string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  is_featured?: boolean | null;
  order?: number | null;
  features?: string[] | null;
}

export interface FooterLink {
  id: number;
  label: string;
  url: string;
}

export interface FooterData {
  id?: number;
  headline?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  quick_links?: FooterLink[] | null;
  resource_links?: FooterLink[] | null;
  service_links?: FooterLink[] | null;
  footer_links?: FooterLink[] | null;
}

export interface LogoItem {
  id: number;
  name: string;
  url?: string | null;
  logo?: StrapiMedia | null;
}

export interface WorkWithWebsiteData {
  id?: number;
  heading?: string | null;
  logo_items?: LogoItem[] | null;
}

export interface PainPointCardData {
  id: number | string;
  title?: string | null;
  description?: string | null;
  image?: StrapiMedia | null;
  icon_key?: "network" | "ranking" | "shield" | string | null;
  stat_label?: string | null;
  stat_delta?: string | null;
}

export interface PainPointsData {
  id?: number;
  badge_text?: string | null;
  heading?: string | null;
  subheading?: string | null;
  cards?: PainPointCardData[] | null;
}

export interface ImpactCardData {
  id: number | string;
  icon_key?: string | null;
  stat?: string | null;
  label?: string | null;
  description?: string | null;
  image?: StrapiMedia | null;
  image_position?: "left" | "right" | string | null;
}

export interface BusinessImpactData {
  id?: number;
  heading?: string | null;
  subheading?: string | null;
  cards?: ImpactCardData[] | null;
}

export interface StatsCardGroupData {
  id: number | string;
  description_title?: string | null;
  description_text?: string | null;
  stat_value?: string | null;
  stat_caption?: string | null;
}

export interface StatsGridData {
  id?: number;
  badge_text?: string | null;
  heading?: string | null;
  subheading?: string | null;
  featured_image?: StrapiMedia | null;
  groups?: StatsCardGroupData[] | null;
}

export interface HowItWorksStepData {
  id?: number | string;
  title?: string | null;
  description?: string | null;
}

export interface HowItWorksData {
  id?: number;
  badge_text?: string | null;
  heading?: string | null;
  subheading?: string | null;
  steps?: HowItWorksStepData[] | null;
}

export interface ResourceCardData {
  id: number | string;
  category?: string | null;
  title: string;
  description?: string | null;
  link_label?: string | null;
  link_url?: string | null;
  image?: StrapiMedia | null;
  icon_key: string | null;
}

export interface ResourcesData {
  id?: number;
  heading?: string | null;
  subheading?: string | null;
  cards?: ResourceCardData[] | null;
}

export interface FaqItemData {
  id: number | string;
  question: string;
  answer: string;
}

export interface LandingFaqData {
  id?: number;
  badge_text?: string | null;
  heading?: string | null;
  subheading?: string | null;
  featured_image?: StrapiMedia | null;
  faqs?: FaqItemData[] | null;
}

export interface ConversionPanelData {
  id?: number;
  heading?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
}
