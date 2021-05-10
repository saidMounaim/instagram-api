import mongoose from 'mongoose';

const CommentSchema = mongoose.Schema({
	comment: {
		type: String,
		required: [true, 'please add a comment'],
	},

	post: {
		type: mongoose.Schema.ObjectId,
		ref: 'Post',
		required: true,
	},

	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},

	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
