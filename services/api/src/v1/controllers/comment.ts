import type { NextFunction, Request, Response } from 'express';
import { commentModel, IComment } from '#db/models/Comment';
import { make404Error } from '#util/index';

type CommentRequest = Request<{ commentID: string }>;
type CommentResponse = Response<unknown, { fetchComment: IComment }>;

export default {
	validator: async (req: CommentRequest, res: CommentResponse, next: NextFunction) => {
		const comment = await commentModel.findById(req.params.commentID);
		if (!comment) return make404Error(res, 'The comment with the specified ID does not exist.');
		res.locals.fetchComment = comment;
		return next();
	},
	get: (req: CommentRequest, res: CommentResponse) => {
		return res.status(501).json({});
	},
	post: (req: CommentRequest, res: CommentResponse) => {
		return res.status(501).json({});
	},
	delete: (req: CommentRequest, res: CommentResponse) => {
		return res.status(501).json({});
	},
	patch: (req: CommentRequest, res: CommentResponse) => {
		return res.status(501).json({});
	}
};
