const OUTCOMES = new Set(["in_stock", "out_of_stock"]);

export function storeKey(observation) {
  return [
    observation.retailer,
    observation.storeNumber || "",
    observation.address,
    observation.city,
    observation.state,
    observation.zipCode,
  ].map((value) => String(value || "").trim().toLowerCase()).join("|");
}

export function validateFieldObservations(observations) {
  const errors = [];
  const seen = new Set();
  observations.forEach((observation, index) => {
    const label = `observation ${index + 1}`;
    for (const field of ["retailer", "address", "city", "state", "zipCode", "productLabel", "observedDate", "sourceType"]) {
      if (!observation[field]) errors.push(`${label} is missing ${field}`);
    }
    if (!OUTCOMES.has(observation.outcome)) errors.push(`${label} has invalid outcome`);
    if (observation.exactProduct && !observation.productId) {
      errors.push(`${label} claims an exact product without productId`);
    }
    const visitKey = `${storeKey(observation)}|${observation.observedDate}|${observation.productLabel}`;
    if (seen.has(visitKey)) errors.push(`${label} duplicates an existing store visit`);
    seen.add(visitKey);
  });
  return errors;
}

