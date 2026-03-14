from __future__ import annotations

import argparse
import difflib
import json
import re
import shutil
from pathlib import Path

from rapidocr_onnxruntime import RapidOCR


PART_NAMES = [
    'Pivot', 'The Stabiliser', 'The Descent', 'Rumble', 'Flow 1K', 'Supernova', 'Boombox', 'Grindlock',
    'Hustle', 'Slickshift', 'Beat', 'Fury', 'The Dynamo', 'The Beast', 'Metronome', 'Jittershift',
    'Motion', 'Gale Force', 'The Spire', 'Power Lift', 'Aero Blade', 'X-Hale', 'The Valkyrie', 'Starter',
    'The Dash', 'Glide', 'Synergy', 'The Sabre', 'Curler', 'Vortex', 'Flex XL', 'Edgecutter',
    'Swish', 'Curver 2.5', 'The Arc', 'Quantum', 'Gyro', 'Equinox', 'Joltcoil', 'Nexus', 'Fluxspring', 'Starter',
    'Mach I', 'Spark-E', 'The Reactor', 'Mach II', 'Behemoth', 'Mach III', 'Chaos Core', 'Turbo Jet',
]

NOISE = {
    'speed', 'cornering', 'powerunit', 'qualifying', 'avgpitstoptime', 'frontwing', 'rearwing', 'gearbox', 'brakes', 'engine', 'suspension',
    'epic', 'rare', 'common', 'legendary', 'stats', 'avg', 'pit', 'stop', 'time'
}


def norm(text: str) -> str:
    return re.sub(r'[^a-z0-9]+', '', text.lower())


