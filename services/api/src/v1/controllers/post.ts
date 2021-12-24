import type { NextFunction, Request, Response } from 'express';
import { IPost, postModel, basePostData } from '#db/models/Post';
import { hasPermission } from '#util/permissions';
import { BadRequest, Forbidden, Ok, NotFound } from '#util/http';
import { serializePost } from '#db/serializers';
import { nanoid } from 'nanoid';
import { stripIndents } from 'common-tags';

type PostRequest = Request<{ postID: string }>;
type PostResponse = Response<unknown, { fetchPost: IPost }>;

export default {
	validator: async (req: PostRequest, res: PostResponse, next: NextFunction) => {
		const post = await postModel.findOne({ shortURL: req.params.postID });
		if (!post) return NotFound(res, 'The post with the specified ID does not exist.');
		res.locals.fetchPost = post;
		return next();
	},
	get: (_req: PostRequest, res: PostResponse) => {
		return Ok(res, serializePost(res.locals.fetchPost));
	},
	post: async (req: PostRequest, res: PostResponse) => {
		if (!req.file) return BadRequest(res, 'You must provide an image associated with this post.');
		const { title, category }: { title: string; category: string } = req.body;
		const shortURL = nanoid(11);
		const post = new postModel({
			...basePostData,
			author: req.user!.id,
			shortURL,
			title,
			contentURL: req.file.path
		});

		await post.save();
		return Ok(res, serializePost(post));
	},
	delete: async (req: PostRequest, res: PostResponse) => {
		const post = res.locals.fetchPost;
		const executingUser = req.user!;
		if (!executingUser._id.equals(post.author) || hasPermission(executingUser, 'MODERATOR'))
			return Forbidden(res, 'You do not have permission to delete this post.');

		post.deleted ||= true;
		await post.save();
		return Ok(res, serializePost(post));
	},
	patch: (_req: PostRequest, res: PostResponse) => {
		return res.status(501).json({});
	},
	report: async (req: PostRequest, res: PostResponse) => {
		const post = res.locals.fetchPost;
		await req.app.reporter.make({
			method: 'POST',
			body: {
				embeds: [
					{
						title: 'New report on a post!',
						description: stripIndents`
							**Reporting User:** ${req.user?._id ?? 'ANONYMOUS'}.
							**Post:** ${post.shortURL} (${post._id})
							**Post Author:** ${post.author}
							**Reason:** 
							\`\`\`
							${req.body.reason}
							\`\`\`
						`,
						image: {
							url: post.contentURL
						},
						color: 15158332,
						timestamp: new Date().toISOString()
					}
				]
			}
		});
		return Ok(res, {});
	}
};
