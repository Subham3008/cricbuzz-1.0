import { Router } from "express"
import teamController from "./team.controller.js"
// import { authenticate, authorize } from "../../../shared/middleware/auth.js"
// import validateRequest from "../../shared/middleware/validateRequest.js"
import ROLES from "../../../shared/constants/role.js"
// import teamValidator from "./validators/team.validator.js"

const router = Router()

// All routes: SUPER_ADMIN or ADMIN only
router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN))

router.get("/", teamController.getTeams)

router.get(
  "/:id",
  validateRequest(teamValidator.teamIdParamSchema),
  teamController.getTeamById
)

router.post(
  "/",
  validateRequest(teamValidator.createTeamSchema),
  teamController.createTeam
)

router.patch(
  "/:id",
  validateRequest(teamValidator.updateTeamSchema),
  teamController.updateTeam
)

router.delete(
  "/:id",
  validateRequest(teamValidator.teamIdParamSchema),
  teamController.deleteTeam
)

export default router