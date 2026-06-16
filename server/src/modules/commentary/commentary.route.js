import express from "express";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import { authMiddleware, authorizeRoles } from "../../shared/middlewares/auth.middleware.js";
import { ROLES } from "../../shared/constants/role.js";
import * as commentaryController from "./commentary.controller.js";

/**
 * Commentary Routes (/api/commentary)
 * -----------------------------------------------------------------------
 * POST   /api/commentary                    — Add ball commentary
 * GET    /api/commentary/match/:matchId     — Paginated commentary feed
 * DELETE /api/commentary/:id               — Delete entry (fix errors)
 *
 * NOTE: /match/:matchId pehle rakha hai — warna /:id match kar leta hai
 * -----------------------------------------------------------------------
 */

const router = express.Router();

/**
 * GET /api/commentary/match/:matchId
 * Paginated commentary feed. Query: ?page=1&limit=50
 * Access: Public
 * NOTE: /:id se pehle rakha hai
 */
router.get(
  "/match/:matchId",
  asyncHandler(commentaryController.getCommentary)
);

/**
 * POST /api/commentary
 * Add ball commentary (match must be LIVE).
 * Access: SUPER_ADMIN | ADMIN | SCORER
 */
router.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SCORER),
  asyncHandler(commentaryController.addCommentary)
);

/**
 * DELETE /api/commentary/:id
 * Delete commentary entry.
 * Access: SUPER_ADMIN | ADMIN | SCORER
 */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SCORER),
  asyncHandler(commentaryController.deleteCommentary)
);

export default router;