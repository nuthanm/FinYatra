/** ICE vs EV running-cost comparison + optional purchase-price payback. */

export type ElectricVehicleInput = {
  /** Fuel cost per km for ICE (₹/km). */
  iceCostPerKm: number;
  /** Electricity / charging cost per km for EV (₹/km). */
  evCostPerKm: number;
  kmPerMonth: number;
  years: number;
  /** Optional: how much more the EV costs to buy (₹). 0 = ignore payback. */
  purchasePriceDelta: number;
};

export type ElectricVehicleResult = {
  kmPerMonth: number;
  years: number;
  totalKm: number;
  iceTotalCost: number;
  evTotalCost: number;
  /** ICE − EV running cost (positive = EV cheaper to run). */
  runningSavings: number;
  purchasePriceDelta: number;
  /** Years to recover purchase delta from running savings; null if N/A. */
  paybackYears: number | null;
  /** Net advantage after purchase delta (positive = EV wins overall). */
  netAdvantage: number;
};

export function calculateElectricVehicle(input: ElectricVehicleInput): ElectricVehicleResult {
  const icePerKm = Math.max(0, input.iceCostPerKm);
  const evPerKm = Math.max(0, input.evCostPerKm);
  const kmPerMonth = Math.max(0, input.kmPerMonth);
  const years = Math.max(0, input.years);
  const totalKm = kmPerMonth * 12 * years;
  const iceTotalCost = icePerKm * totalKm;
  const evTotalCost = evPerKm * totalKm;
  const runningSavings = iceTotalCost - evTotalCost;
  const purchasePriceDelta = Math.max(0, input.purchasePriceDelta);
  const annualSaving = kmPerMonth * 12 * (icePerKm - evPerKm);
  const paybackYears =
    purchasePriceDelta > 0 && annualSaving > 0 ? purchasePriceDelta / annualSaving : null;
  const netAdvantage = runningSavings - purchasePriceDelta;

  return {
    kmPerMonth,
    years,
    totalKm,
    iceTotalCost,
    evTotalCost,
    runningSavings,
    purchasePriceDelta,
    paybackYears,
    netAdvantage,
  };
}
