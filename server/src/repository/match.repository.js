import matchModel from "../models/match.model.js";

/**
 * Repository Layer — Match
 * -----------------------------------------------------------------------
 * Pure Mongoose data-access functions. No business logic, no HTTP
 * knowledge, no error throwing beyond what Mongoose itself throws.
 * Every query filters isDeleted: false to enforce the soft-delete pattern.
 * -----------------------------------------------------------------------
 */

/**
 * Create a new match document.
 * @param {object} data - Match fields
 * @returns {Promise<object>} created match document
 */
export const create = async (data) => {
  const match = await matchModel.create(data);
  return matchModel
    .findById(match._id)
    .populate("seriesId", "name")
    .populate("team1", "name shortName")
    .populate("team2", "name shortName");
};

/**
 * Find all active (non-deleted) matches.
 * @param {object} filter - additional query filters
 * @returns {Promise<object[]>} array of match documents
 */
export const findAll = (filter = {}) =>
  matchModel
    .find({ isDeleted: false, ...filter })
    .populate("seriesId", "name")
    .populate("team1", "name shortName")
    .populate("team2", "name shortName")
    .populate("tossWinner", "name shortName")
    .populate("winner", "name shortName")
    .sort({ startTime: -1 });

/**
 * Find a single active match by its ID.
 * @param {string} id - Match ObjectId
 * @returns {Promise<object|null>} match document or null
 */
export const findById = (id) =>
  matchModel
    .findOne({ _id: id, isDeleted: false })
    .populate("seriesId", "name")
    .populate("team1", "name shortName")
    .populate("team2", "name shortName")
    .populate("tossWinner", "name shortName")
    .populate("winner", "name shortName")
    .populate("playingXI.team1.player", "name role")
    .populate("playingXI.team2.player", "name role");

/**
 * Update a match by ID and return the updated document.
 * @param {string} id - Match ObjectId
 * @param {object} data - Fields to update
 * @returns {Promise<object|null>} updated match document or null
 */
export const updateById = (id, data) =>
  matchModel
    .findOneAndUpdate({ _id: id, isDeleted: false }, data, {
      new: true,
      runValidators: true,
    })
    .populate("seriesId", "name")
    .populate("team1", "name shortName")
    .populate("team2", "name shortName")
    .populate("tossWinner", "name shortName")
    .populate("winner", "name shortName");

/**
 * Soft-delete a match by ID (sets isDeleted: true).
 * @param {string} id - Match ObjectId
 * @param {string} updatedBy - User ObjectId performing the deletion
 * @returns {Promise<object|null>} soft-deleted match document or null
 */
export const softDeleteById = (id, updatedBy) =>
  matchModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, updatedBy },
    { new: true }
  );
