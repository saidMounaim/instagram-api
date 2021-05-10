import mongoose from 'mongoose';

const PostSchema = mongoose.Schema(
	{
		description: {
			type: String,
			required: [true, 'Please add a description'],
		},

		photo: {
			type: String,
			default: {},
			required: [true, 'Please add a photo'],
		},

		createdAt: {
			type: Date,
			default: new Date(Date.now()),
		},

		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

PostSchema.virtual('comments', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'post',
	justOne: false,
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
