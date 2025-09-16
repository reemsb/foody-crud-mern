import { Router } from "express"
import * as controller from "../controllers/snack.controller.js"

const router = Router()

router.post("/", controller.createSnack)
router.get("/", controller.getSnacks)
router.delete("/:id", controller.deleteSnack)
router.put("/:_id", controller.updateSnack)

export default router