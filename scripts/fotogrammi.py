"""Crea le anteprime dei video senza il logo stampato nel video.

Per ogni video in src/data/fotogrammi.json scarica il fotogramma automatico di
YouTube scelto (maxres1/2/3.jpg), lo ritaglia come indicato, lo salva in
public/miniature/<id>.jpg e aggiorna src/data/miniature.json (dimensioni).

Uso: python3 scripts/fotogrammi.py
"""
import io, json, pathlib, urllib.request
from PIL import Image

radice = pathlib.Path(__file__).resolve().parent.parent
scelte = json.loads((radice / 'src/data/fotogrammi.json').read_text())
dati = radice / 'src/data/miniature.json'
dimensioni = json.loads(dati.read_text())

for vid, s in scelte.items():
    if vid.startswith('_nota'):
        continue
    url = f"https://i.ytimg.com/vi/{vid}/maxres{s['fotogramma']}.jpg"
    im = Image.open(io.BytesIO(urllib.request.urlopen(url).read())).convert('RGB')
    w, h = im.size
    x0, y0, x1, y1 = s['ritaglio']
    im = im.crop((round(x0 * w), round(y0 * h), round(x1 * w), round(y1 * h)))
    im.save(radice / 'public/miniature' / f'{vid}.jpg', quality=86, optimize=True, progressive=True)
    dimensioni[vid] = {'larghezza': im.width, 'altezza': im.height}
    print(vid, im.size)

dati.write_text(json.dumps(dimensioni, indent=2) + '\n')
