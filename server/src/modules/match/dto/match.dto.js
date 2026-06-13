// ─── Match DTOs (Data Transfer Objects) ────────────────────────────────────
// DTOs sit between the controller and the service layer.
// Their job is to pick ONLY the fields we actually need from req.body
// and transform them into a clean object the service can work with.
//
// This prevents unknown / malicious fields from leaking into our DB
// and keeps the service layer decoupled from the raw HTTP request shape.
// ────────────────────────────────────────────────────────────────────────────


/**
 * Build a DTO for creating a new match.
 * Extracts all required fields from the raw request payload
 * and coerces `startDate` into a proper Date object.
 *
 * @param {Object} payload - req.body after validation
 * @returns {Object} Clean match creation object
 */
export const createMatchDto = (payload) => {
  return {
    teamA: payload.teamA,
    teamB: payload.teamB,
    status: payload.status || "SCHEDULED",
    venue: payload.venue,
    format: payload.format,
    startDate: new Date(payload.startDate),
  };
};


/**
 * Build a DTO for updating an existing match.
 * Only includes fields that are actually present in the payload,
 * so we don't accidentally overwrite existing values with `undefined`.
 *
 * @param {Object} payload - req.body after validation
 * @returns {Object} Partial match update object
 */
export const updateMatchDto = (payload) => {
  const dto = {};

  if (payload.teamA) dto.teamA = payload.teamA;
  if (payload.teamB) dto.teamB = payload.teamB;
  if (payload.status) dto.status = payload.status;
  if (payload.venue) dto.venue = payload.venue;
  if (payload.format) dto.format = payload.format;
  if (payload.startDate) dto.startDate = new Date(payload.startDate);

  return dto;
};
