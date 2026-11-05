import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { validateFieldObservations } from "../src/observations.js";

test("seed field observations are valid and deduplicated", async () => {
  const data = JSON.parse(await readFile(new URL("../data/field-observations.json", import.meta.url)));
  assert.deepEqual(validateFieldObservations(data.observations), []);
  assert.equal(data.observations.length, 6);
  assert.equal(data.observations.filter((item) => item.outcome === "in_stock").length, 1);
  assert.equal(data.observations.filter((item) => item.outcome === "out_of_stock").length, 5);
});

test("exact product claims require a product identifier", () => {
  const errors = validateFieldObservations([{
    retailer: "Dollar General", address: "1 Main St", city: "Elizabeth", state: "NJ",
    zipCode: "07202", productLabel: "Pokemon item", outcome: "in_stock",
    observedDate: "2026-11-05", sourceType: "first_party_store_visit", exactProduct: true,
  }]);
  assert.ok(errors.some((error) => error.includes("without productId")));
});

