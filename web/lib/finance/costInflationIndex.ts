/** Cost Inflation Index (CII) — indexed cost for capital gains (illustrative). */

export type CiiFy = string;

/** Small hardcoded CII table for recent financial years (base FY 2001-02 = 100). */
export const CII_TABLE: Record<CiiFy, number> = {
  "2017-18": 272,
  "2018-19": 280,
  "2019-20": 289,
  "2020-21": 301,
  "2021-22": 317,
  "2022-23": 331,
  "2023-24": 348,
  "2024-25": 363,
  "2025-26": 376,
};

export const CII_FY_OPTIONS = Object.keys(CII_TABLE) as CiiFy[];

export type CostInflationIndexResult = {
  cost: number;
  buyYear: CiiFy;
  sellYear: CiiFy;
  buyCii: number;
  sellCii: number;
  indexedCost: number;
  indexFactor: number;
};

export function getCii(fy: CiiFy): number | undefined {
  return CII_TABLE[fy];
}

/**
 * Indexed cost = cost × (CII of sell year / CII of buy year).
 * Used for long-term capital gains on assets acquired before the new LTCG rules.
 */
export function calculateIndexedCost(
  cost: number,
  buyYear: CiiFy,
  sellYear: CiiFy,
): CostInflationIndexResult {
  const c = Math.max(0, cost);
  const buyCii = CII_TABLE[buyYear] ?? 0;
  const sellCii = CII_TABLE[sellYear] ?? 0;
  const indexFactor = buyCii > 0 ? sellCii / buyCii : 0;
  const indexedCost = c * indexFactor;

  return {
    cost: c,
    buyYear,
    sellYear,
    buyCii,
    sellCii,
    indexedCost,
    indexFactor,
  };
}
