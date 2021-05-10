import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const ProtectMiddleware = asyncHandler(async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		res.status(401);
		throw new Error('Not Authorize to access this route');
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id);

		next();
	} catch (error) {
		res.status(401);
		throw new Error(error.message);
	}
});

export const AuthMiddleware = (...roles) =>
	asyncHandler(async (req, res, next) => {
		const role = req.user.role;
		if (!roles.includes(role)) {
			res.status(401);
			throw new Error('Not Authorize to access this route');
		}

		next();
	});
