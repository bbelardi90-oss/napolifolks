# Napoli Folks — sito (napolifolks.com)

## Regola principale: non inventare nulla

Non scrivere descrizioni del progetto, nomi di gruppi, luoghi, tradizioni,
strumenti, attrezzature, date o testi che Bruno non abbia fornito.
Vale anche per sottotitoli, slogan, didascalie, testi alternativi e meta description.

Dove manca un'informazione:
- metti un segnaposto tra parentesi quadre, per esempio `[descrizione del progetto]`;
- nelle pagine usa il componente `<Segnaposto>` (`src/components/Segnaposto.astro`),
  che lo rende ben visibile nell'anteprima;
- chiedi il dato a Bruno.

Gruppo e luogo di una sessione **non si deducono dal titolo del video**:
si inseriscono solo dopo la conferma di Bruno.

## Cosa sappiamo (solo questo)

- Napoli Folks registra gruppi folk in esterna.
- Bruno Belardi è il fonico.
- Instagram: pagina "napoli folks live" (URL esatto: da confermare).
- YouTube: https://www.youtube.com/@NapoliFolksLive (ID canale `UCgBHZocloDLg_bqVOI0iddA`).
- Email: napolifolks@gmail.com
- Tutti i video e i materiali stanno su Instagram e YouTube.

## Tecnica

- Astro, sito statico. Pubblicazione su Cloudflare Pages: build `npm run build`, cartella `dist`.
- Contenuti in `src/content` (schema in `src/content.config.ts`):
  - `sessioni/NN.md`: un file per sessione (video). Titolo, ID, durata, data e descrizione
    vengono solo da YouTube; `gruppo` e `luogo` restano `null` finché Bruno non li conferma.
  - `gruppi/<slug>.md`: un file per gruppo, solo con dati forniti da Bruno.
  - `luoghi.json`: elenco dei luoghi con `id`, `nome`, `lat`, `lng`.
- Video YouTube: si caricano solo al clic, da `www.youtube-nocookie.com`
  (`src/components/VideoYouTube.astro`). Le miniature sono salvate in `public/miniature/`,
  così il sito non contatta Google prima del clic.
- Mappa: Leaflet + tasselli OpenStreetMap (`src/components/Mappa.astro`).
- Font installati localmente con @fontsource: EB Garamond (titoli in corsivo) e Inter (menu e dettagli).
- Un solo colore d'accento: variabile `--accento` in `src/styles/global.css`.
- Dati fissi del sito (email, link social) in `src/config.ts`.
- Deve funzionare bene da telefono: verifica sempre a 360–400 px di larghezza.

## Importare i video

`npm run importa-youtube` legge il feed RSS pubblico del canale e:
- completa `dataPubblicazione` e `descrizione` dove sono ancora `null`;
- crea una bozza per ogni video nuovo, con gruppo e luogo da definire.
Il feed contiene solo gli ultimi 15 video; la durata non è nel feed e va completata a parte.

## Lavoro

- Lavora su un ramo, apri una pull request, scrivi nella PR cosa controllare nell'anteprima.
- Prima di aprire la PR: `npm run build` deve passare.

## Versione di Node

Astro 7 richiede Node >= 22.23.4. Il file `.nvmrc` indica Node 24 (Cloudflare Pages lo legge in automatico).
