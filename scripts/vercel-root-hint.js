#!/usr/bin/env node
/**
 * Runs when Vercel builds from the repository root without Root Directory = web.
 * Fails the deploy with a clear message instead of a silent 404.
 */
const message = `
FinYatra deploy misconfiguration
================================

Vercel is building from the repo root, but the Next.js app lives in web/.

Fix (takes ~30 seconds):
  1. Vercel Dashboard → your project → Settings → General
  2. Root Directory → set to: web
  3. Save → Deployments → Redeploy

Also add environment variables from web/.env.example (SMTP, CONTACT_CAPTCHA_SECRET, etc.).
`;

console.error(message);
process.exit(1);
