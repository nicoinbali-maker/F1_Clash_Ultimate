import json
from pathlib import Path

root = Path(r'C:\Users\prisc\OneDrive\Dokumente\Clash\F1ClashCompanion_Ultimate')
progress = json.loads((root / 'scripts' / 'tmp' / 'part-ocr-progress.json').read_text(encoding='utf-8'))
manifest = json.loads((root / 'assets' / 'parts' / 'part-photo-map.json').read_text(encoding='utf-8'))
used = {row['source'] for row in manifest if row.get('source')}
rows = [row for row in progress.values() if row['source'] not in used]
for row in sorted(rows, key=lambda item: item['source']):
    print(f"\nSOURCE: {row['source']}")
    print(f"MATCH: {row.get('match')} SCORE: {row.get('score')} TARGET: {row.get('target')}")
    print("CANDIDATES: " + " | ".join(row.get('candidates', [])[:8]))
