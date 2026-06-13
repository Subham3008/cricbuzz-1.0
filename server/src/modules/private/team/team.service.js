import teamRepository from "./team.repository.js"
import { ConflictError, NotFoundError } from "../../shared/errors/index.js"

const createTeam = async (data) => {
  const existing = await teamRepository.findByNameOrShortName(
    data.name,
    data.shortName
  )

  if (existing) {
    throw new ConflictError("Team with this name or shortName already exists")
  }

  return teamRepository.create(data)
}

const getTeams = () => {
  return teamRepository.findAll()
}

const getTeamById = async (id) => {
  const team = await teamRepository.findById(id)

  if (!team) {
    throw new NotFoundError("Team not found")
  }

  return team
}

const updateTeam = async (id, data) => {
  const team = await teamRepository.findById(id)

  if (!team) {
    throw new NotFoundError("Team not found")
  }

  if (data.name || data.shortName) {
    const conflict = await teamRepository.findByNameOrShortName(
      data.name ?? team.name,
      data.shortName ?? team.shortName
    )

    if (conflict && conflict._id.toString() !== id) {
      throw new ConflictError("Team with this name or shortName already exists")
    }
  }

  return teamRepository.updateById(id, data)
}

const deleteTeam = async (id) => {
  const team = await teamRepository.softDelete(id)

  if (!team) {
    throw new NotFoundError("Team not found")
  }

  return team
}

export default {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
}