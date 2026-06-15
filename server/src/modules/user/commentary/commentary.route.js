import { Router } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import { responseCache } from "../cache/responseCache.js";
import { getCommentary } from "./commentary.controller.js";

/**
 * Commentary Routes (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Single endpoint — paginated commentary feed for a match.
 * Cache TTL: 5s — sabse short TTL kyunki ball-by-ball update hota hai.
 * Socket.IO real-time events se live clients ko instant updates milte hain.
 *
 * Mount in app.js:
 *   app.use("/api/matches", commentaryPublicRouter);
 *   → GET /api/matches/:matchId/commentary
 * ─────────────────────────────────────────────────────────────────────
 */

const router = Router({ mergeParams: true });

/**
 * GET /api/matches/:matchId/commentary
 * Paginated commentary. Query: ?page=1&limit=50
 * Cache: 5s TTL
 */
router.get(
  "/",
  responseCache(5),
  asyncHandler(getCommentary)
);

export default router;

