import commentaryModel from "../../models/commentry.model.js";

/**
 * Repository Layer — Commentary
 * -----------------------------------------------------------------------
 * Pure Mongoose data-access. No business logic, no HTTP knowledge.
 * Index on {matchId, createdAt:-1} efficient reverse-chrono queries.
 * -----------------------------------------------------------------------
 */

/**
 * Create a new commentary entry.
 * @param {object} data
 * @returns {Promise<object>}
 */
export const create = (data) => commentaryModel.create(data);

/**
 * Find commentary by match — paginated, reverse-chronological.
 * @param {string} matchId
 * @param {number} skip
 * @param {number} limit
 * @returns {Promise<object[]>}
 */
export const findByMatchId = (matchId, skip, limit) =>
  commentaryModel
    .find({ matchId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

/**
 * Count total commentary entries for a match.
 * @param {string} matchId
 * @returns {Promise<number>}
 */
export const countByMatchId = (matchId) =>
  commentaryModel.countDocuments({ matchId });

/**
 * Find commentary by ID.
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export const findById = (id) => commentaryModel.findById(id);

/**
 * Delete commentary by ID.
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export const deleteById = (id) =>
  commentaryModel.findByIdAndDelete(id);