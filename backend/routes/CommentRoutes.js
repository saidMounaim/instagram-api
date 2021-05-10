import express from 'express';
import { getComments, addComment, deleteComment } from '../controllers/CommentController.js';
import { ProtectMiddleware } from '../middleware/ProtectMiddleware.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(getComments).post(ProtectMiddleware, addComment);
router.route('/:id').delete(ProtectMiddleware, deleteComment);

export default router;
