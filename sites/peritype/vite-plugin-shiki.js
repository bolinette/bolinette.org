import { createHighlighter } from 'shiki';

let highlighter;

export function shikiPlugin() {
  return {
    name: 'vite-plugin-shiki',
    async configResolved() {
      highlighter = await createHighlighter({
        themes: ['github-dark'],
        langs: ['python'],
      });
      console.log('Shiki: highlighter initialized');
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (!highlighter) {
          console.log('Shiki: highlighter not initialized');
          return html;
        }

        console.log('Shiki: processing HTML, length:', html.length);
        const codeBlockRegex = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
        const matches = html.match(codeBlockRegex);
        console.log('Shiki: found code blocks:', matches ? matches.length : 0);

        return html.replace(codeBlockRegex, (match, code) => {
          const decodedCode = code
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"');

          try {
            const highlighted = highlighter.codeToHtml(decodedCode, {
              lang: 'python',
              theme: 'github-dark',
            });
            console.log('Shiki: highlighted a block');
            return highlighted;
          } catch (e) {
            console.error('Shiki highlighting error:', e);
            return match;
          }
        });
      },
    },
  };
}
