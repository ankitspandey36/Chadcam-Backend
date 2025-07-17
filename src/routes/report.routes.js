import { Router } from "express";
import { handleReport } from "../controllers/report.controller.js";
import { verifyjwt } from "../middlewares/verifyjwt.middleware.js";
const router = Router();

router.post("/action", verifyjwt, handleReport);

export default router;