import { Router } from "express";
import { getUser,createUser,loginUser,logoutUser, refreshAccessToken, verifyCode, resetPassword } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { rateLimiter } from "../middlewares/redis.middleware";

const router:Router = Router();
router.get("/", authMiddleware,getUser);
router.post("/signup",createUser)
router.post("/login",rateLimiter(`rl:login`,10,60),loginUser)
router.post("/logout",authMiddleware,logoutUser)
router.post("/refresh-token",refreshAccessToken)
router.post("/verify-code",verifyCode)
router.patch("/change-password",authMiddleware,rateLimiter(`rl:changepassowrd`,10,120),resetPassword)
export default router;