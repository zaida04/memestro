import { model, Schema, Document, ObjectId } from 'mongoose';
import { requiredString, numberEqGZero, requiredID } from '../util';

export interface IPost extends Document<any, any, IPost> {
	author: ObjectId;
	shortURL: string;
	contentURL: string;
	upvotes: number;
	downvotes: number;
}

const postSchema = new Schema(
	{
		author: requiredID,
		shortURL: requiredString,
		contentURL: requiredString,
		upvotes: numberEqGZero,
		downvotes: numberEqGZero
	},
	{ timestamps: true }
);

export const postModel = model<IPost>('Post', postSchema);
