import type { NextFunction, Request, Response } from 'express';
import { IPost, postModel } from '#db/models/Post';
import { hasPermission } from '#util/permissions';
import { makeBadRequestError, makeForbiddenError, makeSuccessfulRes, make404Error } from '#util/http';
import { serializePost } from '#db/serializers';
import { nanoid } from 'nanoid';

type PostRequest = Request<{ postID: string }>;
type PostResponse = Response<unknown, { fetchPost: IPost }>;

export default {
	validator: async (req: PostRequest, res: PostResponse, next: NextFunction) => {
		const post = await postModel.findOne({ shortURL: req.params.postID });
		if (!post) return make404Error(res, 'The post with the specified ID does not exist.');
		res.locals.fetchPost = post;
		return next();
	},
	get: (_req: PostRequest, res: PostResponse) => {
		return makeSuccessfulRes(res, serializePost(res.locals.fetchPost));
	},
	post: async (req: PostRequest, res: PostResponse) => {
		if (!req.file) return makeBadRequestError(res, 'You must provide an image associated with this post.');
		const { title, category }: { title: string; category: string } = req.body;
		const shortURL = nanoid(11);
		const post = new postModel({
			author: req.user!.id,
			shortURL,
			title,
			contentURL: req.file.path,
			upvotes: 0,
			downvotes: 0
		});
		await post.save();
		return makeSuccessfulRes(res, serializePost(post.toJSON()));
	},
	delete: async (req: PostRequest, res: PostResponse) => {
		const post = res.locals.fetchPost;
		const executingUser = req.user!;
		if (executingUser._id !== post.author || hasPermission(executingUser, 'MODERATOR'))
			return makeForbiddenError(res, 'You do not have permission to delete this post.');
		post.deleted ||= true;

		await post.save();
		return makeSuccessfulRes(res, serializePost(post.toJSON()));
	},
	patch: (_req: PostRequest, res: PostResponse) => {
		return res.status(501).json({});
	}
};
