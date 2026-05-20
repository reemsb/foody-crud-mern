import { Router } from "express"
import * as controller from "../controllers/snack.controller.js"

const router = Router()

router.get("/", controller.getSnacks)
router.post("/", controller.createSnack)
router.put("/:id", controller.updateSnack)
router.delete("/:id", controller.deleteSnack)

export default router
