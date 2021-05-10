import express from 'express';
import { getAll, getPost, addPost, updatePost, deletePost } from '../controllers/PostController.js';
import { ProtectMiddleware, AuthMiddleware } from '../middleware/ProtectMiddleware.js';
import CommentRoutes from './CommentRoutes.js';

const router = express.Router();

router.use('/:postId/comments', CommentRoutes);

router.route('/').get(getAll).post(ProtectMiddleware, addPost);
router
	.route('/:id')
	.get(getPost)
	.put(ProtectMiddleware, AuthMiddleware('user', 'admin'), updatePost)
	.delete(ProtectMiddleware, AuthMiddleware('user', 'admin'), deletePost);

export default router;
