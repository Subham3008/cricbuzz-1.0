import * as commentaryRepository from "./commentary.repository.js";
import * as matchRepository from "../../repository/match.repository.js";
import { emitToMatch } from "../../sockets/socketGateway.js";
import NotFoundError from "../../shared/errors/NotFound.error.js";
import BadRequestError from "../../shared/errors/BadRequest.error.js";
import { MATCH_STATUS } from "../../shared/constants/matchStatus.js";

/**
 * Service Layer — Commentary
 * -----------------------------------------------------------------------
 * Ball-by-ball commentary ke liye business logic.
 * Match LIVE hona chahiye — warna commentary add nahi hogi.
 * Socket.IO se commentary.created event emit hota hai har entry pe.
 * -----------------------------------------------------------------------
 */

/**
 * Match LIVE hai ya nahi check karo.
 * @param {string} matchId
 * @returns {Promise<object>} match document
 * @throws {NotFoundError} | {BadRequestError}
 */
const ensureLiveMatch = async (matchId) => {
  const match = await matchRepository.findById(matchId);

  if (!match) throw new NotFoundError("Match not found");

  if (match.status !== MATCH_STATUS.LIVE) {
    throw new BadRequestError(
      `Commentary can only be added when match is LIVE — current: ${match.status}`
    );
  }

  return match;
};

/**
 * Add ball commentary.
 * @param {object} payload - { matchId, over, ball, text, type? }
 * @param {string} userId - audit
 * @returns {Promise<object>}
 */
export const addCommentary = async (payload, userId) => {
  await ensureLiveMatch(payload.matchId);

  const commentary = await commentaryRepository.create({
    ...payload,
    createdBy: userId,
    updatedBy: userId,
  });

  // ─── Socket.IO event ──────────────────────────────────────────────
  emitToMatch(payload.matchId, "commentary.created", commentary);

  return commentary;
};

/**
 * Get paginated commentary for a match.
 * @param {string} matchId
 * @param {object} query - { page?, limit? }
 * @returns {Promise<{ items, pagination }>}
 */
export const getCommentary = async (matchId, query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 50));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    commentaryRepository.findByMatchId(matchId, skip, limit),
    commentaryRepository.countByMatchId(matchId),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Delete a commentary entry (admin only — fix errors).
 * @param {string} id - Commentary ObjectId
 * @returns {Promise<object>}
 * @throws {NotFoundError}
 */
export const deleteCommentary = async (id) => {
  const commentary = await commentaryRepository.findById(id);

  if (!commentary) throw new NotFoundError("Commentary not found");

  return commentaryRepository.deleteById(id);
};