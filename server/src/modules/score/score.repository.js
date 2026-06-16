import scoreModel from "../../models/score.model.js";

/**
 * Repository Layer — Score
 * -----------------------------------------------------------------------
 * Pure Mongoose data-access. No business logic, no HTTP knowledge.
 * -----------------------------------------------------------------------
 */

/**
 * Create a new score document.
 * @param {object} data
 * @returns {Promise<object>}
 */
export const create = (data) =>
  scoreModel.create(data);

/**
 * Find all scores for a match.
 * @param {string} matchId
 * @returns {Promise<object[]>}
 */
export const findByMatchId = (matchId) =>
  scoreModel
    .find({ matchId })
    .populate("battingTeam", "name shortName logo")
    .sort({ innings: 1 });

/**
 * Find score by ID.
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export const findById = (id) =>
  scoreModel
    .findById(id)
    .populate("battingTeam", "name shortName logo");

/**
 * Find score by matchId and innings number.
 * @param {string} matchId
 * @param {number} innings
 * @returns {Promise<object|null>}
 */
export const findByMatchAndInnings = (matchId, innings) =>
  scoreModel.findOne({ matchId, innings });

/**
 * Update score by ID.
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object|null>}
 */
export const updateById = (id, data) =>
  scoreModel
    .findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate("battingTeam", "name shortName logo");