import { StatusCodes } from "http-status-codes";
import * as commentaryService from "./commentary.service.js";

/**
 * Controller Layer — Commentary
 * -----------------------------------------------------------------------
 * Thin HTTP adapters. No try/catch — asyncHandler handles errors.
 * -----------------------------------------------------------------------
 */

/**
 * POST /api/commentary
 * Add ball commentary (match must be LIVE).
 * Access: SUPER_ADMIN | ADMIN | SCORER
 */
export const addCommentary = async (req, res) => {
  const commentary = await commentaryService.addCommentary(
    req.body,
    req.user._id
  );

  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: commentary,
  });
};

/**
 * GET /api/commentary/match/:matchId
 * Get paginated commentary for a match.
 * Query: ?page=1&limit=50
 * Access: Public
 */
export const getCommentary = async (req, res) => {
  const { items, pagination } = await commentaryService.getCommentary(
    req.params.matchId,
    req.query
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    count: items.length,
    pagination,
    data: items,
  });
};

/**
 * DELETE /api/commentary/:id
 * Delete a commentary entry.
 * Access: SUPER_ADMIN | ADMIN | SCORER
 */
export const deleteCommentary = async (req, res) => {
  const commentary = await commentaryService.deleteCommentary(req.params.id);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: commentary,
  });
};