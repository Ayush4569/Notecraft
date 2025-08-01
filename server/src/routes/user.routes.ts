import { Router } from "express";
import { getUser, createUser, loginUser, logoutUser, refreshAccessToken, verifyCode, changePassword,forgotPassword, resetPasswordOtp } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { rateLimiter } from "../middlewares/redis.middleware";

const router: Router = Router();
router.get("/", authMiddleware, getUser);
router.post("/signup", createUser)
router.post("/login", rateLimiter(`rl:login`, 10, 60), loginUser)
router.post("/logout", authMiddleware, logoutUser)
router.post("/refresh-token", refreshAccessToken)
router.post("/verify-code", verifyCode)
router.patch("/changePassword",authMiddleware ,rateLimiter(`rl:changePassword`, 3, 60), changePassword)
router.post("/resetOtp", rateLimiter(`rl:forgotPassword`, 1, 60), resetPasswordOtp)
router.patch("/forgotPassword",forgotPassword)
export default router;