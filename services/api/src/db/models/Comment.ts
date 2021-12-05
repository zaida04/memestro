import { model, Schema, Document, ObjectId } from 'mongoose';
import { requiredString, numberEqGZero, requiredID, defaultBool } from '../../util';

export interface IComment extends Document<any, any, IComment> {
	author: ObjectId;
	post: ObjectId;
	content: string;
	upvotes: number;
	downvotes: number;
	deleted: boolean;
}

const commentSchema = new Schema(
	{
		author: requiredID,
		post: requiredID,
		content: requiredString,
		upvotes: numberEqGZero,
		downvotes: numberEqGZero,
		deleted: defaultBool
	},
	{ timestamps: true }
);

export const commentModel = model<IComment>('Comment', commentSchema);
