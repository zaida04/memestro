import type { NextFunction, Request, Response } from 'express';
import { commentModel, IComment } from '#db/models/Comment';
import { hasPermission, NotFound, Forbidden, Ok, notNullorUndef } from '#util/index';
import { IPost } from '#db/models/Post';
import { serializeComment } from '#db/serializers';
import { stripIndents } from 'common-tags';

type CommentRequest = Request<{ commentID: string }>;
type CommentResponse = Response<unknown, { fetchComment: IComment; fetchPost: IPost }>;

export default {
	validator: async (req: CommentRequest, res: CommentResponse, next: NextFunction) => {
		const comment = await commentModel.findById(req.params.commentID);
		if (!comment) return NotFound(res, 'The comment with the specified ID does not exist.');
		res.locals.fetchComment = comment;
		return next();
	},
	getAll: async (_req: CommentRequest, res: CommentResponse) => {
		const populatedPost = (await res.locals.fetchPost.populate('comments').execPopulate()) as IPost & { comments: IComment[] };
		const comments = populatedPost.comments.map(serializeComment);
		return Ok(res, { comments });
	},
	get: (_req: CommentRequest, res: CommentResponse) => {
		return Ok(res, serializeComment(res.locals.fetchComment));
	},
	post: async (req: CommentRequest, res: CommentResponse) => {
		const post = res.locals.fetchPost;
		const newComment = new commentModel({
			author: req.user!._id,
			post: post._id,
			content: req.body.content,
			upvotes: 0,
			downvotes: 0,
			deleted: false
		});
		await newComment.save();
		post.comments.push(newComment._id);
		await post.save();
		return Ok(res, serializeComment(newComment));
	},
	delete: async (req: CommentRequest, res: CommentResponse) => {
		const comment = res.locals.fetchComment;
		const executingUser = req.user!;
		console.log();
		if (!executingUser._id.equals(comment.author) || hasPermission(executingUser, 'MODERATOR'))
			return Forbidden(res, 'You do not have permission to delete this comment.');

		comment.deleted ||= true;
		await comment.save();
		return Ok(res, serializeComment(comment));
	},
	patch: async (req: CommentRequest, res: CommentResponse) => {
		const comment = res.locals.fetchComment;
		const executingUser = req.user!;
		if (!executingUser._id.equals(comment.author)) return Forbidden(res, 'You do not have permission to edit this comment.');
		const oldComment = Object.freeze(serializeComment(comment.toJSON()));
		if (notNullorUndef<string>(req.body.content)) comment.content = req.body.content;

		await comment.save();
		return Ok(res, {
			oldComment,
			newComment: serializeComment(comment)
		});
	},
	report: async (req: CommentRequest, res: CommentResponse) => {
		const comment = res.locals.fetchComment;
		await req.app.reporter.make({
			method: 'POST',
			body: {
				embeds: [
					{
						title: 'New report on a comment!',
						description: stripIndents`
							**Reporting User:** ${req.user?._id ?? 'ANONYMOUS'}.
							**Reported User:** ${comment.author}
							**Reported Comment:** ${comment._id}
							**Reason:** ${req.body.reason}
							\`\`\`
							${comment.content}
							\`\`\` 
						`
						// color: 15158332,
						// timestamp: new Date().toISOString()
					}
				]
			}
		});
		return Ok(res, {});
	}
};
