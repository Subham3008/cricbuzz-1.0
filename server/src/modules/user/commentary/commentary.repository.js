import CommentaryModel from "../../../models/commentry.model.js";

/**
 * Repository Layer — Commentary (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Paginated reverse-chronological commentary feed.
 * Index on {matchId, createdAt:-1} efficient queries ensure karta hai.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * Match ke commentary fetch karo — paginated, reverse-chronological.
 * @param {string} matchId
 * @param {number} skip
 * @param {number} limit
 * @returns {Promise<object[]>}
 */
export const findByMatchId = (matchId, skip, limit) =>
  CommentaryModel.find({ matchId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

/**
 * Match ke total commentary count fetch karo — pagination ke liye.
 * @param {string} matchId
 * @returns {Promise<number>}
 */
export const countByMatchId = (matchId) =>
  CommentaryModel.countDocuments({ matchId });