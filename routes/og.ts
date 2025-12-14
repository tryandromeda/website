// routes/og.ts - Dynamic OG image generator with PNG output
import { FreshContext } from "fresh";
import { Resvg } from "npm:@resvg/resvg-js";

function wrapAndCenterTitle(title: string): string {
  if (!title) return "";

  const maxCharsPerLine = 30;
  const baseFontSize = 3472.221;
  const centerX = 25000;
  const baseY = 22125.972;
  const lineHeight = 3800;

  let fontSize = baseFontSize;
  if (title.length > 40) {
    fontSize = baseFontSize * 0.6;
  } else if (title.length > 30) {
    fontSize = baseFontSize * 0.75;
  }

  const words = title.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length === 1) {
    return `<text x="${centerX}px" y="${baseY}px" style="font-family:'JetBrainsMono-Bold', 'JetBrains Mono', monospace;font-weight:700;font-size:${fontSize}px;fill:#88b2d9;text-anchor:middle;">${
      escapeXml(title)
    }</text>`;
  }

  const adjustedLineHeight = lineHeight * (fontSize / baseFontSize);
  const totalHeight = (lines.length - 1) * adjustedLineHeight;
  const startY = baseY - (totalHeight / 2);

  const tspans = lines.map((line, i) => {
    const dy = i === 0 ? 0 : adjustedLineHeight;
    return `  <tspan x="${centerX}px" dy="${dy}">${escapeXml(line)}</tspan>`;
  }).join("\n");

  return `<text x="${centerX}px" y="${startY}px" style="font-family:'JetBrainsMono-Bold', 'JetBrains Mono', monospace;font-weight:700;font-size:${fontSize}px;fill:#88b2d9;text-anchor:middle;">
${tspans}
</text>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

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

    // Replace [[INSERT TITLE]] with wrapped and centered title
    const titleSvg = wrapAndCenterTitle(title);
    svgContent = svgContent.replace(
      /<text x="25000px" y="22125\.972px"[^>]*>\[\[INSERT TITLE\]\]<\/text>/,
      titleSvg,
    );

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
