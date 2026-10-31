// Lingue del sito. L'inglese è la lingua principale e sta alla radice (/about/);
// l'italiano è una traduzione e sta sotto /it/ (/it/about/), con gli stessi indirizzi.
// Le pagine vere stanno in src/pagine/ e ricevono la lingua `l`; i file in src/pages/
// e in src/pages/it/ le pubblicano una volta per lingua.
export type Lingua = 'en' | 'it';

export const LINGUE: Lingua[] = ['en', 'it'];

export function linguaDa(url: URL): Lingua {
  return /^\/it(\/|$)/.test(url.pathname) ? 'it' : 'en';
}

// Indirizzo di una pagina nella lingua scelta. `p` è il percorso inglese, es. '/about/'.
export function percorso(l: Lingua, p: string): string {
  return l === 'it' ? `/it${p}` : p;
}

// La stessa pagina nell'altra lingua (per la bandierina).
export function percorsoIn(l: Lingua, url: URL): string {
  const base = url.pathname.replace(/^\/it(?=\/|$)/, '') || '/';
  return percorso(l, base);
}

export const TESTI = {
  en: {
    nomeLingua: 'English',
    saltaAlContenuto: 'Skip to content',
    menu: 'Menu',
    navigazione: 'Main',
    about: 'About',
    suggest: 'Suggest an artist',
    privacy: 'Privacy',
    play: 'Play',
    notaVideo: 'The video loads from YouTube (youtube-nocookie.com) only when you press play.',
    guardaSuYouTube: 'Watch on YouTube',
    apriSuYouTube: 'Open on YouTube',
    altreSessioni: 'More sessions',
    tutteLeSessioni: 'All sessions',
    segnapostoDescrizione: 'description from the YouTube video',
  },
  it: {
    nomeLingua: 'Italiano',
    saltaAlContenuto: 'Vai al contenuto',
    menu: 'Menu',
    navigazione: 'Principale',
    about: 'Chi siamo',
    suggest: 'Segnala un artista',
    privacy: 'Privacy',
    play: 'Riproduci',
    notaVideo: 'Il video si carica da YouTube (youtube-nocookie.com) solo quando premi play.',
    guardaSuYouTube: 'Guarda su YouTube',
    apriSuYouTube: 'Apri su YouTube',
    altreSessioni: 'Altre sessioni',
    tutteLeSessioni: 'Tutte le sessioni',
    segnapostoDescrizione: 'descrizione dal video YouTube',
  },
} satisfies Record<Lingua, Record<string, string>>;
