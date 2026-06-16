import express from "express";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import { authMiddleware, authorizeRoles } from "../../shared/middlewares/auth.middleware.js";
import { ROLES } from "../../shared/constants/role.js";
import * as scoreController from "./score.controller.js";

/**
 * Score Routes (/api/score)
 * -----------------------------------------------------------------------
 * POST   /api/score                  — Create innings score (LIVE match only)
 * PATCH  /api/score/:id             — Update innings score (LIVE match only)
 * GET    /api/score/match/:matchId  — Get all scores for a match
 *
 * NOTE: GET /match/:matchId pehle rakha hai — warna /:id match kar leta hai
 * -----------------------------------------------------------------------
 */

const router = express.Router();

/**
 * GET /api/score/match/:matchId
 * Get all scores for a match.
 * NOTE: /:id se pehle rakha hai — route conflict avoid karne ke liye
 */
router.get(
  "/match/:matchId",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SCORER),
  asyncHandler(scoreController.getScoresByMatch)
);

/**
 * POST /api/score
 * Create innings score.
 * Access: SUPER_ADMIN | ADMIN | SCORER
 */
router.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SCORER),
  asyncHandler(scoreController.createScore)
);

/**
 * PATCH /api/score/:id
 * Update innings score.
 * Access: SUPER_ADMIN | ADMIN | SCORER
 */
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SCORER),
  asyncHandler(scoreController.updateScore)
);

export default router;