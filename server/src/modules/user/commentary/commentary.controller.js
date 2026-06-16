import { sendPaginated } from "../shared/respond.js";
import * as commentaryService from "./commentary.service.js";

/**
 * Controller Layer — Commentary (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Paginated ball-by-ball commentary feed.
 * Cache: 5s TTL — sabse short, ball-by-ball updates hote hain.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * GET /api/matches/:matchId/commentary
 * Paginated commentary. Query: ?page=1&limit=50
 * Access: Public — Cache: 5s
 */
export const getCommentary = async (req, res) => {
  const { items, pagination } = await commentaryService.getCommentary(
    req.params.matchId,
    req.query
  );

  return sendPaginated(res, items, pagination);
};