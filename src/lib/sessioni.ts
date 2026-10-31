import { getCollection, type CollectionEntry } from 'astro:content';
import miniature from '../data/miniature.json';

// Dimensioni delle miniature ritagliate (scripts/ritaglia-miniature.py).
export function dimensioniMiniatura(youtubeId: string): { larghezza: number; altezza: number } {
  return (miniature as Record<string, { larghezza: number; altezza: number }>)[youtubeId]
    ?? { larghezza: 1280, altezza: 720 };
}

export type Sessione = CollectionEntry<'sessioni'>;

export async function tutteLeSessioni(): Promise<Sessione[]> {
  const s = await getCollection('sessioni');
  // Dalla più recente: numero più alto prima.
  return s.sort((a, b) => (b.data.numero ?? 0) - (a.data.numero ?? 0));
}

// Titolo senza la parte ripetuta "Napoli Folks Live #N -": resta il testo
// del video (artista e brano). La prima virgola, che nei titoli separa
// artista e brano, diventa una lineetta.
// Percorsi per le pagine delle sessioni, con la sessione precedente e la successiva.
export async function percorsiSessioni() {
  const sessioni = await tutteLeSessioni();
  return sessioni.map((s, i) => ({
    params: { id: s.id },
    props: { sessione: s, precedente: sessioni[i + 1] ?? null, successiva: sessioni[i - 1] ?? null },
  }));
}

export function titoloBreve(titolo: string): string {
  return titolo
    .replace(/^\s*Napoli Folks Live\s*-?\s*(#\s*\d+)?\s*-?\s*/i, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s*,\s*/, ' – ')
    .trim();
}

// Il titolo breve diviso in artista (con la lineetta) e brano, per poterli
// mandare a capo interi. Senza lineetta il brano è null.
export function partiTitolo(titolo: string): { artista: string; brano: string | null } {
  const breve = titoloBreve(titolo);
  const i = breve.indexOf(' – ');
  if (i < 0) return { artista: breve, brano: null };
  return { artista: breve.slice(0, i + 2), brano: breve.slice(i + 3) };
}

export function numeroFormattato(n: number | null): string {
  return n === null ? '—' : `#${n}`;
}

export function durataFormattata(secondi: number | null): string | null {
  if (secondi === null) return null;
  const m = Math.floor(secondi / 60);
  const s = String(secondi % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function dataFormattata(d: Date | null): string | null {
  if (!d) return null;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function urlYouTube(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
