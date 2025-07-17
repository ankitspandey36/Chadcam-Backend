import { Router } from "express";
import { submitfeedback } from "../controllers/feedback.controller.js";
import { verifyjwt } from "../middlewares/verifyjwt.middleware.js";
const router = Router();

router.post("/submitfeedback", verifyjwt, submitfeedback);

export default router;