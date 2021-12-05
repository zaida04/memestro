import { model, Schema, Document, ObjectId } from 'mongoose';
import { requiredString, numberEqGZero, requiredID, defaultBool } from '../../util';

export interface IPost extends Document<any, any, IPost> {
	author: ObjectId;
	shortURL: string;
	title: string;
	contentURL: string;
	upvotes: number;
	downvotes: number;
	deleted: boolean;
	comments: string[];
}

const postSchema = new Schema(
	{
		author: requiredID,
		shortURL: {
			...requiredString,
			unique: true
		},
		title: requiredString,
		contentURL: requiredString,
		upvotes: numberEqGZero,
		downvotes: numberEqGZero,
		deleted: defaultBool,
		comments: [requiredID]
	},
	{ timestamps: true }
);

export const postModel = model<IPost>('Post', postSchema);
