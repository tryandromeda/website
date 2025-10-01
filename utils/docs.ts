import { extname, join } from "@std/path";

export interface DocMeta {
  title: string;
  description?: string;
  section: string;
  order: number;
  id: string;
  path: string;
  icon?: string;
  hidden?: boolean;
}

export interface DocSection {
  name: string;
  icon?: string;
  children: DocMeta[];
  order: number;
}

export interface FrontmatterMeta {
  title?: string;
  description?: string;
  section?: string;
  order?: number;
  id?: string;
  icon?: string;
  hidden?: boolean;
  [key: string]: unknown;
}

/**
 * Parse frontmatter from markdown content
 */
export function parseFrontmatter(
  content: string,
): { meta: FrontmatterMeta; content: string; } {
  // Handle both Unix (\n) and Windows (\r\n) line endings
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { meta: {}, content };
  }

  const frontmatterText = match[1];
  const markdownContent = match[2];

  // Simple YAML parser for basic frontmatter
  const meta: FrontmatterMeta = {};
  const lines = frontmatterText.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();

    // Remove quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Convert numbers and booleans
    if (value === "true") {
      meta[key] = true;
    } else if (value === "false") {
      meta[key] = false;
    } else if (!isNaN(Number(value)) && value !== "") {
      meta[key] = Number(value);
    } else {
      meta[key] = value;
    }
  }

  return { meta, content: markdownContent };
}

/**
 * Recursively scan directory for markdown files and extract metadata
 */
async function scanDocsDirectory(
  dirPath: string,
  basePath = "",
): Promise<DocMeta[]> {
  const docs: DocMeta[] = [];

  try {
    for await (const entry of Deno.readDir(dirPath)) {
      const fullPath = join(dirPath, entry.name);
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

      if (entry.isDirectory) {
        // Recursively scan subdirectories
        const subDocs = await scanDocsDirectory(fullPath, relativePath);
        docs.push(...subDocs);
      } else if (entry.isFile && extname(entry.name) === ".md") {
        try {
          const content = await Deno.readTextFile(fullPath);
          const { meta } = parseFrontmatter(content);

          // Skip files marked as hidden
          if (meta.hidden) continue;

          // Extract filename without extension for default ID
          const filename = entry.name.replace(".md", "");
          const isIndex = filename === "index";

          // Generate path - for index files, use the directory path
          let docPath;
          if (isIndex) {
            docPath = basePath ? `/docs/${basePath}` : "/docs/index";
          } else {
            docPath = basePath ?
              `/docs/${basePath}/${filename}` :
              `/docs/${filename}`;
          }

          // Create doc metadata with defaults
          const doc: DocMeta = {
            title: meta.title || extractTitleFromContent(content),
            description: meta.description,
            section: meta.section || "Other",
            order: meta.order || 999,
            id: meta.id || filename,
            path: docPath,
            icon: meta.icon,
            hidden: meta.hidden || false,
          };

          docs.push(doc);
        } catch (error) {
          console.warn(`Failed to process ${fullPath}:`, error);
        }
      }
    }
  } catch (error) {
    console.warn(`Failed to scan directory ${dirPath}:`, error);
  }

  return docs;
}

/**
 * Extract title from markdown content (fallback)
 */
function extractTitleFromContent(content: string): string {
  // Remove frontmatter first
  const { content: markdownContent } = parseFrontmatter(content);

  // Look for first h1 heading
  const h1Match = markdownContent.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }

  return "Untitled";
}

/**
 * Build table of contents from markdown files
 */
export async function buildTableOfContents(): Promise<DocSection[]> {
  const docsPath = "static/content/docs";
  const allDocs = await scanDocsDirectory(docsPath);

  // Group by section
  const sectionMap = new Map<string, DocMeta[]>();

  for (const doc of allDocs) {
    if (!sectionMap.has(doc.section)) {
      sectionMap.set(doc.section, []);
    }
    sectionMap.get(doc.section)!.push(doc);
  }

  // Define section order and icons
  const sectionConfig: Record<string, { order: number; icon: string; }> = {
    "Getting Started": { order: 1, icon: "🚀" },
    "API Reference": { order: 2, icon: "⚡" },
    "Examples": { order: 3, icon: "📝" },
    "Development": { order: 4, icon: "🔧" },
    "Help & Support": { order: 5, icon: "🆘" },
    "Other": { order: 999, icon: "📄" },
  };

  // Build sections
  const sections: DocSection[] = [];

  for (const [sectionName, docs] of sectionMap) {
    const config = sectionConfig[sectionName] || sectionConfig["Other"];

    // Sort docs within section by order, then by title
    docs.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.title.localeCompare(b.title);
    });

    sections.push({
      name: sectionName,
      icon: config.icon,
      children: docs,
      order: config.order,
    });
  }

  // Sort sections by order
  sections.sort((a, b) => a.order - b.order);

  return sections;
}

/**
 * Cache for table of contents to avoid rebuilding on every request
 */
let tocCache: DocSection[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 10000; // 10 seconds in development

export async function getTableOfContents(): Promise<DocSection[]> {
  const now = Date.now();

  if (!tocCache || (now - lastCacheTime) > CACHE_DURATION) {
    tocCache = await buildTableOfContents();
    lastCacheTime = now;
  }

  return tocCache;
}

/**
 * Clear the TOC cache (useful for development)
 */
export function clearTocCache(): void {
  tocCache = null;
  lastCacheTime = 0;
}
