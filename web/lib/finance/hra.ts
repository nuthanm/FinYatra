/** HRA exemption under Section 10(13A) / Rule 2A. Old regime only. */

export type HraInput = {
  basicAnnual: number;
  hraReceivedAnnual: number;
  rentPaidAnnual: number;
  isMetro: boolean;
};

export type HraResult = {
  actualHra: number;
  rentMinus10PercentBasic: number;
  percentOfBasic: number;
  exemption: number;
  taxableHra: number;
  metroPercent: number;
};

export function calculateHraExemption(input: HraInput): HraResult {
  const basic = Math.max(0, input.basicAnnual);
  const hra = Math.max(0, input.hraReceivedAnnual);
  const rent = Math.max(0, input.rentPaidAnnual);
  const metroPercent = input.isMetro ? 50 : 40;

  const actualHra = hra;
  const rentMinus10PercentBasic = Math.max(0, rent - basic * 0.1);
  const percentOfBasic = basic * (metroPercent / 100);
  const exemption = Math.min(actualHra, rentMinus10PercentBasic, percentOfBasic);
  const taxableHra = Math.max(0, hra - exemption);

  return {
    actualHra,
    rentMinus10PercentBasic,
    percentOfBasic,
    exemption,
    taxableHra,
    metroPercent,
  };
}
