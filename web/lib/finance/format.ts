const inCulture = "en-IN";

export function inr(value: number, decimals = 0): string {
  const rounded = decimals > 0 ? value : Math.round(value);
  return (
    "₹ " +
    rounded.toLocaleString(inCulture, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
}

export function percent(value: number, decimals = 1): string {
  return value.toFixed(decimals) + "%";
}
