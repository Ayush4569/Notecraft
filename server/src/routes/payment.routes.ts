import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createSubscription } from "../controllers/payments.controller";

const router:Router = Router()
router.post("/subscriptions/create",authMiddleware,createSubscription)
// router.delete("/delete",authMiddleware)
export default router