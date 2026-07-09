# FinYatra

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![PWA](https://img.shields.io/badge/PWA-enabled-5A0FC8)](https://web.dev/progressive-web-apps/)
[![Languages](https://img.shields.io/badge/Languages-6-blue)](web/messages/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Your journey to smarter finances starts here.**

FinYatra is a free, India-first personal finance web app. It helps people **without a finance background** plan goals using interactive calculators, plain-language explanations, and worked examples — in **six Indian languages**.

> **Disclaimer:** FinYatra is for education and planning only. It is not financial, tax, or investment advice. Verify important decisions with qualified professionals and official sources.

**Live:** [finyatra.com](https://finyatra.vercel.app) · **Repo:** [github.com/nuthanm/FinYatra](https://github.com/nuthanm/FinYatra)

---

## Table of contents

- [Features](#features)
- [Calculators](#calculators)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Deploy on Vercel](#deploy-on-vercel)
- [Localization](#localization)
- [Contributing](#contributing)
- [License & attributions](#license--attributions)

---

## Features

- **Goal-first calculators** with formulas, worked examples, and scenario comparisons
- **Mobile-first UI** with installable PWA support
- **6 languages:** English, Hindi, Telugu, Tamil, Kannada, Malayalam
- **Secure contact form** — captcha, honeypot, rate limiting, SMTP delivery
- **Shareable results** — copy summary blocks as screenshots
- **No login, no paywall** — all tools run in the browser

---

## Calculators

| Group | Live | Coming soon |
|-------|------|-------------|
| **Planning** | Goal Planner, FIRE, FD Laddering | — |
| **Investing** | SIP | CAGR, Lumpsum |
| **Loans** | EMI | Mortgage |
| **Basics** | Inflation | Compound Interest |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript, React 19 |
| Styling | Custom CSS (`finyatra.css`) |
| i18n | JSON message bundles (`web/messages/`) |
| Contact API | Next.js Route Handlers + Nodemailer |
| Hosting | [Vercel](https://vercel.com/) |

---

## Project structure

```
FinYatra/
├── web/                    # Next.js application (production app)
│   ├── app/                # Routes + API (/api/contact, /api/contact-captcha)
│   ├── components/         # UI shell, calculators, pages
│   ├── lib/                # Finance math, contact, i18n, config
│   ├── messages/           # Translations (en, hi, te, ta, kn, ml)
│   └── public/             # CSS, icons, PWA assets
├── scripts/
│   ├── i18n-source/        # Archived .resx files (optional re-export)
│   ├── resx-to-json.py     # Export .resx → web/messages/*.json
│   └── check-messages-parity.py
├── LICENSE
└── README.md
```

---

## Quick start

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- npm 10+
- *(Optional)* Gmail with an [App Password](https://myaccount.google.com/apppasswords) for the contact form

### Run locally

```bash
git clone https://github.com/nuthanm/FinYatra.git
cd FinYatra/web
cp .env.example .env.local   # then edit SMTP + captcha secret
npm install
npm run dev
```

Open **http://localhost:3000**

### Useful scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run dev:clean` | Delete `.next` cache and start dev |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run i18n:check` | Verify all locale JSON files have matching keys |
| `npm run i18n:sync` | Re-export messages from `scripts/i18n-source/*.resx` |

### Troubleshooting dev server

If you see missing `.next` manifest errors (`ENOENT`), stop all dev servers and run:

```bash
npm run dev:clean
```

Do **not** run `npm run build` while `npm run dev` is active — both write to `.next` and can corrupt the cache.

---

## Environment variables

Copy `web/.env.example` to `web/.env.local`. Required for the contact form:

| Variable | Description |
|----------|-------------|
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail App Password (spaces are OK) |
| `SMTP_MAIL_TO` | Inbox that receives contact messages |
| `CONTACT_CAPTCHA_SECRET` | Long random string for captcha HMAC |
| `CONTACT_ALLOWED_ORIGINS` | Comma-separated allowed origins |

Optional: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM`, rate-limit settings.

---

## Deploy on Vercel

1. Import the GitHub repo in [Vercel](https://vercel.com/new).
2. **Critical:** Project → **Settings** → **General** → **Root Directory** → set to **`web`** → Save.
3. Add environment variables from `web/.env.example` (Project → Settings → Environment Variables).
4. **Redeploy** (Deployments → ⋯ → Redeploy).

> If you see a Vercel **404: NOT_FOUND** page, Root Directory is almost certainly still empty (repo root). The app must build from `web/`.

Include your Vercel URL in `CONTACT_ALLOWED_ORIGINS` (e.g. `https://fin-yatra.vercel.app`) or rely on automatic `*.vercel.app` allowance for previews.

---

## Localization

User-facing strings live in `web/messages/{locale}.json` (714 keys × 6 locales).

- **Edit translations:** change the JSON files directly, then run `npm run i18n:check`.
- **Re-export from .resx:** update files in `scripts/i18n-source/`, then `npm run i18n:sync`.

---

## Contributing

Contributions welcome — calculators, translations, bug fixes, and docs.

1. Fork the repo and create a branch from `main`.
2. Make focused changes; match existing code style.
3. Run `npm run build` and `npm run i18n:check` from `web/`.
4. Open a PR with a clear summary and screenshots for UI changes.

**Guidelines**

| Topic | Guideline |
|-------|-----------|
| Strings | Add keys to all 6 `web/messages/*.json` files |
| Calculators | Put math in `web/lib/finance/`; keep pages thin |
| Secrets | Never commit `.env.local` or credentials |
| Copy | Keep explanations simple; mark estimates clearly |

[Open an issue](https://github.com/nuthanm/FinYatra/issues) for bugs or feature requests.

---

## License & attributions

Licensed under the [MIT License](LICENSE). Copyright © 2026 [Nuthan Murarysetty](https://github.com/nuthanm).

| Resource | Use | License |
|----------|-----|---------|
| [Lucide](https://lucide.dev) / [Feather](https://feathericons.com) | Inline SVG icons | ISC / MIT |
| [Inter](https://rsms.me/inter/) | UI typeface | [SIL OFL 1.1](https://scripts.sil.org/OFL) |
| [Noto Sans](https://fonts.google.com/noto) | Regional scripts | [SIL OFL 1.1](https://scripts.sil.org/OFL) |
| [Next.js](https://nextjs.org/) | App framework | MIT |

Brand assets in `web/public/assets/` are project-specific — do not redistribute separately without permission.

---

## Author

**Nuthan Murarysetty** — [@nuthanm](https://github.com/nuthanm) · [inbox.nuthan@gmail.com](mailto:inbox.nuthan@gmail.com)

---

## Roadmap

- [ ] CAGR, Lumpsum, Mortgage, Compound Interest calculators
- [ ] CI workflow (build + i18n parity on pull requests)
- [ ] Additional planning tools (SWP, tax-aware estimates)
