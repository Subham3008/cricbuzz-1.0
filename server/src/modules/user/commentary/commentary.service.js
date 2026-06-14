import * as commentaryRepository from "./commentary.repository.js";
import { ensureId, pagination } from "../shared/query.js";

/**
 * Service Layer — Commentary (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Paginated commentary feed for a match.
 * Default: 50 entries per page (ball-by-ball reverse order).
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * Match ke commentary fetch karo — paginated.
 * @param {string} matchId
 * @param {object} query - req.query (page, limit)
 * @returns {Promise<{ items, pagination }>}
 */
export const getCommentary = async (matchId, query) => {
  ensureId(matchId, "Match");

  const { page, limit, skip } = pagination(query, 50);

  const [items, total] = await Promise.all([
    commentaryRepository.findByMatchId(matchId, skip, limit),
    commentaryRepository.countByMatchId(matchId),
  ]);

  return {
    items,
    pagination: { page, limit, total },
  };
};