export interface MetaConfig {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  image: string;
  keywords: string;
  twitterHandle?: string;
}

/**
 * Default site configuration
 */
export const defaultSiteConfig: SiteConfig = {
  name: "Andromeda",
  description: "Andromeda - Rust-powered JavaScript and TypeScript runtime",
  url: "https://tryandromeda.dev",
  image: "/images/cover.png",
  keywords: "Andromeda, Rust, JavaScript, TypeScript, runtime",
  twitterHandle: "@1oad1n9",
};

/**
 * Generate full page title
 */
export function generateTitle(
  pageTitle?: string,
  siteName = defaultSiteConfig.name,
): string {
  if (!pageTitle || pageTitle === siteName) return siteName;
  return `${pageTitle} | ${siteName}`;
}

/**
 * Generate full URL for a given path
 */
export function generateUrl(
  path: string,
  baseUrl = defaultSiteConfig.url,
): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Generate full image URL
 */
export function generateImageUrl(
  imagePath: string,
  baseUrl = defaultSiteConfig.url,
): string {
  if (imagePath.startsWith("http")) return imagePath;
  return generateUrl(imagePath, baseUrl);
}

/**
 * Create meta config for the home page
 */
export function createHomePageMeta(): MetaConfig {
  return {
    title: defaultSiteConfig.name,
    description: defaultSiteConfig.description,
    url: defaultSiteConfig.url,
    image: defaultSiteConfig.image,
    type: "website",
    keywords: defaultSiteConfig.keywords,
  };
}

/**
 * Create meta config for blog posts
 */
export function createBlogPostMeta(
  title: string,
  excerpt: string,
  slug: string,
  coverImage?: string,
  publishedTime?: string,
  tags?: string[],
): MetaConfig {
  return {
    title,
    description: excerpt,
    url: generateUrl(`/blog/${slug}`),
    image: coverImage || defaultSiteConfig.image,
    type: "article",
    publishedTime,
    tags,
    section: "Blog",
  };
}

/**
 * Create meta config for documentation pages
 */
export function createDocsMeta(
  title: string,
  description: string,
  path: string,
): MetaConfig {
  return {
    title,
    description,
    url: generateUrl(`/docs/${path}`),
    image: defaultSiteConfig.image,
    type: "website",
    keywords: `${defaultSiteConfig.keywords}, documentation, ${title}`,
  };
}

/**
 * Create meta config for general pages
 */
export function createPageMeta(
  title: string,
  description: string,
  path: string,
  image?: string,
): MetaConfig {
  return {
    title,
    description,
    url: generateUrl(path),
    image: image || defaultSiteConfig.image,
    type: "website",
  };
}

/**
 * Extract a plain text excerpt from markdown content.
 */
export function extractExcerpt(
  content: string,
  maxLength = 160,
): string {
  const cleaned = content
    .replace(/[#*`]/g, "") // Remove markdown symbols
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  if (cleaned.length <= maxLength) return cleaned;

  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0
    ? `${truncated.substring(0, lastSpace)}...`
    : `${truncated}...`;
}
