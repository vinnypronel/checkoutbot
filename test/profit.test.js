import assert from "node:assert/strict";
import test from "node:test";
import { estimateProfit } from "../src/profit.js";

test("calculates fees, net profit, and ROI", () => {
  const result = estimateProfit({ retailPrice: 40, resaleValue: 80, feeRate: 0.13, shippingCost: 8 });
  assert.equal(result.marketplaceFees, 10.4);
  assert.equal(result.netProceeds, 61.6);
  assert.equal(result.profit, 21.6);
  assert.equal(result.roiPercent, 54);
});

test("returns null for incomplete market data", () => {
  assert.equal(estimateProfit({ retailPrice: 40, resaleValue: null }), null);
});
