export function estimateProfit({ retailPrice, resaleValue, feeRate = 0.1325, shippingCost = 0 }) {
  if (![retailPrice, resaleValue, feeRate, shippingCost].every(Number.isFinite)) return null;
  const money = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
  const marketplaceFees = money(resaleValue * feeRate);
  const netProceeds = money(resaleValue - marketplaceFees - shippingCost);
  const profit = money(netProceeds - retailPrice);
  return {
    marketplaceFees,
    netProceeds,
    profit,
    roiPercent: retailPrice > 0 ? money((profit / retailPrice) * 100) : null,
  };
}
