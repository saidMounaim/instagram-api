import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';
import connectDB from './config/db.js';

import { notFound, errorHandler } from './middleware/ErrorMiddleware.js';

// ROUTES
import PostRoutes from './routes/PostRoutes.js';
import AuthRoutes from './routes/AuthRoutes.js';
import CommentRoutes from './routes/CommentRoutes.js';

const app = express();

dotenv.config();

connectDB();

app.use(express.json());

app.use(cors());

app.use(fileUpload());

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.get('/', (req, res) => {
	res.status(201).json({ success: true, message: 'Welcome to instagram clone api' });
});

//POSTS ROUTES
app.use('/api/v1/posts', PostRoutes);

//AUTH ROUTES
app.use('/api/v1/auth', AuthRoutes);

// COMMENTS ROUTES
app.use('/api/v1/comments', CommentRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));

app.use(notFound);
app.use(errorHandler);

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on PORT ${PORT}`));
