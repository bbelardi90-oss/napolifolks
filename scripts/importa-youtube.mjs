// Importa i video del canale YouTube "Napoli Folks Live" dal feed RSS pubblico.
// - Completa dataPubblicazione e descrizioneOriginale (testo YouTube) dove sono ancora null.
//   Il campo descrizione (inglese, mostrato sul sito) si scrive a parte.
// - Crea una bozza per ogni video nuovo (gruppo e luogo restano null: da definire con Bruno).
// - Scarica la miniatura grande (1280x720) dei video nuovi in .miniature-originali/;
//   poi va ritagliata con: python3 scripts/ritaglia-miniature.py .miniature-originali
// Non tocca mai campi già compilati.
// Uso: npm run importa-youtube

import { readdir, readFile, writeFile, access, mkdir } from 'node:fs/promises';
import path from 'node:path';

const CANALE = 'UCgBHZocloDLg_bqVOI0iddA';
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CANALE}`;
const DIR_SESSIONI = 'src/content/sessioni';
const DIR_MINIATURE = 'public/miniature';
const DIR_ORIGINALI = '.miniature-originali';

const decodifica = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const tag = (xml, nome) => {
  const m = xml.match(new RegExp(`<${nome}[^>]*>([\\s\\S]*?)</${nome}>`));
  return m ? decodifica(m[1].trim()) : null;
};
let nuoveMiniature = 0;
const esiste = (p) => access(p).then(() => true, () => false);

const risposta = await fetch(FEED);
if (!risposta.ok) {
  console.error(`Feed non disponibile (HTTP ${risposta.status}). Riprova più tardi.`);
  process.exit(1);
}
const xml = await risposta.text();
const video = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
  id: tag(e, 'yt:videoId'),
  titolo: tag(e, 'title'),
  data: tag(e, 'published')?.slice(0, 10) ?? null,
  descrizione: tag(e, 'media:description') || null,
}));
console.log(`Video nel feed: ${video.length}`);

// Sessioni esistenti, indicizzate per youtubeId
const file = (await readdir(DIR_SESSIONI)).filter((f) => f.endsWith('.md'));
const perId = new Map();
for (const f of file) {
  const testo = await readFile(path.join(DIR_SESSIONI, f), 'utf8');
  const id = testo.match(/^youtubeId:\s*"?([^"\s]+)"?/m)?.[1];
  if (id) perId.set(id, { f, testo });
}

const completa = (testo, campo, valore) =>
  valore === null ? testo : testo.replace(new RegExp(`^${campo}: null.*$`, 'm'), `${campo}: ${JSON.stringify(valore)}`);

for (const v of video) {
  const esistente = perId.get(v.id);
  if (esistente) {
    let t = completa(esistente.testo, 'dataPubblicazione', v.data);
    t = completa(t, 'descrizioneOriginale', v.descrizione);
    if (t !== esistente.testo) {
      await writeFile(path.join(DIR_SESSIONI, esistente.f), t);
      console.log(`Aggiornata: ${esistente.f}`);
    }
  } else {
    const numero = Number(v.titolo?.match(/#\s*(\d+)/)?.[1] ?? NaN);
    const nomeFile = Number.isFinite(numero) ? `${String(numero).padStart(2, '0')}.md` : `${v.id}.md`;
    if (await esiste(path.join(DIR_SESSIONI, nomeFile))) {
      console.warn(`Salto ${v.id}: ${nomeFile} esiste già con un altro video. Controlla a mano.`);
      continue;
    }
    const contenuto = `---
# Dati presi da YouTube. Non modificare a mano titolo, youtubeId e durata.
titolo: ${JSON.stringify(v.titolo)}
numero: ${Number.isFinite(numero) ? numero : 'null'}
youtubeId: ${JSON.stringify(v.id)}
durata: null  # [durata] — non presente nel feed RSS
dataPubblicazione: ${v.data ? JSON.stringify(v.data) : 'null'}
descrizione: null  # [English description] — da preparare dal testo originale
descrizioneOriginale: ${v.descrizione ? JSON.stringify(v.descrizione) : 'null'}
# Da definire con Bruno: non dedurli dal titolo.
gruppo: null
luogo: null
bozza: true
---
`;
    await writeFile(path.join(DIR_SESSIONI, nomeFile), contenuto);
    console.log(`Nuova bozza: ${nomeFile} — ${v.titolo}`);
  }

  if (!(await esiste(path.join(DIR_MINIATURE, `${v.id}.jpg`)))) {
    const r = await fetch(`https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`);
    if (r.ok) {
      await mkdir(DIR_ORIGINALI, { recursive: true });
      await writeFile(path.join(DIR_ORIGINALI, `${v.id}.max.jpg`), Buffer.from(await r.arrayBuffer()));
      nuoveMiniature++;
      console.log(`Miniatura scaricata: ${v.id}`);
    }
  }
}

if (nuoveMiniature) {
  console.log(`\nOra ritaglia le miniature: python3 scripts/ritaglia-miniature.py ${DIR_ORIGINALI}`);
}
