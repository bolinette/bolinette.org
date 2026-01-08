import { createHighlighter } from "shiki";

let highlighterPromise;

export function shikiPlugin() {
  return {
    name: "vite-plugin-shiki",
    async configResolved() {
      if (!highlighterPromise) {
        highlighterPromise = createHighlighter({
          themes: ["github-dark"],
          langs: ["python"],
        });
      }
    },
    transformIndexHtml: {
      order: "post",
      async handler(html) {
        const highlighter = await highlighterPromise;
        if (!highlighter) {
          return html;
        }

        const codeBlockRegex = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
        const matches = html.match(codeBlockRegex);

        return html.replace(codeBlockRegex, (match, code) => {
          const decodedCode = code
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"');

          try {
            const highlighted = highlighter.codeToHtml(decodedCode, {
              lang: "python",
              theme: "github-dark",
            });
            return highlighted;
          } catch (e) {
            return match;
          }
        });
      },
    },
  };
}
