import { model, Schema, Document, ObjectId } from 'mongoose';
import { requiredString, numberEqGZero, requiredID, ROLES } from '../util';

export interface IUser extends Document<any, any, IUser> {
	oauth: {
		googleID: string | null;
		discordID: string | null;
	};
	info: {
		username: string;
		email: string;
		password: string | null;
		avatarURL: string | null;
	};
	settings: {
		theme: string;
	};
	stats: {
		followers: ObjectId[];
		followersCount: number;
		following: ObjectId[];
		followingCount: number;
		commentPoints: number;
		postPoints: number;
		mainfeedCount: number;
	};
	content: {
		comments: ObjectId[];
		posts: ObjectId[];
		bookmarked: ObjectId[];
	};
	roles: typeof ROLES[number][];
}

const userSchema = new Schema(
	{
		oauth: {
			googleID: String,
			discordID: String
		},
		info: {
			username: requiredString,
			email: requiredString,
			password: String,
			avatarURL: String
		},
		settings: {
			theme: String
		},
		stats: {
			followers: [requiredID],
			following: [requiredID],
			followersCount: {
				...numberEqGZero,
				max: 15_000
			},
			followingCount: {
				...numberEqGZero,
				max: 1_000
			},
			commentPoints: {
				...numberEqGZero,
				max: 1_000_000
			},
			postPoints: {
				...numberEqGZero,
				max: 1_000_000
			},
			mainfeedCount: {
				...numberEqGZero,
				max: 10_000
			}
		},
		content: {
			comments: [requiredID],
			posts: [requiredID],
			bookmarked: [requiredID]
		},
		roles: [
			{
				type: String,
				trim: true,
				enum: ROLES
			}
		]
	},
	{ timestamps: true }
);

export const userModel = model<IUser>('User', userSchema);
