import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Post from './models/Post.js';
import posts from './data/posts.js';
import User from './models/User.js';
import users from './data/users.js';
import Comment from './models/Comment.js';
import comments from './data/comments.js';

dotenv.config();

connectDB();

const insertData = async () => {
	try {
		await User.deleteMany();
		await Post.deleteMany();
		await Comment.deleteMany();
		await Post.create(posts);
		await User.create(users);
		await Comment.create(comments);

		console.log('Data inserted');
	} catch (error) {
		console.log(error.message);
	}
};

const deleteData = async () => {
	try {
		await User.deleteMany();
		await Post.deleteMany();
		await Comment.deleteMany();
		console.log('Data deleted');
	} catch (error) {
		console.log(error.message);
	}
};

if (process.argv[2] === '-i') {
	insertData();
} else {
	deleteData();
}
