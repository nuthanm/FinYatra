/** Rent receipt summary amounts (not a PDF generator). */

export type RentReceiptInput = {
  monthlyRent: number;
  months: number;
  landlordName?: string;
  tenantName?: string;
  propertyAddress?: string;
};

export type RentReceiptMonthRow = {
  monthIndex: number;
  amount: number;
};

export type RentReceiptResult = {
  monthlyRent: number;
  months: number;
  totalRent: number;
  landlordName: string;
  tenantName: string;
  propertyAddress: string;
  rows: RentReceiptMonthRow[];
};

export function calculateRentReceipt(input: RentReceiptInput): RentReceiptResult {
  const monthlyRent = Math.max(0, input.monthlyRent);
  const months = Math.max(0, Math.min(120, Math.round(input.months)));
  const rows: RentReceiptMonthRow[] = [];
  for (let i = 1; i <= months; i++) {
    rows.push({ monthIndex: i, amount: monthlyRent });
  }
  return {
    monthlyRent,
    months,
    totalRent: monthlyRent * months,
    landlordName: (input.landlordName ?? "").trim(),
    tenantName: (input.tenantName ?? "").trim(),
    propertyAddress: (input.propertyAddress ?? "").trim(),
    rows,
  };
}
