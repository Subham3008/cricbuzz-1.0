import express from "express";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import { authMiddleware, authorizeRoles } from "../../shared/middlewares/auth.middleware.js";
import { ROLES } from "../../shared/constants/role.js";
import * as playingXiController from "./playingXi.controller.js";

/**
 * Playing XI Routes
 * -----------------------------------------------------------------------
 * Mounted at /api/match/:matchId/playing-xi in app.js
 *
 * GET  /api/match/:matchId/playing-xi  — Public
 * POST /api/match/:matchId/playing-xi  — SUPER_ADMIN | ADMIN | SCORER
 *
 * mergeParams: true — matchId parent route se milta hai
 * -----------------------------------------------------------------------
 */

const router = express.Router({ mergeParams: true });

/**
 * GET /api/match/:matchId/playing-xi
 * Get playing XI for a match.
 * Access: Public
 */
router.get(
  "/",
  asyncHandler(playingXiController.getPlayingXI)
);

/**
 * POST /api/match/:matchId/playing-xi
 * Select playing XI for both teams.
 * Access: SUPER_ADMIN | ADMIN | SCORER
 */
router.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SCORER),
  asyncHandler(playingXiController.selectPlayingXI)
);

export default router;