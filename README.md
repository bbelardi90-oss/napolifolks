# napolifolks.com

Sito di Napoli Folks, fatto con [Astro](https://astro.build) e pubblicato su Cloudflare Pages.

## Comandi

| Comando | Cosa fa |
| --- | --- |
| `npm install` | Installa le dipendenze |
| `npm run dev` | Avvia il sito in locale su http://localhost:4321 |
| `npm run build` | Crea il sito statico nella cartella `dist` |
| `npm run importa-youtube` | Importa dal canale YouTube data e descrizione dei video e le bozze dei video nuovi |

Serve Node 24 (vedi `.nvmrc`).

## Contenuti

- `src/content/sessioni/` — un file per video
- `src/content/gruppi/` — un file per gruppo
- `src/content/luoghi.json` — luoghi con coordinate
- `src/config.ts` — email e link social

Le regole per modificare i contenuti sono in `CLAUDE.md`.
