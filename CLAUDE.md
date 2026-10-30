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
- Squadra (pagina "Chi siamo"): Marcello Squillante, direzione artistica; Luca Lanzano,
  filmmaker; Bruno Belardi, fonico. Bio e foto: da ricevere.
- Instagram: https://www.instagram.com/napoli_folks_live/
- YouTube: https://www.youtube.com/@napolifolkslive (ID canale `UCgBHZocloDLg_bqVOI0iddA`).
- Email: napolifolks@gmail.com
- Tutti i video e i materiali stanno su Instagram e YouTube.

## Lingua

Il sito è in **inglese** (testi, menu, indirizzi delle pagine, segnaposti).
Questo file e i commenti nel codice restano in italiano.
Pagine: `/`, `/sessions/` (senza filtri, per ora), `/sessions/NN/`, `/about/`, `/suggest/`,
`/privacy/`. La sezione Artists è stata tolta per ora (i dati dei gruppi restano in
`src/content/gruppi/`, pronti se si rimette). Nell'interfaccia i "gruppi" si chiamano "Artists".
Ruoli in About: Art Director, Filmmaker, Sound Engineer (decisi con Bruno: non usare
le diciture dei titoli di coda dei video né quelle di Instagram/YouTube).

## Tecnica

- Astro, sito statico. Pubblicazione su Cloudflare Pages: build `npm run build`, cartella `dist`.
- Contenuti in `src/content` (schema in `src/content.config.ts`):
  - `sessioni/NN.md`: un file per sessione (video). Titolo, ID, durata, data e descrizione
    vengono solo da YouTube; `gruppo` e `luogo` restano `null` finché Bruno non li conferma.
  - `gruppi/<slug>.md`: un file per gruppo, solo con dati forniti da Bruno.
  - `luoghi.json`: elenco dei luoghi con `id` e `nome`.
- Video YouTube: si caricano solo al clic, da `www.youtube-nocookie.com`
  (`src/components/VideoYouTube.astro`). Le miniature sono salvate in `public/miniature/`,
  così il sito non contatta Google prima del clic.
- Font installati localmente con @fontsource: DM Serif Display (titoli e numeri) e DM Sans (menu, dettagli e testo).
- Un solo colore d'accento: variabile `--accento` in `src/styles/global.css`.
- Dati fissi del sito (email, link social) in `src/config.ts`. Icone social in `src/components/Icona.astro`.
- Deve funzionare bene da telefono: verifica sempre a 360–400 px di larghezza.

## Importare i video

`npm run importa-youtube` legge il feed RSS pubblico del canale e:
- completa `dataPubblicazione` e `descrizione` dove sono ancora `null`;
- crea una bozza per ogni video nuovo, con gruppo e luogo da definire.
Il feed contiene solo gli ultimi 15 video; la durata non è nel feed e va completata a parte.
Dietro un proxy (es. ambiente cloud) lanciare con `NODE_USE_ENV_PROXY=1`.
Descrizioni: `descrizioneOriginale` = testo YouTube completo (italiano e inglese insieme),
non mostrato sul sito. `descrizione` = solo inglese, mostrato sul sito: la parte inglese
copiata da YouTube; dove manca, tradotta fedelmente dall'italiano (segnalato nel file).
Mai italiano e inglese nella stessa pagina. Altre lingue: in futuro, come traduzione del sito.

Anteprime dei video: il logo Napoli Folks è stampato dentro i video, quindi le
anteprime sono fotogrammi automatici di YouTube (maxres1/2/3) ritagliati per lasciare
fuori il logo. Le scelte (fotogramma e ritaglio) stanno in `src/data/fotogrammi.json`;
`python3 scripts/fotogrammi.py` le applica, salva in `public/miniature/` e aggiorna
`src/data/miniature.json`. Per un video nuovo: aggiungi una voce in `fotogrammi.json`
scegliendo fotogramma e ritaglio guardando dove sta il logo.
(`scripts/ritaglia-miniature.py` resta per le copertine intere senza bande nere.)
Quando arriveranno fotogrammi originali senza logo, sostituiscono questi.

## Grafica

- Sito minimale, centrato sui video ("quadri"): in home e in archivio i fotogrammi sono
  a tutta larghezza, uno sotto l'altro, senza spazi. La home contiene solo i video.
- Tutti i riquadri hanno lo stesso formato 2,39:1 (`object-fit: cover`, ritaglio al centro).
- Il titolo compare sopra il video scurendolo: al passaggio del mouse, e su telefono
  solo mentre il dito tocca il video (nessuna comparsa automatica scorrendo).
  Nello stesso momento il riquadro si ingrandisce un po' (zoom) sopra i video vicini.
- Nei titoli mostrati non si ripete "Napoli Folks Live #N": restano numero e il resto
  del titolo del video (`titoloBreve` in `src/lib/sessioni.ts`). Il numero si scrive `#1`
  (non `01`); tra artista e brano c'è una lineetta ` – ` al posto della prima virgola.
- Logo provvisorio preso dall'immagine del canale YouTube: `public/logo/logo.png`
  (ritagliato e reso trasparente). Va sostituito con il file originale.
- La mappa è stata tolta su richiesta di Bruno.

## Lavoro

- Lavora su un ramo, apri una pull request, scrivi nella PR cosa controllare nell'anteprima.
- Prima di aprire la PR: `npm run build` deve passare.

## Versione di Node

Astro 7 richiede Node >= 22.23.4. Il file `.nvmrc` indica Node 24 (Cloudflare Pages lo legge in automatico).
