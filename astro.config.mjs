import { defineConfig } from 'astro/config';
import { rename, rmdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Cloudflare Pages, per un indirizzo inesistente sotto /it/, mostra dist/it/404.html.
// Astro genera invece dist/it/404/index.html: qui lo spostiamo al posto giusto.
const paginaNonTrovataItaliana = {
  name: 'pagina-404-italiana',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const it = fileURLToPath(new URL('it/', dir));
      await rename(`${it}404/index.html`, `${it}404.html`);
      await rmdir(`${it}404`);
    },
  },
};

export default defineConfig({
  site: 'https://napolifolks.com',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [paginaNonTrovataItaliana],
});
