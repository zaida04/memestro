import type { NextFunction, Request, Response } from 'express';
import { IPost, postModel } from '@db/models/Post';
import { make404Error } from '@util/index';
import { makeSuccessfulRes } from '@util/http';
import { serializePost } from '@db/serializers';
import { nanoid } from 'nanoid';

type PostRequest = Request<{ postID: string }>;
type PostResponse = Response<unknown, { fetchPost: IPost }>;

export default {
	validator: async (req: PostRequest, res: PostResponse, next: NextFunction) => {
		const post = await postModel.findById(req.params.postID);
		if (!post) return make404Error(res, 'The post with the specified ID does not exist.');
		res.locals.fetchPost = post;
		return next();
	},
	get: (_req: PostRequest, res: PostResponse) => {
		return makeSuccessfulRes(res, serializePost(res.locals.fetchPost));
	},
	post: async (req: PostRequest, res: PostResponse) => {
		const { title, content }: { title: string; content: string } = req.body;
		const shortURL = nanoid(11);
		const contentURL = 'https://placeholder.com/test';
		const post = new postModel({
			author: req.user!.id,
			shortURL,
			title,
			// TODO: upload content to a cdn
			contentURL,
			upvotes: 0,
			downvotes: 0
		});
		await post.save();
		return makeSuccessfulRes(res, serializePost(post.toJSON()));
	},
	delete: (req: PostRequest, res: PostResponse) => {
		return res.status(501).json({});
	},
	patch: (_req: PostRequest, res: PostResponse) => {
		return res.status(501).json({});
	}
};
