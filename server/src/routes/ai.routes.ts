import { formatTextWithAi } from '../controllers/ai.controller';
import {Router} from 'express'
import { authMiddleware } from '../middlewares/auth.middleware';

const router:Router = Router();
router.post("/format-text",authMiddleware,formatTextWithAi)
export default router