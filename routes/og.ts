// routes/og.ts - Dynamic OG image generator with PNG output
import { FreshContext } from "fresh";
import { Resvg } from "npm:@resvg/resvg-js";

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

    // Convert SVG to PNG using resvg
    const resvg = new Resvg(svgContent, {
      fitTo: {
        mode: "width",
        value: 1200, // Standard OG image width
      },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    // Return the PNG with proper headers
    return new Response(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Fallback to original cover.svg if something goes wrong
    try {
      const coverPath = `${Deno.cwd()}/static/images/cover.svg`;
      const svgContent = await Deno.readTextFile(coverPath);

      // Try to convert fallback to PNG as well
      try {
        const resvg = new Resvg(svgContent, {
          fitTo: {
            mode: "width",
            value: 1200,
          },
        });
        const pngData = resvg.render();
        const pngBuffer = pngData.asPng();

        return new Response(pngBuffer, {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=3600",
          },
        });
      } catch {
        // If PNG conversion fails, return SVG as last resort
        return new Response(svgContent, {
          headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    } catch {
      return new Response("Image not found", { status: 404 });
    }
  }
}
