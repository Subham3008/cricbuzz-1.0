import * as teamRepository from "../../repository/team.repository.js";
// import * as playerRepository from "../../player/player.repository.js";
import NotFoundError from "../../shared/errors/NotFound.error.js";
import ConflictError from "../../shared/errors/conflict.error.js";

/**
 * Service Layer — Team
 * -----------------------------------------------------------------------
 * All business logic for team management: uniqueness validation,
 * squad operations, and cross-module coordination (player existence
 * checks). Throws AppError subclasses on failure; never touches
 * req/res directly.
 * -----------------------------------------------------------------------
 */

/**
 * Create a new team.
 * Enforces uniqueness on both `name` and `shortName`.
 * @param {object} payload - { name, shortName, logo, primaryColor? }
 * @param {string} userId - ID of the user creating the team (audit)
 * @returns {Promise<object>} created team document
 * @throws {ConflictError} if name or shortName already in use
 */
export const createTeam = async (payload, userId) => {
  const existing = await teamRepository.findByNameOrShortName(
    payload.name,
    payload.shortName
  );

  if (existing) {
    throw new ConflictError("A team with this name or short name already exists");
  }

  return teamRepository.create({
    ...payload,
    createdBy: userId,
    updatedBy: userId,
  });
};

/**
 * Update a team's details.
 * If name/shortName are being changed, re-checks uniqueness (excluding self).
 * @param {string} id - Team ObjectId
 * @param {object} payload - Partial team fields
 * @param {string} userId - ID of the user performing the update (audit)
 * @returns {Promise<object>} updated team document
 * @throws {NotFoundError} if team does not exist
 * @throws {ConflictError} if updated name/shortName collides with another team
 */
export const updateTeam = async (id, payload, userId) => {
  const team = await teamRepository.findById(id);

  if (!team) {
    throw new NotFoundError("Team not found");
  }

  if (payload.name || payload.shortName) {
    const existing = await teamRepository.findByNameOrShortName(
      payload.name ?? team.name,
      payload.shortName ?? team.shortName,
      id
    );

    if (existing) {
      throw new ConflictError("A team with this name or short name already exists");
    }
  }

  return teamRepository.updateById(id, { ...payload, updatedBy: userId });
};

/**
 * Soft-delete a team.
 * @param {string} id - Team ObjectId
 * @param {string} userId - ID of the user performing the deletion (audit)
 * @returns {Promise<object>} soft-deleted team document
 * @throws {NotFoundError} if team does not exist
 */
export const deleteTeam = async (id, userId) => {
  const team = await teamRepository.softDeleteById(id, userId);

  if (!team) {
    throw new NotFoundError("Team not found");
  }

  return team;
};

/**
 * Get a team's squad (populated player list).
 * @param {string} teamId - Team ObjectId
 * @returns {Promise<object[]>} array of player documents
 * @throws {NotFoundError} if team does not exist
 */
export const getSquad = async (teamId) => {
  const team = await teamRepository.findById(teamId);

  if (!team) {
    throw new NotFoundError("Team not found");
  }

  return team.squadPlayers;
};

/**
 * Add a player to a team's squad.
 * Verifies both the team and the player exist, then checks the player
 * is not already in the squad before performing the (idempotent) add.
 * @param {string} teamId - Team ObjectId
 * @param {string} playerId - Player ObjectId to add
 * @returns {Promise<object>} updated team document
 * @throws {NotFoundError} if team or player does not exist
 * @throws {ConflictError} if player is already in the squad
 */
export const addPlayerToSquad = async (teamId, playerId) => {
  const team = await teamRepository.findById(teamId);

  if (!team) {
    throw new NotFoundError("Team not found");
  }

  const playerExists = await playerRepository.exists(playerId);

  if (!playerExists) {
    throw new NotFoundError("Player not found");
  }

  const alreadyInSquad = team.squadPlayers.some(
    (player) => player._id.toString() === playerId
  );

  if (alreadyInSquad) {
    throw new ConflictError("Player is already in this team's squad");
  }

  return teamRepository.addPlayer(teamId, playerId);
};

/**
 * Remove a player from a team's squad.
 * @param {string} teamId - Team ObjectId
 * @param {string} playerId - Player ObjectId to remove
 * @returns {Promise<object>} updated team document
 * @throws {NotFoundError} if team does not exist
 */
export const removePlayerFromSquad = async (teamId, playerId) => {
  const teamExists = await teamRepository.exists(teamId);

  if (!teamExists) {
    throw new NotFoundError("Team not found");
  }

  return teamRepository.removePlayer(teamId, playerId);
};