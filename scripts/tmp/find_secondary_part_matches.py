import difflib
import json
import re
from pathlib import Path

PART_NAMES = [
    'Pivot', 'The Stabiliser', 'The Descent', 'Rumble', 'Flow 1K', 'Supernova', 'Boombox', 'Grindlock', 'Fluxspring', 'Teeter Totter',
    'Hustle', 'Slickshift', 'Beat', 'Fury', 'The Dynamo', 'The Beast', 'Metronome', 'Jittershift',
    'Motion', 'Gale Force', 'The Spire', 'Power Lift', 'Aero Blade', 'X-Hale', 'The Valkyrie', 'Phantom Arc',
    'The Dash', 'Glide', 'Synergy', 'The Sabre', 'Curler', 'Vortex', 'Flex XL', 'Edgecutter',
    'Swish', 'Curver 2.5', 'The Arc', 'Quantum', 'Gyro', 'Equinox', 'Joltcoil', 'Nexus',
    'Mach I', 'Spark-E', 'The Reactor', 'Mach II', 'Behemoth', 'Mach III', 'Chaos Core', 'Turbo Jet',
]
MISSING = {'Grindlock','Fluxspring','Teeter Totter','Jittershift','Phantom Arc','Edgecutter','Joltcoil','Mach III'}

def norm(text: str) -> str:
    return re.sub(r'[^a-z0-9]+', '', text.lower())

root = Path(r'C:\Users\prisc\OneDrive\Dokumente\Clash\F1ClashCompanion_Ultimate')
progress = json.loads((root / 'scripts' / 'tmp' / 'part-ocr-progress.json').read_text(encoding='utf-8'))
for source, row in sorted(progress.items()):
    found = []
    for candidate in row.get('candidates', []):
        nc = norm(candidate)
        for part in MISSING:
            np = norm(part)
            score = difflib.SequenceMatcher(None, nc, np).ratio()
            if nc == np:
                score = 1.0
            if np in nc or nc in np:
                score = max(score, 0.92)
            if score >= 0.75:
                found.append((part, round(score,3), candidate))
    if found:
        uniq = []
        seen = set()
        for item in sorted(found, key=lambda x: (-x[1], x[0])):
            key = (item[0], item[2])
            if key in seen:
                continue
            seen.add(key)
            uniq.append(item)
        print(f'\nSOURCE: {source}')
        print(f'PRIMARY: {row.get("match")} -> {row.get("target")}')
        for part, score, candidate in uniq[:10]:
            print(f'  POSSIBLE: {part} score={score} via {candidate}')
