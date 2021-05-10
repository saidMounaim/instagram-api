import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a name'],
		},

		email: {
			type: String,
			required: [true, 'Please add a email'],
			unique: true,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				,
				'Please add a valid email',
			],
		},

		password: {
			type: String,
			required: [true, 'Please add a password'],
			select: false,
		},

		avatar: {
			type: String,
			default: 'avatar_default.jpg',
		},

		role: {
			type: String,
			default: 'user',
			enum: ['user', 'admin'],
		},

		resetPasswordToken: String,
		resetPasswordExpire: Date,

		followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
		following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],

		createdAt: {
			type: Date,
			default: new Date(Date.now()),
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

UserSchema.virtual('posts', {
	ref: 'Post',
	localField: '_id',
	foreignField: 'user',
	justOne: false,
});

UserSchema.pre('save', function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = bcrypt.genSaltSync(10);
	this.password = bcrypt.hashSync(this.password, salt);
	next();
});

const User = mongoose.model('User', UserSchema);

export default User;
