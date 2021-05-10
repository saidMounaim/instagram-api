import express from 'express';
import {
	login,
	register,
	uploadAvatar,
	getMe,
	updateDetails,
	updatePassword,
	forgotPassword,
	resetPassword,
	followUser,
	unfollowUser,
} from '../controllers/AuthController.js';
import { ProtectMiddleware } from '../middleware/ProtectMiddleware.js';

const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/avatar').put(ProtectMiddleware, uploadAvatar);
router.route('/me').get(ProtectMiddleware, getMe);
router.route('/updateDetails').put(ProtectMiddleware, updateDetails);
router.route('/updatepassword').put(ProtectMiddleware, updatePassword);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resetToken').put(resetPassword);

router.route('/follow/:userId').put(ProtectMiddleware, followUser);
router.route('/unfollow/:userId').put(ProtectMiddleware, unfollowUser);

export default router;
