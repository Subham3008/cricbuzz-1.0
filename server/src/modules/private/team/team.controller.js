import teamService from "./team.service.js"
// import asyncHandler from "../../shared/middleware/asyncHandler.js"

const createTeam = asyncHandler(async (req, res) => {
  const team = await teamService.createTeam(req.validated.body)
  res.status(201).json({ success: true, data: team })
})

const getTeams = asyncHandler(async (req, res) => {
  const teams = await teamService.getTeams()
  res.status(200).json({ success: true, data: teams })
})

const getTeamById = asyncHandler(async (req, res) => {
  const team = await teamService.getTeamById(req.validated.params.id)
  res.status(200).json({ success: true, data: team })
})

const updateTeam = asyncHandler(async (req, res) => {
  const team = await teamService.updateTeam(
    req.validated.params.id,
    req.validated.body
  )
  res.status(200).json({ success: true, data: team })
})

const deleteTeam = asyncHandler(async (req, res) => {
  const team = await teamService.deleteTeam(req.validated.params.id)
  res.status(200).json({ success: true, data: team })
})

export default {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
}