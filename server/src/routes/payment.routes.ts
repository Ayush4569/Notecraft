import { Router,raw } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createSubscription,cancelSubscription, webhook } from "../controllers/payments.controller";

const webhookRouter:Router = Router()
webhookRouter.post("/subscriptions/webhook", raw({ type: "application/json" }), webhook);

const router:Router = Router()
router.post("/subscriptions/create",authMiddleware,createSubscription)
router.post("/subscriptions/cancel",authMiddleware,cancelSubscription)

export default {
    router,
    webhookRouter
}