export function interpolatePlugin(options = {}) {
  const { context = {} } = options;

  return {
    name: "vite-plugin-interpolate",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const variableRegex = /\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g;
        return html.replace(variableRegex, (match, varName) => {
          const replacement =
            context[varName] !== undefined ? context[varName] : match;
          return replacement;
        });
      },
    },
  };
}
