from pathlib import Path
from PIL import Image
from rapidocr_onnxruntime import RapidOCR

source_root = Path(r'C:\Users\prisc\OneDrive\Desktop\Neuer Ordner (2)\Neuer Ordner\Autoparts')
tmp_root = Path(r'C:\Users\prisc\OneDrive\Dokumente\Clash\F1ClashCompanion_Ultimate\scripts\tmp\crop_work')
tmp_root.mkdir(parents=True, exist_ok=True)
files = [
    'Screenshot_2026-03-13-22-13-11-004_com.google.android.youtube.jpg',
    'Screenshot_2026-03-13-22-16-53-744_com.google.android.youtube.jpg',
    'Screenshot_2026-03-13-22-17-15-053_com.google.android.youtube.jpg',
    'Screenshot_2026-03-13-22-19-54-232_com.google.android.youtube.jpg',
    'Screenshot_2026-03-13-22-21-41-849_com.google.android.youtube.jpg',
    'Screenshot_2026-03-13-22-21-52-246_com.google.android.youtube.jpg',
    'Screenshot_2026-03-13-22-22-01-912_com.google.android.youtube.jpg',
    'Screenshot_2026-03-13-22-22-25-808_com.google.android.youtube.jpg',
    'Screenshot_2026-03-13-22-22-42-958_com.google.android.youtube.jpg',
]
# Relative crop boxes tuned for mobile screenshots: center name strips.
boxes = {
    'mid_lower': (0.12, 0.48, 0.88, 0.76),
    'mid_center': (0.12, 0.36, 0.88, 0.62),
    'lower': (0.08, 0.56, 0.92, 0.86),
}
engine = RapidOCR()
for name in files:
    path = source_root / name
    if not path.exists():
        continue
    img = Image.open(path).convert('RGB')
    w, h = img.size
    print(f'\nFILE: {name} ({w}x{h})')
    for label, box in boxes.items():
        left = int(w * box[0]); top = int(h * box[1]); right = int(w * box[2]); bottom = int(h * box[3])
        crop = img.crop((left, top, right, bottom))
        tmp = tmp_root / f'{path.stem}_{label}.png'
        crop.save(tmp)
        result, _ = engine(str(tmp))
        lines = [entry[1] for entry in (result or [])]
        print(f'  CROP {label}: ' + ' | '.join(lines[:12]))
        tmp.unlink(missing_ok=True)
