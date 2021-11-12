import { model, Schema, Document, ObjectId } from 'mongoose';
import { requiredString, numberEqGZero, requiredID } from '../../util';

export interface IComment extends Document<any, any, IComment> {
	author: ObjectId;
	content: string;
	upvotes: number;
	downvotes: number;
}

const commentSchema = new Schema(
	{
		author: requiredID,
		content: requiredString,
		upvotes: numberEqGZero,
		downvotes: numberEqGZero
	},
	{ timestamps: true }
);

export const commentModel = model<IComment>('Comment', commentSchema);
