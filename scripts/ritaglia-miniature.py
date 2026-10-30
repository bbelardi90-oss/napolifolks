"""Ritaglia le bande nere dalle miniature dei video e salva le dimensioni.

Uso: python3 scripts/ritaglia-miniature.py <cartella-con-maxresdefault>
Legge <id>.max.jpg (1280x720 da YouTube), toglie solo le righe nere sopra
e sotto, salva public/miniature/<id>.jpg e aggiorna src/data/miniature.json.
"""
import json, sys, pathlib
from PIL import Image

sorgente = pathlib.Path(sys.argv[1])
radice = pathlib.Path(__file__).resolve().parent.parent
dest = radice / 'public' / 'miniature'
dati = radice / 'src' / 'data' / 'miniature.json'
dati.parent.mkdir(exist_ok=True)
dimensioni = json.loads(dati.read_text()) if dati.exists() else {}

for f in sorted(sorgente.glob('*.max.jpg')):
    vid = f.name[: -len('.max.jpg')]
    im = Image.open(f).convert('RGB')
    g = im.convert('L')
    w, h = g.size
    righe = [y for y in range(h) if max(g.getpixel((x, y)) for x in range(0, w, 8)) > 25]
    alto, basso = (righe[0], righe[-1] + 1) if righe else (0, h)
    # margine di sicurezza di 2 px per non lasciare righe scure ai bordi
    im = im.crop((0, min(alto + 2, h), w, max(basso - 2, 0)))
    im.save(dest / f'{vid}.jpg', quality=84, optimize=True, progressive=True)
    dimensioni[vid] = {'larghezza': im.width, 'altezza': im.height}
    print(vid, im.size)

dati.write_text(json.dumps(dimensioni, indent=2) + '\n')
