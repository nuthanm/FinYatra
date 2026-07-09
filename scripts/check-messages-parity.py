#!/usr/bin/env python3
"""Verify all locale JSON files in web/messages have identical keys."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MESSAGES = ROOT / "web" / "messages"
LOCALES = ("en", "hi", "te", "ta", "kn", "ml")


def main() -> int:
    if not MESSAGES.is_dir():
        print(f"Missing messages dir: {MESSAGES}", file=sys.stderr)
        return 1

    base_path = MESSAGES / "en.json"
    if not base_path.is_file():
        print("Missing en.json baseline", file=sys.stderr)
        return 1

    base_keys = set(json.loads(base_path.read_text(encoding="utf-8")).keys())
    failed = False

    for locale in LOCALES:
        path = MESSAGES / f"{locale}.json"
        if not path.is_file():
            print(f"MISSING: {path.name}")
            failed = True
            continue

        keys = set(json.loads(path.read_text(encoding="utf-8")).keys())
        missing = sorted(base_keys - keys)
        extra = sorted(keys - base_keys)

        if missing or extra:
            failed = True
            print(f"\n{locale}.json:")
            if missing:
                print(f"  missing ({len(missing)}): {missing[:8]}{'...' if len(missing) > 8 else ''}")
            if extra:
                print(f"  extra ({len(extra)}): {extra[:8]}{'...' if len(extra) > 8 else ''}")
        else:
            print(f"OK {locale}.json ({len(keys)} keys)")

    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
