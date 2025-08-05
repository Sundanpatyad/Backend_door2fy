// service/servicePlansService.js
import {
  findLatest,
  upsertBulk,
  bulkGetByType,
} from "../repository/servicePlansRepository.js";

export const getLatestPlans = async () => {
  const doc = await findLatest();
  if (!doc) {
    return { Booking: [], Quick: [] };
  }
  return doc;
};

/**
 * payload: array of objects like { Booking: [...], Quick: [...] }
 */
export const bulkUpsertPlans = async (payload) => {
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error("Payload must be a non-empty array");
  }
  // Could add deeper validation here if needed
  return upsertBulk(payload);
};

export const getPlans = async (opts) => {
  // opts: { type, page, limit }
  return bulkGetByType(opts);
};
