// components/Meta.tsx - Reusable meta tag component
import { Head } from "fresh/runtime";
import type { MetaConfig } from "../utils/meta.ts";
import {
  defaultSiteConfig,
  generateImageUrl,
  generateTitle,
} from "../utils/meta.ts";

interface MetaProps {
  meta: MetaConfig;
}

export default function Meta({ meta }: MetaProps) {
  const title = generateTitle(meta.title);
  const url = meta.url || defaultSiteConfig.url;
  const description = meta.description || defaultSiteConfig.description;
  const type = meta.type || "website";

  let image: string;
  if (meta.image && !meta.image.includes("cover.svg")) {
    image = generateImageUrl(meta.image);
  } else {
    const pageTitle = meta.title === defaultSiteConfig.name ? "" : meta.title;
    const encodedTitle = encodeURIComponent(pageTitle);
    image = generateImageUrl(`/og/${encodedTitle}`);
  }

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {meta.keywords && <meta name="keywords" content={meta.keywords} />}
      {meta.author && <meta name="author" content={meta.author} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={defaultSiteConfig.name} />

      {/* Article Meta Tags */}
      {type === "article" && meta.publishedTime && (
        <meta property="article:published_time" content={meta.publishedTime} />
      )}
      {type === "article" && meta.modifiedTime && (
        <meta property="article:modified_time" content={meta.modifiedTime} />
      )}
      {type === "article" && meta.section && (
        <meta property="article:section" content={meta.section} />
      )}
      {type === "article" && meta.tags &&
        meta.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {defaultSiteConfig.twitterHandle && (
        <meta name="twitter:site" content={defaultSiteConfig.twitterHandle} />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Head>
  );
}
