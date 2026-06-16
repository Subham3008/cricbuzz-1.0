import { StatusCodes } from "http-status-codes";
import * as scoreService from "./score.service.js";

/**
 * Controller Layer — Score
 * -----------------------------------------------------------------------
 * Thin HTTP adapters. No try/catch — asyncHandler handles errors.
 * -----------------------------------------------------------------------
 */

/**
 * POST /api/score
 * Create innings score (match must be LIVE).
 * Access: SUPER_ADMIN | ADMIN | SCORER
 */
export const createScore = async (req, res) => {
  const score = await scoreService.createScore(req.body, req.user._id);

  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: score,
  });
};

/**
 * PATCH /api/score/:id
 * Update innings score (match must be LIVE).
 * Access: SUPER_ADMIN | ADMIN | SCORER
 */
export const updateScore = async (req, res) => {
  const score = await scoreService.updateScore(
    req.params.id,
    req.body,
    req.user._id
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    data: score,
  });
};

/**
 * GET /api/score/match/:matchId
 * Get all scores for a match.
 * Access: Any authenticated
 */
export const getScoresByMatch = async (req, res) => {
  const scores = await scoreService.getScoresByMatch(req.params.matchId);

  return res.status(StatusCodes.OK).json({
    success: true,
    count: scores.length,
    data: scores,
  });
};