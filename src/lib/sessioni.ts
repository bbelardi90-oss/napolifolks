import { getCollection, type CollectionEntry } from 'astro:content';

export type Sessione = CollectionEntry<'sessioni'>;

export async function tutteLeSessioni(): Promise<Sessione[]> {
  const s = await getCollection('sessioni');
  // Dalla più recente: numero più alto prima.
  return s.sort((a, b) => (b.data.numero ?? 0) - (a.data.numero ?? 0));
}

export function numeroFormattato(n: number | null): string {
  return n === null ? '—' : String(n).padStart(2, '0');
}

export function durataFormattata(secondi: number | null): string | null {
  if (secondi === null) return null;
  const m = Math.floor(secondi / 60);
  const s = String(secondi % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function dataFormattata(d: Date | null): string | null {
  if (!d) return null;
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function urlYouTube(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
