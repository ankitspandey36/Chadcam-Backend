import { Router } from "express";
import { joinRoom, leaveroom, getRoomMemberNumber } from "../controllers/room.controller.js";
import { verifyjwt } from "../middlewares/verifyjwt.middleware.js"

const router = Router()

router.post('/joinroom', verifyjwt, joinRoom);
router.post('/leaveroom', verifyjwt, leaveroom);
router.post('/getusernumber', verifyjwt, getRoomMemberNumber)


export default router