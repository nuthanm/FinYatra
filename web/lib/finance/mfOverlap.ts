/** Simple mutual-fund holdings overlap (educational; not portfolio advice). */

export type Holding = {
  symbol: string;
  /** Optional weight 0–100. If missing for any holding, count-based overlap is used. */
  weight?: number;
};

export type MfOverlapInput = {
  fundA: Holding[];
  fundB: Holding[];
};

export type MfOverlapResult = {
  symbolsA: number;
  symbolsB: number;
  sharedCount: number;
  /** Overlap % — weighted min-sum if both sides have weights, else shared/union count. */
  overlapPercent: number;
  method: "weighted" | "count";
  sharedSymbols: string[];
};

function parseSymbol(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

/** Parse "RELIANCE:8, TCS, INFY:5" style lists. */
export function parseHoldingsList(text: string): Holding[] {
  const out: Holding[] = [];
  const seen = new Set<string>();
  for (const part of text.split(/[,;\n]+/)) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(":");
    let symbol: string;
    let weight: number | undefined;
    if (colon >= 0) {
      symbol = parseSymbol(trimmed.slice(0, colon));
      const w = Number(trimmed.slice(colon + 1).trim());
      weight = Number.isFinite(w) && w > 0 ? w : undefined;
    } else {
      symbol = parseSymbol(trimmed);
    }
    if (!symbol || seen.has(symbol)) continue;
    seen.add(symbol);
    out.push(weight !== undefined ? { symbol, weight } : { symbol });
  }
  return out;
}

export function calculateMfOverlap(input: MfOverlapInput): MfOverlapResult {
  const fundA = input.fundA.filter((h) => h.symbol);
  const fundB = input.fundB.filter((h) => h.symbol);
  const mapA = new Map(fundA.map((h) => [h.symbol, h]));
  const mapB = new Map(fundB.map((h) => [h.symbol, h]));
  const sharedSymbols = [...mapA.keys()].filter((s) => mapB.has(s)).sort();
  const sharedCount = sharedSymbols.length;
  const union = new Set([...mapA.keys(), ...mapB.keys()]).size;

  const allWeighted =
    fundA.length > 0 &&
    fundB.length > 0 &&
    fundA.every((h) => h.weight !== undefined && h.weight > 0) &&
    fundB.every((h) => h.weight !== undefined && h.weight > 0);

  if (allWeighted) {
    let overlap = 0;
    for (const sym of sharedSymbols) {
      const wa = mapA.get(sym)!.weight!;
      const wb = mapB.get(sym)!.weight!;
      overlap += Math.min(wa, wb);
    }
    return {
      symbolsA: fundA.length,
      symbolsB: fundB.length,
      sharedCount,
      overlapPercent: Math.min(100, overlap),
      method: "weighted",
      sharedSymbols,
    };
  }

  const overlapPercent = union > 0 ? (sharedCount / union) * 100 : 0;
  return {
    symbolsA: fundA.length,
    symbolsB: fundB.length,
    sharedCount,
    overlapPercent,
    method: "count",
    sharedSymbols,
  };
}
