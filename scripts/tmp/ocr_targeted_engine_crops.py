from pathlib import Path
from PIL import Image
from rapidocr_onnxruntime import RapidOCR

source_root = Path(r'C:\Users\prisc\OneDrive\Desktop\Neuer Ordner (2)\Neuer Ordner\Autoparts')
tmp_root = Path(r'C:\Users\prisc\OneDrive\Dokumente\Clash\F1ClashCompanion_Ultimate\scripts\tmp\crop_work')
tmp_root.mkdir(parents=True, exist_ok=True)
files = [
    'Screenshot_2026-03-13-22-19-54-232_com.google.android.youtube.jpg',
    'Screenshot_2026-03-13-22-22-25-808_com.google.android.youtube.jpg',
    'Screenshot_2026-03-13-22-22-42-958_com.google.android.youtube.jpg',
]
boxes = {
    'right_mid': (0.48, 0.42, 0.95, 0.82),
    'right_lower': (0.48, 0.56, 0.95, 0.90),
    'center_lower': (0.25, 0.50, 0.78, 0.88),
    'bottom_band': (0.10, 0.68, 0.92, 0.98),
}
engine = RapidOCR()
for name in files:
    path = source_root / name
    if not path.exists():
        continue
    img = Image.open(path).convert('RGB')
    w, h = img.size
    print(f'\nFILE: {name}')
    for label, box in boxes.items():
        crop = img.crop((int(w*box[0]), int(h*box[1]), int(w*box[2]), int(h*box[3])))
        tmp = tmp_root / f'{path.stem}_{label}.png'
        crop.save(tmp)
        result, _ = engine(str(tmp))
        lines = [entry[1] for entry in (result or [])]
        print(f'  {label}: ' + ' | '.join(lines[:20]))
        tmp.unlink(missing_ok=True)
