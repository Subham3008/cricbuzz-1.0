import { Router } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import { responseCache } from "../cache/responseCache.js";
import * as seriesController from "./series.controller.js";

/**
 * Series Routes (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Unauthenticated, cached GET endpoints.
 *
 * NOTE: Specific routes (/:seriesId/matches, /:seriesId/points-table)
 * pehle register karo — warna /:seriesId match kar leta hai.
 *
 * TTL values:
 *   /api/series          → 60s (series rarely change)
 *   /api/series/:id      → 60s
 *   /:id/matches         → 60s
 *   /:id/points-table    → 30s (match complete hone pe change hoti hai)
 *
 * Mount in app.js:
 *   app.use("/api/series", seriesPublicRouter);
 * ─────────────────────────────────────────────────────────────────────
 */

const router = Router();

/**
 * GET /api/series
 * Saari active series.
 * Cache: 60s TTL
 */
router.get(
  "/",
  responseCache(60),
  asyncHandler(seriesController.getSeries)
);

/**
 * GET /api/series/:seriesId/matches
 * Series ke saare matches.
 * Cache: 60s TTL
 * NOTE: /:seriesId se pehle rakha hai
 */
router.get(
  "/:seriesId/matches",
  responseCache(60),
  asyncHandler(seriesController.getSeriesMatches)
);

/**
 * GET /api/series/:seriesId/points-table
 * Derived points table.
 * Cache: 30s TTL
 * NOTE: /:seriesId se pehle rakha hai
 */
router.get(
  "/:seriesId/points-table",
  responseCache(30),
  asyncHandler(seriesController.getPointsTable)
);

/**
 * GET /api/series/:seriesId
 * Series details + matches + points table.
 * Cache: 60s TTL
 */
router.get(
  "/:seriesId",
  responseCache(60),
  asyncHandler(seriesController.getSeriesDetails)
);

export default router;