import { Router } from "express";
import { verifyjwt } from "../middlewares/verifyjwt.middleware.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()


router.get("/getmessage", verifyjwt, getMessage);
router.post("/sendmessage", verifyjwt, upload.single("image"), sendMessage);


export default router;