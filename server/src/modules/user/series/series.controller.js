import { sendSuccess, sendList } from "../shared/respond.js";
import * as seriesService from "./series.service.js";

/**
 * Controller Layer — Series (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Unauthenticated read-only handlers.
 * Cache: 60s TTL (series rarely change) — commentary 5s TTL.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * GET /api/series
 * Saari active series.
 * Access: Public — Cache: 60s
 */
export const getSeries = async (req, res) => {
  const series = await seriesService.getSeries();
  return sendList(res, series);
};

/**
 * GET /api/series/:seriesId
 * Series details + matches + points table.
 * Access: Public — Cache: 60s
 */
export const getSeriesDetails = async (req, res) => {
  const data = await seriesService.getSeriesDetails(req.params.seriesId);
  return sendSuccess(res, data);
};

/**
 * GET /api/series/:seriesId/matches
 * Series ke saare matches.
 * Access: Public — Cache: 60s
 */
export const getSeriesMatches = async (req, res) => {
  const matches = await seriesService.getSeriesMatches(req.params.seriesId);
  return sendList(res, matches);
};

/**
 * GET /api/series/:seriesId/points-table
 * Derived points table — on-the-fly calculate hoti hai.
 * Access: Public — Cache: 30s
 */
export const getPointsTable = async (req, res) => {
  const pointsTable = await seriesService.getPointsTable(req.params.seriesId);
  return sendList(res, pointsTable);
};