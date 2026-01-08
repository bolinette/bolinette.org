import { readFile } from "fs/promises";
import { resolve } from "path";

export function includePartialsPlugin(options = {}) {
  const { partialDirectory } = options;

  return {
    name: "vite-plugin-include-partials",
    transformIndexHtml: {
      order: "pre",
      async handler(html) {
        const partialRegex = /\{\{>\s*([a-zA-Z0-9_-]+)\s*\}\}/g;
        const matches = [...html.matchAll(partialRegex)];

        for (const match of matches) {
          const partialName = match[1];
          const partialPath = resolve(partialDirectory, `${partialName}.html`);

          try {
            const partialContent = await readFile(partialPath, "utf-8");
            html = html.replace(match[0], partialContent);
          } catch (e) {
            console.error(`Failed to load partial: ${partialName}`, e);
          }
        }

        return html;
      },
    },
    handleHotUpdate({ file, server }) {
      if (file.includes(partialDirectory) && file.endsWith(".html")) {
        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      }
    },
  };
}
