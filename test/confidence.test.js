import assert from "node:assert/strict";
import test from "node:test";
import { combineConfidence, scoreObservation } from "../src/confidence.js";

const now = new Date("2026-11-05T17:00:00Z");

test("fresh receipt confirmation outranks a retailer feed", () => {
  const common = { observedAt: "2026-11-05T16:50:00Z", exactStore: true, exactProduct: true };
  assert.ok(
    scoreObservation({ ...common, sourceType: "receipt" }, now) >
    scoreObservation({ ...common, sourceType: "retailer_feed" }, now)
  );
});

test("old reports decay instead of remaining actionable", () => {
  const report = { sourceType: "community_photo", exactStore: true, exactProduct: true };
  const fresh = scoreObservation({ ...report, observedAt: "2026-11-05T16:50:00Z" }, now);
  const old = scoreObservation({ ...report, observedAt: "2026-11-03T16:50:00Z" }, now);
  assert.ok(fresh > old);
});

test("independent confirmations combine into high confidence", () => {
  const observations = [
    { sourceType: "community_photo", observedAt: "2026-11-05T16:50:00Z", exactStore: true, exactProduct: true, reporterId: "a" },
    { sourceType: "receipt", observedAt: "2026-11-05T16:55:00Z", exactStore: true, exactProduct: true, reporterId: "b" },
  ];
  const result = combineConfidence(observations, now);
  assert.equal(result.label, "high confidence");
  assert.ok(result.score >= 85);
});

