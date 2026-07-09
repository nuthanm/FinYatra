"""Export SharedResources .resx files to Next.js JSON message bundles."""
import json
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / "scripts" / "i18n-source"
OUT = ROOT / "web" / "messages"

LOCALES = {
    "en": "SharedResources.resx",
    "hi": "SharedResources.hi.resx",
    "te": "SharedResources.te.resx",
    "ta": "SharedResources.ta.resx",
    "kn": "SharedResources.kn.resx",
    "ml": "SharedResources.ml.resx",
}

def parse_resx(path: Path) -> dict[str, str]:
    tree = ET.parse(path)
    root = tree.getroot()
    messages: dict[str, str] = {}
    for data in root.findall("data"):
        name = data.attrib.get("name")
        if not name:
            continue
        value_el = data.find("value")
        messages[name] = (value_el.text or "") if value_el is not None else ""
    return messages


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for locale, filename in LOCALES.items():
        path = RES / filename
        if not path.exists():
            raise SystemExit(f"Missing {path}")
        data = parse_resx(path)
        out_path = OUT / f"{locale}.json"
        out_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Wrote {len(data)} keys -> {out_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
