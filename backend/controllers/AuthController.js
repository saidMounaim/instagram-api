import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import sendMail from '../utils/sendMail.js';

//@DESC Login User
//@ROUTE /api/v1/auth/login
//@METHOD POST
export const login = asyncHandler(async (req, res) => {
	const user = await User.findOne({ email: req.body.email }).select('+password').populate('posts');

	if (!user) {
		res.status(401);
		throw new Error('Email or password incorrect');
	}

	const matchPassword = bcrypt.compareSync(req.body.password, user.password);

	if (!matchPassword) {
		res.status(401);
		throw new Error('password incorrect');
	}

	const token = generateToken(user.id);

	const data = {
		id: user._id,
		name: user.name,
		email: user.email,
		role: user.role,
		avatar: user.avatar,
		followers: user.followers,
		following: user.following,
		posts: user.posts,
		token,
	};

	res.status(201).json({ success: true, data });
});

//@DESC Register User
//@ROUTE /api/v1/auth/register
//@METHOD POST
export const register = asyncHandler(async (req, res) => {
	const { name, email, password, role } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	res.status(201).json({ success: true, user });
});

//@DESC Upload Avatar
//@ROUTE /api/v1/auth/avatar
//@METHOD PUT
export const uploadAvatar = asyncHandler(async (req, res) => {
	if (req.files) {
		if (!req.files.avatar.mimetype.startsWith('image')) {
			res.status(401);
			throw new Error('Please add image file');
		}

		if (req.files.avatar.size > process.env.FILE_UPLOAD_LIMIT) {
			res.status(401);
			throw new Error(`Please add a photo less than ${process.env.FILE_UPLOAD_LIMIT}`);
		}

		const avatarFile = req.files.avatar;

		avatarFile.mv(`${process.env.FILE_UPLOAD_PATH}/users/${avatarFile.name}`, async (err) => {
			if (err) {
				res.status(401);
				throw new Error(err.message);
			}

			await User.findByIdAndUpdate(
				req.user.id,
				{
					avatar: avatarFile.name,
				},
				{ new: true, runValidators: true }
			);

			res.status(201).json({ success: true, data: avatarFile.name });
		});
	}
});

//@DESC Update User Details
//@ROUTE /api/v1/updatedetails
//@METHOD PUT
export const updateDetails = asyncHandler(async (req, res) => {
	const { name, email } = req.body;

	const user = await User.findByIdAndUpdate(
		req.user.id,
		{
			name,
			email,
		},
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(201).json({ success: true, data: user });
});

//@DESC Update Password
//@ROUTE /api/v1/updatepassword
//METHOD PUT
export const updatePassword = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id).select('+password');

	const { currentPassword, newPassword } = req.body;

	const matchPassword = bcrypt.compareSync(currentPassword, user.password);

	if (!matchPassword) {
		res.status(401);
		throw new Error('Current Password Incorrect');
	}

	user.password = newPassword;
	await user.save();

	res.status(201).json({ success: true, data: user });
});

//@DESC Forgot Password
//@ROURE /api/v1/forgotpassword
//@METHOD POST
export const forgotPassword = asyncHandler(async (req, res) => {
	const resetToken = crypto.randomBytes(20).toString('hex');
	const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

	const { email } = req.body;

	const user = await User.findOne({ email });

	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}

	await User.findByIdAndUpdate(user.id, {
		resetPasswordToken: hash,
		resetPasswordExpire: new Date().setHours(new Date().getHours() + 1),
	});

	const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${hash}`;

	const message = `
		you requested to reset your password,<br /> 
		please check the link below to reset your password<br />
		<a href="${resetUrl}" target="_blank" >Reset Password</a>
	`;

	try {
		sendMail(email, 'Forgot Password', message);

		res.status(201).json({ success: true, data: 'Check your email' });
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		res.status(401);
		throw new Error(error.message);
	}
});

//@DESC Reset Password
//@ROUTE /api/v1/auth/resetpassword/:resetToken
//@METHOD PUT
export const resetPassword = asyncHandler(async (req, res) => {
	const user = await User.findOne({
		resetPasswordToken: req.params.resetToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}

	const { newPassword } = req.body;

	user.password = newPassword;

	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save();

	res.status(201).json({ success: true, data: user });
});

//@DESC Follow User
//@ROUTE /api/v1/auth/follow/:userId
//METHOD PUT
export const followUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.userId);

	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}

	if (user.id === req.user.id) {
		res.status(404);
		throw new Error('Can not follow yourself');
	}

	if (user.followers.includes(req.user.id)) {
		res.status(404);
		throw new Error('you already follow this user');
	}

	const follow = await User.findByIdAndUpdate(
		user._id,
		{
			$push: { followers: req.user.id },
		},
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(201).json({ success: true, data: follow });
});

//@DESC Unfollow User
//@ROUTE /api/v1/auth/unfollow/:userId
//METHOD PUT
export const unfollowUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.userId);

	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}

	const unfollow = await User.findByIdAndUpdate(
		user._id,
		{
			$pull: { followers: req.user.id },
		},
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(201).json({ success: true, data: unfollow });
});

//@DESC Get Logged in User
//@ROUTE /api/v1/me
//@METHOD GET
export const getMe = asyncHandler(async (req, res) => {
	const user = req.user;

	res.status(201).json({ success: true, data: user });
});
