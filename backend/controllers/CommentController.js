import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import asyncHandler from 'express-async-handler';

//@DESC Get All Comments
//@ROUTE /api/v1/comments
//METHOD GET
export const getComments = asyncHandler(async (req, res) => {
	const comments = await Comment.find({});
	res.status(201).json({ success: true, data: comments });
});

//@DESC Add Comment
//@ROUTE /api/v1/posts/:postId/comments
//@METHOD POST
export const addComment = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.postId);

	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}

	req.body.user = req.user.id;
	req.body.post = post._id;

	let comment = await Comment.create(req.body);
	comment = await comment.populate('user').execPopulate();

	res.status(201).json({ success: true, data: comment });
});

//@DESC Update Comment
//@ROUTE /api/comments/:id
//@METHOD PUT
export const updateComment = asyncHandler(async (req, res) => {
	let comment = await Comment.findById(req.params.id);

	if (!comment) {
		res.status(404);
		throw new Error('Comment not found');
	}

	if (req.user.id !== comment.user.toString() && req.user.role !== 'admin') {
		res.status(404);
		throw new Error('Not Authorize to update this comment');
	}

	comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(201).json({ success: true, data: comment });
});

//@DESC Delete Comment
//@ROUTE /api/comments/:id
//@METHOD DELETE
export const deleteComment = asyncHandler(async (req, res) => {
	let comment = await Comment.findById(req.params.id);

	if (!comment) {
		res.status(404);
		throw new Error('Comment not found');
	}

	if (req.user.id !== comment.user.toString() && req.user.role !== 'admin') {
		res.status(404);
		throw new Error('Not Authorize to delete this comment');
	}

	comment = await Comment.findByIdAndDelete(req.params.id);
	res.status(201).json({ success: true, data: {} });
});
