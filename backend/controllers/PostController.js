import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';

//@DESC Get All Post
//@ROUTE /api/v1/posts
//@METHOD GET
export const getAll = asyncHandler(async (req, res) => {
	const posts = await Post.find({})
		.populate('user')
		.populate('comments')
		.populate({
			path: 'comments',
			populate: {
				path: 'user',
				model: 'User',
			},
		});
	res.status(201).json({ success: true, count: posts.length, data: posts });
});

//@DESC Get Single Post
//@ROUTE /api/v1/posts/:id
//@METHOD GET
export const getPost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);

	if (!post) {
		res.status(404);
		throw new Error('Post Not Found');
	}

	res.status(201).json({ success: true, data: post });
});

//@DESC Add Post
//@ROUTE /api/v1/posts
//@METHOD POST
export const addPost = asyncHandler(async (req, res) => {
	req.body.user = req.user.id;
	let post = await Post.create(req.body);

	if (req.files) {
		if (!req.files.photo.mimetype.startsWith('image')) {
			res.status(401);
			throw new Error('Please add image file');
		}

		if (req.files.photo.size > process.env.FILE_UPLOAD_LIMIT) {
			res.status(401);
			throw new Error(`Please add a photo less than ${process.env.FILE_UPLOAD_LIMIT}`);
		}

		const photoFile = req.files.photo;

		photoFile.mv(`${process.env.FILE_UPLOAD_PATH}/${photoFile.name}`, async (err) => {
			if (err) {
				res.status(401);
				throw new Error(err.message);
			}

			post = await Post.findByIdAndUpdate(
				post._id,
				{ photo: photoFile.name },
				{
					new: true,
					runValidators: true,
				}
			);
			res.status(201).json({ success: true, data: post });
		});
	}
});

//@DESC Update Post
//@ROUTE /api/v1/posts/:id
//@METHOD PUT
export const updatePost = asyncHandler(async (req, res) => {
	let post = await Post.findById(req.params.id);

	if (!post) {
		res.status(404);
		throw new Error('Post Not Found');
	}

	if (req.user.id.toString() !== post.user.toString() && req.user.role !== 'admin') {
		res.status(404);
		throw new Error('Not Authorize to update this post');
	}

	post = await Post.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(201).json({ success: true, data: post });
});

//@DESC Delete Post
//@ROUTE /api/v1/posts/:id
//@METHOD DELETE
export const deletePost = asyncHandler(async (req, res) => {
	let post = await Post.findById(req.params.id);

	if (!post) {
		res.status(404);
		throw new Error('Post Not Found');
	}

	if (req.user.id.toString() !== post.user.toString() && req.user.role !== 'admin') {
		res.status(404);
		throw new Error('Not Authorize to delete this post');
	}

	post = await Post.findByIdAndDelete(req.params.id);

	res.status(201).json({ success: true, data: {} });
});
