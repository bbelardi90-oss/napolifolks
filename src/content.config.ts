import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

// Una sessione = un video YouTube.
// titolo, youtubeId, durata, dataPubblicazione, descrizione: solo da YouTube.
// gruppo e luogo: solo dopo conferma di Bruno (mai dedotti dal titolo).
const sessioni = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sessioni' }),
  schema: z.object({
    titolo: z.string(),
    numero: z.number().int().nullable(),
    youtubeId: z.string(),
    durata: z.number().int().nullable(),
    dataPubblicazione: z.coerce.date().nullable(),
    descrizione: z.string().nullable(), // testo in inglese mostrato sul sito
    descrizioneOriginale: z.string().nullable().default(null), // descrizione YouTube completa, non mostrata
    gruppo: reference('gruppi').nullable(),
    luogo: reference('luoghi').nullable(),
    bozza: z.boolean().default(true),
  }),
});

const gruppi = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gruppi' }),
  schema: z.object({
    nome: z.string(),
    descrizione: z.string().nullable().default(null),
    link: z
      .array(z.object({ etichetta: z.string(), url: z.string().url() }))
      .default([]),
  }),
});

const luoghi = defineCollection({
  loader: file('./src/content/luoghi.json'),
  schema: z.object({
    id: z.string(),
    nome: z.string(),
  }),
});

export const collections = { sessioni, gruppi, luoghi };
