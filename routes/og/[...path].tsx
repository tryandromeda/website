import type { Handlers } from "fresh/server";

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      const pathSegments = ctx.params.path ? ctx.params.path.split("/") : [];

      const encodedTitle = pathSegments.join("/");
      const title = encodedTitle ? decodeURIComponent(encodedTitle) : "";

      const coverPath = new URL(
        "../../static/images/cover.svg",
        import.meta.url,
      );
      let svgContent = await Deno.readTextFile(coverPath);
      svgContent = svgContent.replace("[[INSERT TITLE]]", title);

      return new Response(svgContent, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (error) {
      console.error("Error generating OG image:", error);
      try {
        const coverPath = new URL(
          "../../static/images/cover.svg",
          import.meta.url,
        );
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
  },
};
