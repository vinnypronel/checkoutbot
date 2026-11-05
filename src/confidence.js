const SOURCE_WEIGHT = {
  retailer_feed: 0.35,
  public_social_report: 0.4,
  community_text: 0.55,
  community_photo: 0.8,
  receipt: 0.9,
  staff_confirmation: 0.85,
};

function freshnessMultiplier(ageMinutes) {
  if (ageMinutes <= 30) return 1;
  if (ageMinutes <= 120) return 0.85;
  if (ageMinutes <= 360) return 0.65;
  if (ageMinutes <= 1440) return 0.35;
  return 0.1;
}

export function scoreObservation(observation, now = new Date()) {
  const observedAt = new Date(observation.observedAt);
  const ageMinutes = Math.max(0, (now - observedAt) / 60000);
  let score = (SOURCE_WEIGHT[observation.sourceType] ?? 0.2) * freshnessMultiplier(ageMinutes);
  if (observation.exactStore) score += 0.08;
  if (observation.exactProduct) score += 0.07;
  if (observation.quantityObserved > 0) score += 0.05;
  return Math.min(1, Math.max(0, score));
}

export function combineConfidence(observations, now = new Date()) {
  if (!observations.length) return { score: 0, label: "unverified", reasons: [] };
  const scores = observations.map((item) => scoreObservation(item, now));
  const independentSources = new Set(observations.map((item) => item.reporterId || item.sourceUrl));
  let combined = 1 - scores.reduce((remaining, score) => remaining * (1 - score), 1);
  if (independentSources.size >= 2) combined = Math.min(1, combined + 0.08);
  const score = Math.round(combined * 100);
  const label = score >= 85 ? "high confidence" : score >= 60 ? "probable" : score >= 35 ? "possible" : "weak signal";
  return {
    score,
    label,
    reasons: [
      `${observations.length} observation${observations.length === 1 ? "" : "s"}`,
      `${independentSources.size} independent source${independentSources.size === 1 ? "" : "s"}`,
    ],
  };
}