def slug(text: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def load_json(path: Path, fallback):
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception:
        return fallback


def save_json(path: Path, data) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')


def file_signature(path: Path) -> dict[str, int]:
    stat = path.stat()
    return {
        'size': stat.st_size,
        'mtime_ns': stat.st_mtime_ns,
    }


def is_already_processed(path: Path, progress: dict[str, dict]) -> bool:
    row = progress.get(path.name)
    if not isinstance(row, dict):
        return False
    if row.get('source') != path.name:
        return False
    signature = row.get('signature')
    if isinstance(signature, dict):
        return signature == file_signature(path)
    return any(key in row for key in ('match', 'target', 'error', 'candidates'))


def write_status(path: Path, data: dict) -> None:
    save_json(path, data)


def best_match(lines: list[str]) -> tuple[str | None, float, list[str]]:
    candidates: list[str] = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        cleaned = norm(line)
        if not cleaned or cleaned in NOISE or cleaned.isdigit():
            continue
        if re.fullmatch(r'[0-9.]+s?', cleaned):
            continue
        candidates.append(line)

    best_name = None
    best_score = 0.0
    for candidate in candidates:
        nc = norm(candidate)
        for part in PART_NAMES:
            np = norm(part)
            score = difflib.SequenceMatcher(None, nc, np).ratio()
            if nc == np:
                score = 1.0
            if np in nc or nc in np:
                score = max(score, 0.92)
            if score > best_score:
                best_name = part
                best_score = score
    return best_name, best_score, candidates


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--start', type=int, default=0)
    parser.add_argument('--limit', type=int, default=10)
    parser.add_argument('--force-rescan', action='store_true')
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[2]
    src = Path(r'C:\Users\prisc\OneDrive\Desktop\Neuer Ordner (2)\Neuer Ordner\Autoparts')
    dests = [root / 'assets' / 'parts', root / 'dist' / 'assets' / 'parts']
    tmp_dir = root / 'scripts' / 'tmp'
    progress_path = tmp_dir / 'part-ocr-progress.json'
    manifest_path = tmp_dir / 'part-ocr-manifest.json'
    status_path = tmp_dir / 'part-ocr-status.json'
    engine = RapidOCR()

    raw_paths = (
        list(src.glob('*.jpg'))
        + list(src.glob('*.JPG'))
        + list(src.glob('*.jpeg'))
        + list(src.glob('*.JPEG'))
    )
    by_name = {path.name.lower(): path for path in raw_paths}
    all_paths = sorted(by_name.values(), key=lambda path: path.name.lower())
    progress = load_json(progress_path, {})
    pending_paths = [
        path for path in all_paths
        if args.force_rescan or not is_already_processed(path, progress)
    ]
    batch_paths = pending_paths[args.start:args.start + args.limit]

    write_status(status_path, {
        'phase': 'starting',
        'source_dir': str(src),
        'total_source_files': len(all_paths),
        'pending_source_files': len(pending_paths),
        'requested_start': args.start,
        'requested_limit': args.limit,
        'batch_size': len(batch_paths),
        'force_rescan': args.force_rescan,
        'current_file': None,
        'processed_in_batch': 0,
    })

    print(
        f"Found {len(all_paths)} source files, {len(pending_paths)} pending, processing {len(batch_paths)} in this batch.",
        flush=True,
    )

    for index, path in enumerate(batch_paths, start=1):
        signature = file_signature(path)
        write_status(status_path, {
            'phase': 'ocr',
            'source_dir': str(src),
            'total_source_files': len(all_paths),
            'pending_source_files': len(pending_paths),
            'requested_start': args.start,
            'requested_limit': args.limit,
            'batch_size': len(batch_paths),
            'force_rescan': args.force_rescan,
            'current_file': path.name,
            'processed_in_batch': index - 1,
        })
        print(f"[{index}/{len(batch_paths)}] OCR {path.name}", flush=True)
        try:
            ocr_result, _ = engine(str(path))
            lines = [entry[1] for entry in (ocr_result or [])]
            match, score, candidates = best_match(lines)
            progress[path.name] = {
                'source': path.name,
                'signature': signature,
                'match': match,
                'score': round(score, 3),
                'candidates': candidates[:8],
                'copied': False,
                'target': None,
                'error': None,
            }
            if match and score >= 0.72:
                progress[path.name]['target'] = f'{slug(match)}.jpg'
        except Exception as exc:
            progress[path.name] = {
                'source': path.name,
                'signature': signature,
                'match': None,
                'score': 0.0,
                'candidates': [],
                'copied': False,
                'target': None,
                'error': str(exc),
            }
            print(f"  -> failed: {exc}", flush=True)

    save_json(progress_path, progress)

    results = list(progress.values())

    best_per_target: dict[str, dict] = {}
    for row in results:
        target = row.get('target')
        if not target:
            continue
        current = best_per_target.get(target)
        if current is None or row['score'] > current['score']:
            best_per_target[target] = row

    for row in results:
        target = row.get('target')
        if not target:
            continue
        if best_per_target.get(target) is row:
            for dest in dests:
                out_path = dest / target
                if not out_path.exists():
                    shutil.copyfile(src / row['source'], out_path)
            row['copied'] = True

    manifest = []
    for part_name in PART_NAMES:
        target = f'{slug(part_name)}.jpg'
        row = best_per_target.get(target)
        target_exists = all((dest / target).exists() for dest in dests)
        if row:
            status = 'matched-and-copied'
            source = row['source']
            score = row['score']
        elif target_exists:
            status = 'existing-asset'
            source = target
            score = None
        else:
            status = 'missing'
            source = None
            score = None
        manifest.append({
            'part': part_name,
            'target': target,
            'source': source,
            'score': score,
            'status': status,
        })

    save_json(manifest_path, manifest)

    for dest in dests:
        save_json(dest / 'part-photo-map.json', manifest)

    final_summary = {
        'phase': 'done',
        'source_dir': str(src),
        'total_source_files': len(all_paths),
        'pending_source_files': len(pending_paths),
        'requested_start': args.start,
        'requested_limit': args.limit,
        'batch_size': len(batch_paths),
        'force_rescan': args.force_rescan,
        'current_file': None,
        'processed_in_batch': len(batch_paths),
        'matched_parts': len([entry for entry in manifest if entry['status'] == 'matched-and-copied']),
        'available_parts': len([entry for entry in manifest if entry['status'] in {'matched-and-copied', 'existing-asset'}]),
        'missing_parts': len([entry for entry in manifest if entry['status'] == 'missing']),
        'error_files': len([entry for entry in results if entry.get('error')]),
    }
    write_status(status_path, final_summary)

    print(json.dumps({
        'processed': len(batch_paths),
        'total_seen': len(results),
        'remaining_unprocessed_sources': max(len(pending_paths) - len(batch_paths), 0),
        'matched_parts': final_summary['matched_parts'],
        'available_parts': final_summary['available_parts'],
        'missing_parts': final_summary['missing_parts'],
        'error_files': final_summary['error_files'],
    }, indent=2, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    main()