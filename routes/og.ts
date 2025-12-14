// routes/og.ts - Dynamic OG image generator
import { FreshContext } from "fresh";

export async function handler(
  ctx: FreshContext,
): Promise<Response> {
  try {
    // Get title from query parameter
    const url = new URL(ctx.req.url);
    const title = url.searchParams.get("title") || "";

    // Read the cover.svg template
    const coverPath = `${Deno.cwd()}/static/images/cover.svg`;
    let svgContent = await Deno.readTextFile(coverPath);

    // Replace [[INSERT TITLE]] with the actual title (or empty string for homepage)
    svgContent = svgContent.replace("[[INSERT TITLE]]", title);

    // Return the SVG with proper headers
    return new Response(svgContent, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Fallback to original cover.svg if something goes wrong
    try {
      const coverPath = `${Deno.cwd()}/static/images/cover.svg`;
      const svgContent = await Deno.readTextFile(coverPath);
      return new Response(svgContent, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch {
      return new Response("Image not found", { status: 404 });
    }
  }
}
