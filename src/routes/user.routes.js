import { Router } from "express";
import { login, register, logout, refresh, changePassword, updateDetails, getCurrentUser, getAllUsers, verifyCode, resendCode, forgotpasswordVerification, forgotpasswordchange, verifyForgotCode, getTrendingTopics } from "../controllers/user.controller.js";
import { verifyjwt } from "../middlewares/verifyjwt.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();


router.route('/register').post(upload.single("avatar"), register)
router.route('/login').post(login)
router.route('/logout').post(verifyjwt, logout)
router.route('/refresh').post(refresh)
router.route('/changepassword').patch(verifyjwt, changePassword)
router.route('/updatedetails').patch(verifyjwt, updateDetails)
router.route('/me').get(verifyjwt, getCurrentUser)
router.route('/all').get(verifyjwt, getAllUsers)
router.route('/verify').post(verifyCode)
router.route('/verifyforgotcode').post(verifyForgotCode)
router.route('/resendcode').post(resendCode)
router.route('/forgotpassword').post(forgotpasswordVerification)
router.route('/forgotpasswordchange').patch(forgotpasswordchange)
router.route('/trendingtopics').get(getTrendingTopics)


export default router;