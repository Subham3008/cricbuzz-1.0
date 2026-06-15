import { StatusCodes } from "http-status-codes";
import * as playingXiService from "./playingXi.service.js";

/**
 * Controller Layer — Playing XI
 * -----------------------------------------------------------------------
 * Thin HTTP adapters. No try/catch — asyncHandler handles errors.
 * -----------------------------------------------------------------------
 */

/**
 * POST /api/match/:matchId/playing-xi
 * Select playing XI for both teams.
 * Access: SUPER_ADMIN | ADMIN | SCORER
 */
export const selectPlayingXI = async (req, res) => {
  const match = await playingXiService.selectPlayingXI(
    req.params.matchId,
    req.body,
    req.user._id
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    data: match,
  });
};

/**
 * GET /api/match/:matchId/playing-xi
 * Get playing XI for a match.
 * Access: Public
 */
export const getPlayingXI = async (req, res) => {
  const playingXI = await playingXiService.getPlayingXI(req.params.matchId);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: playingXI,
  });
};