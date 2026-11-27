#!/usr/bin/env python3
"""Read-only layout validator. Does not move, delete or modify user files."""
import csv
from pathlib import Path
import sys

ROOT=Path(__file__).resolve().parents[3]
REQUIRED={'00_PROJECT_CONTROL','01_LEGAL_DISCOVERY','02_REQUIREMENTS_DESIGN','03_HARDWARE_IOT','04_DATA_MIGRATION','05_SOURCE_CODE','06_QA_ACCEPTANCE','07_OPERATIONS_SECURITY','08_BI_REPORTS','09_SIIR_PROCUREMENT','10_PHASE_DELIVERABLES','90_TEMP','98_ARCHIVE','99_QUARANTINE'}
idx=ROOT/'00_PROJECT_CONTROL/00-08_FILE_INDEX/FILE_INDEX.csv'
errors=[]
for entry in ROOT.iterdir():
    if entry.name not in REQUIRED: errors.append(f'Unexpected root item: {entry.name}')
    elif not entry.is_dir(): errors.append(f'Root must contain only directories: {entry.name}')
missing=REQUIRED-{x.name for x in ROOT.iterdir()}
for m in sorted(missing):errors.append(f'Missing root directory: {m}')
if not idx.exists():errors.append('Missing FILE_INDEX.csv')
else:
    with idx.open(encoding='utf-8-sig',newline='') as f:rows=list(csv.DictReader(f))
    seen=set()
    for row in rows:
        p=row['relative_path'];docid=row['doc_id']; target=ROOT/p
        if not target.is_file(): errors.append(f'Missing indexed file: {p}')
        if docid in seen:errors.append(f'Duplicate document ID: {docid}')
        seen.add(docid)
        if len(Path(p).parts)<3: errors.append(f'Not in a dedicated document folder: {p}')
    indexed={r['relative_path'] for r in rows}
    for top in sorted(REQUIRED-{'05_SOURCE_CODE','90_TEMP','98_ARCHIVE','99_QUARANTINE'}):
        for f in (ROOT/top).rglob('*'):
            if f.is_file() and f.relative_to(ROOT).as_posix() not in indexed:
                errors.append(f'Unindexed formal file: {f.relative_to(ROOT)}')
print(f'Layout status: {"PASS" if not errors else "FAIL"}; errors: {len(errors)}')
for err in errors: print('-',err)
sys.exit(1 if errors else 0)
