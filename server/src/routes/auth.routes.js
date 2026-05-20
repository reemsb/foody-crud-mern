import { Router } from "express"
import * as controller from "../controllers/auth.controller.js"
import requireAuth from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/register", controller.register)
router.post("/login", controller.login)
router.post("/google", controller.googleLogin)
router.get("/me", requireAuth, controller.me)

export default router
