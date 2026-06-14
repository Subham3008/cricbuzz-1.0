import { z } from "zod";
import { MATCH_STATUS } from "../../../shared/constants/matchStatus.js";

/**
 * Validators — Match
 * -----------------------------------------------------------------------
 * Zod schemas for every write endpoint. Used by validateRequest middleware.
 * -----------------------------------------------------------------------
 */

// Reusable ObjectId validator (24-char hex string)
const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId");

// Sub-schema for a single playing XI entry
const playingPlayerSchema = z.object({
  player: objectId,
  isCaptain: z.boolean().optional().default(false),
  isWicketKeeper: z.boolean().optional().default(false),
});

/** Create match — POST /api/match */
export const createMatchSchema = z.object({
  body: z.object({
    seriesId: objectId,
    matchNumber: z.string().min(1, "Match number cannot be empty").optional(),
    venue: z
      .string({ required_error: "Venue is required" })
      .min(1, "Venue cannot be empty"),
    startTime: z
      .string({ required_error: "Start time is required" })
      .datetime("Must be a valid ISO-8601 date-time string"),
    status: z.enum(Object.values(MATCH_STATUS)).optional(),
    team1: objectId,
    team2: objectId,
    tossWinner: objectId.optional(),
    tossDecision: z.enum(["BAT", "BOWL"]).optional(),
    playingXI: z
      .object({
        team1: z.array(playingPlayerSchema).optional(),
        team2: z.array(playingPlayerSchema).optional(),
      })
      .optional(),
    winner: objectId.optional(),
    result: z.string().optional(),
  }),
});

/** Update match — PATCH /api/match/:id */
export const updateMatchSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z
    .object({
      seriesId: objectId.optional(),
      matchNumber: z.string().min(1, "Match number cannot be empty").optional(),
      venue: z.string().min(1, "Venue cannot be empty").optional(),
      startTime: z.string().datetime().optional(),
      status: z.enum(Object.values(MATCH_STATUS)).optional(),
      team1: objectId.optional(),
      team2: objectId.optional(),
      tossWinner: objectId.optional(),
      tossDecision: z.enum(["BAT", "BOWL"]).optional(),
      playingXI: z
        .object({
          team1: z.array(playingPlayerSchema).optional(),
          team2: z.array(playingPlayerSchema).optional(),
        })
        .optional(),
      winner: objectId.optional(),
      result: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

/** Get/Delete match by id — GET|DELETE /api/match/:id */
export const matchIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});
