import MatchService from "./match.service.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";


// ─── Match Controller ──────────────────────────────────────────────────────
// The controller is the HTTP adapter — it receives Express req/res objects,
// delegates the actual work to MatchService, and sends back a JSON response.
//
// Each method is wrapped with asyncHandler so that any thrown errors
// automatically land in the global error-handling middleware.
//
// NOTE: We use arrow functions for the methods so that `this` is
// lexically bound to the class instance (important because Express
// will call these as standalone callbacks, not as obj.method()).
// ────────────────────────────────────────────────────────────────────────────

export default class MatchController {

  constructor() {
    this.matchService = new MatchService();
  }


  // ── POST /api/matches ──────────────────────────────────────────────────
  // Creates a new match from the validated request body.
  createMatch = asyncHandler(async (req, res) => {
    const match = await this.matchService.createMatch(req.body);

    res.status(201).json({
      success: true,
      message: "Match created successfully",
      data: match,
    });
  });


  // ── GET /api/matches ───────────────────────────────────────────────────
  // Returns all matches. Supports optional query filters (?status=LIVE).
  getAllMatches = asyncHandler(async (req, res) => {
    const matches = await this.matchService.getAllMatches(req.query);

    res.status(200).json({
      success: true,
      message: "Matches fetched successfully",
      data: matches,
    });
  });


  // ── GET /api/matches/:id ───────────────────────────────────────────────
  // Returns a single match by its MongoDB _id.
  getMatchById = asyncHandler(async (req, res) => {
    const match = await this.matchService.getMatchById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Match fetched successfully",
      data: match,
    });
  });


  // ── PATCH /api/matches/:id ─────────────────────────────────────────────
  // Partially updates a match. Only the fields sent in the body are changed.
  updateMatch = asyncHandler(async (req, res) => {
    const match = await this.matchService.updateMatch(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Match updated successfully",
      data: match,
    });
  });


  // ── DELETE /api/matches/:id ────────────────────────────────────────────
  // Soft-deletes a match (sets isDeleted = true).
  deleteMatch = asyncHandler(async (req, res) => {
    const match = await this.matchService.deleteMatch(req.params.id);

    res.status(200).json({
      success: true,
      message: "Match deleted successfully",
      data: match,
    });
  });
}
