/**
 * Match DTOs (Data Transfer Objects)
 * -----------------------------------------------------------------------
 * Whitelist fields from req.body before passing to the service layer.
 * Keep in sync with match.validator.js whenever fields are added/removed.
 * -----------------------------------------------------------------------
 */

/**
 * Build a DTO for creating a new match.
 * @param {Object} payload - req.body
 * @returns {Object} Clean match creation object
 */
export const createMatchDto = (payload) => {
  const dto = {
    seriesId: payload.seriesId,
    venue: payload.venue,
    startTime: new Date(payload.startTime),
    team1: payload.team1,
    team2: payload.team2,
  };

  if (payload.matchNumber !== undefined) dto.matchNumber = payload.matchNumber;
  if (payload.status !== undefined) dto.status = payload.status;
  if (payload.tossWinner !== undefined) dto.tossWinner = payload.tossWinner;
  if (payload.tossDecision !== undefined) dto.tossDecision = payload.tossDecision;
  if (payload.playingXI !== undefined) dto.playingXI = payload.playingXI;
  if (payload.winner !== undefined) dto.winner = payload.winner;
  if (payload.result !== undefined) dto.result = payload.result;

  return dto;
};

/**
 * Build a DTO for updating an existing match.
 * Only includes fields that are actually present in the payload.
 * @param {Object} payload - req.body
 * @returns {Object} Partial match update object
 */
export const updateMatchDto = (payload) => {
  const dto = {};

  if (payload.seriesId !== undefined) dto.seriesId = payload.seriesId;
  if (payload.matchNumber !== undefined) dto.matchNumber = payload.matchNumber;
  if (payload.venue !== undefined) dto.venue = payload.venue;
  if (payload.startTime !== undefined) dto.startTime = new Date(payload.startTime);
  if (payload.status !== undefined) dto.status = payload.status;
  if (payload.team1 !== undefined) dto.team1 = payload.team1;
  if (payload.team2 !== undefined) dto.team2 = payload.team2;
  if (payload.tossWinner !== undefined) dto.tossWinner = payload.tossWinner;
  if (payload.tossDecision !== undefined) dto.tossDecision = payload.tossDecision;
  if (payload.playingXI !== undefined) dto.playingXI = payload.playingXI;
  if (payload.winner !== undefined) dto.winner = payload.winner;
  if (payload.result !== undefined) dto.result = payload.result;

  return dto;
};
