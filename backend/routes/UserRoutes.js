import express from 'express';
import { getAll, getUser } from '../controllers/UserController.js';

const router = express.Router();

router.route('/').get(getAll);
router.route('/:id').get(getUser);

export default router;
