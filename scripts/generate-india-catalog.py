#!/usr/bin/env python3
"""Parse sum.money India tool list and emit catalog + i18n keys."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "uploads" / "in-0.md"
if not SOURCE.is_file():
    SOURCE = Path(
        r"C:\Users\NuthanMurarysetty\.cursor\projects\d-My-work-FinYatra\uploads\in-0.md"
    )

# Existing FinYatra tools — skip duplicates in India catalog
EXISTING_KEYS = {
    "goal",
    "fire",
    "fd",
    "sip",
    "cagr",
    "lumpsum",
    "emi",
    "mortgage",
    "inflation",
    "interest",
}

GROUP_MAP = {
    "tax": "Tax",
    "income": "Tax",
    "tds": "Tax",
    "tcs": "Tax",
    "gst": "Tax",
    "hra": "Tax",
    "ltcg": "Tax",
    "stcg": "Tax",
    "80": "Tax",
    "itr": "Tax",
    "nri": "Tax",
    "crypto": "Tax",
    "dividend": "Tax",
    "gift": "Tax",
    "freelancer": "Tax",
    "presumptive": "Tax",
    "advance": "Tax",
    "penalty": "Tax",
    "refund": "Tax",
    "notice": "Tax",
    "regime": "Tax",
    "dtaa": "Tax",
    "loan": "Loans",
    "emi": "Loans",
    "mortgage": "Loans",
    "lap": "Loans",
    "mudra": "Loans",
    "balance": "Loans",
    "prepay": "Loans",
    "car": "Loans",
    "bike": "Loans",
    "education": "Loans",
    "personal": "Loans",
    "business": "Loans",
    "gold-loan": "Loans",
    "nri-home": "Loans",
    "stand-up": "Loans",
    "debt-payoff": "Loans",
    "ppf": "Government",
    "nps": "Government",
    "epf": "Government",
    "epfo": "Government",
    "ssy": "Government",
    "sukanya": "Government",
    "scss": "Government",
    "nsc": "Government",
    "kvp": "Government",
    "mis": "Government",
    "apy": "Government",
    "pm": "Government",
    "e-shram": "Government",
    "da": "Government",
    "pay": "Government",
    "pension": "Government",
    "gratuity": "Government",
    "esi": "Government",
    "post-office": "Government",
    "mahila": "Government",
    "frsb": "Government",
    "ups": "Government",
    "pmay": "Government",
    "ayushman": "Government",
    "crop": "Government",
    "vishwakarma": "Government",
    "sip": "Investing",
    "swp": "Investing",
    "stp": "Investing",
    "mf": "Investing",
    "mutual": "Investing",
    "elss": "Investing",
    "cagr": "Investing",
    "xirr": "Investing",
    "nifty": "Investing",
    "fd": "Investing",
    "rd": "Investing",
    "gold": "Investing",
    "sgb": "Investing",
    "reit": "Investing",
    "ulip": "Investing",
    "fire": "Planning",
    "retirement": "Planning",
    "goal": "Planning",
    "emergency": "Planning",
    "budget": "Planning",
    "net-worth": "Planning",
    "child": "Planning",
    "marriage": "Planning",
    "salary": "Salary",
    "bonus": "Salary",
    "leave": "Salary",
    "maternity": "Salary",
    "notice": "Salary",
    "in-hand": "Salary",
    "employee": "Salary",
    "brokerage": "Salary",
    "property": "Property",
    "stamp": "Property",
    "rent": "Property",
    "real-estate": "Property",
    "registration": "Property",
    "renovation": "Property",
    "rental": "Property",
    "insurance": "Insurance",
    "lic": "Insurance",
    "health": "Insurance",
    "car-insurance": "Insurance",
    "motor": "Insurance",
    "term": "Insurance",
    "home-insurance": "Insurance",
    "inflation": "Basics",
    "compound": "Basics",
    "simple": "Basics",
    "age": "Basics",
    "forex": "Basics",
    "electricity": "Basics",
    "water": "Basics",
    "power": "Basics",
    "credit-score": "Basics",
}


def slugify(title: str) -> str:
    t = re.sub(r"\s+FY\s+\d{4}-\d{2}", "", title, flags=re.I)
    t = re.sub(r"\s+Calculator.*$", "", t, flags=re.I)
    t = re.sub(r"\s+Checker.*$", "", t, flags=re.I)
    t = re.sub(r"\s+Selector.*$", "", t, flags=re.I)
    t = re.sub(r"[^a-zA-Z0-9]+", "-", t.strip().lower())
    t = re.sub(r"-+", "-", t).strip("-")
    return t or "tool"


def guess_group(key: str, title: str) -> str:
    for prefix, group in GROUP_MAP.items():
        if key.startswith(prefix) or prefix in key:
            return group
    lower = title.lower()
    if any(w in lower for w in ("tax", "tds", "tcs", "gst", "section", "itr")):
        return "Tax"
    if any(w in lower for w in ("loan", "emi", "mortgage")):
        return "Loans"
    if any(w in lower for w in ("ppf", "nps", "epf", "government", "pension", "pm-")):
        return "Government"
    if any(w in lower for w in ("salary", "ctc", "bonus", "gratuity")):
        return "Salary"
    if any(w in lower for w in ("insurance", "lic", "premium")):
        return "Insurance"
    if any(w in lower for w in ("property", "rent", "stamp", "home")):
        return "Property"
    if any(w in lower for w in ("sip", "mutual", "invest", "fd", "gold")):
        return "Investing"
    return "Basics"


def guess_icon(key: str) -> str:
    if "tax" in key or "gst" in key or "tds" in key:
        return "file"
    if "loan" in key or "emi" in key:
        return "card"
    if "insurance" in key or "lic" in key:
        return "shield"
    if "property" in key or "home" in key or "rent" in key:
        return "bank"
    if "salary" in key or "bonus" in key:
        return "briefcase"
    if "ppf" in key or "nps" in key or "epf" in key or "gov" in key:
        return "landmark"
    if "sip" in key or "mf" in key or "mutual" in key:
        return "trending-up"
    return "percent"


def parse_tools(text: str) -> list[dict]:
    # Line 14 contains all tools concatenated
    blob = ""
    for line in text.splitlines():
        if "Calculator" in line or "Checker" in line or "Selector" in line:
            if len(line) > len(blob):
                blob = line

    parts = re.split(
        r"(?=[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F680-\U0001F6FF₿])",
        blob,
    )
    tools: list[dict] = []
    seen: set[str] = set()

    for part in parts:
        part = part.strip()
        if not part:
            continue
        m = re.match(
            r"^[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F680-\U0001F6FF₿]\s*(.+?)\s+((?:See |Calculate |Estimate |Project |Add |Generate |Compare |Check |Plan |Track |Model |Convert |Identify |Match |Borrow |Offset |Simulate |Visualize |Is |Which |When |Should |Do you |How much |How long |Side-by-side|Quarterly|State-wise|City-wise|INR to|Loan on|Tax on|Tax saving|Monthly |Future |Exact |Gross |Composition|Regular |Systematic |One-time |Fixed |Recurring |Long-term|Short-term|Offset |Borrow |Save by|Wedding |Housing |Higher |Unorganised |Firm-level|Tax-free|Tax saving|₹).+)$",
            part,
            re.S,
        )
        if not m:
            # fallback: split on Calculator/Checker/Selector
            m2 = re.match(
                r"^[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F680-\U0001F6FF₿]?\s*(.+?(?:Calculator|Checker|Selector)(?:\s+FY\s+\d{4}-\d{2})?)\s+(.+)$",
                part,
            )
            if not m2:
                continue
            title, desc = m2.group(1).strip(), m2.group(2).strip()
        else:
            title, desc = m.group(1).strip(), m.group(2).strip()

        if not title.endswith(("Calculator", "Checker", "Selector")):
            if "Calculator" in title:
                pass
            elif "Checker" in title:
                pass
            elif "Selector" in title:
                pass
            else:
                title = title + " Calculator"

        key = slugify(title)
        if key in seen or key in EXISTING_KEYS:
            continue
        seen.add(key)

        group = guess_group(key, title)
        tools.append(
            {
                "key": key,
                "title": title if title.endswith(("Calculator", "Checker", "Selector")) else title,
                "description": desc[:200],
                "group": group,
                "icon": guess_icon(key),
            }
        )

    return tools


def main() -> int:
    if not SOURCE.is_file():
        print(f"Missing source: {SOURCE}", file=sys.stderr)
        return 1

    text = SOURCE.read_text(encoding="utf-8")
    tools = parse_tools(text)
    print(f"Parsed {len(tools)} India tools")

    out_dir = ROOT / "web" / "lib" / "config" / "tools"
    out_dir.mkdir(parents=True, exist_ok=True)

    lines = [
        'import type { ToolLink } from "@/lib/types";',
        "",
        "/** India-specific tools inspired by public calculator categories (FY 2025-26). */",
        "export const INDIA_TOOLS: ToolLink[] = [",
    ]
    for t in tools:
        lines.append(
            f'  {{ key: "{t["key"]}", titleKey: "Tool_{t["key"].replace("-", "_")}_Title", '
            f'route: "/calc/{t["key"]}", group: "{t["group"]}", '
            f'descriptionKey: "Tool_{t["key"].replace("-", "_")}_Description", '
            f'icon: "{t["icon"]}", comingSoon: true, region: "in" }},'
        )
    lines.append("];")
    lines.append("")

    catalog_path = out_dir / "india-catalog.ts"
    catalog_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {catalog_path}")

    # i18n keys
    keys: dict[str, str] = {}
    for t in tools:
        k = t["key"].replace("-", "_")
        keys[f"Tool_{k}_Title"] = t["title"]
        keys[f"Tool_{k}_Description"] = t["description"]

    i18n_path = out_dir / "india-i18n-en.json"
    i18n_path.write_text(json.dumps(keys, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {i18n_path} ({len(keys)} keys)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
