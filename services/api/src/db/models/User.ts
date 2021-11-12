import { model, Schema, Document, ObjectId } from 'mongoose';
import { defaultBool, requiredString, numberEqGZero, requiredID, ROLES } from '../../util';

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
	deleted: boolean;
	roles: typeof ROLES[number][];
}

const userSchema = new Schema(
	{
		oauth: {
			googleID: String,
			discordID: String
		},
		info: {
			username: {
				...requiredString,
				unique: true
			},
			email: {
				...requiredString,
				unique: true
			},
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
		deleted: defaultBool,
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

export const baseUserData = {
	oauth: {
		googleID: null,
		discordID: null
	},
	info: {
		avatarURL: null
	},
	settings: {
		theme: 'DEFAULT'
	},
	stats: {
		followers: [],
		followersCount: 0,
		following: [],
		followingCount: 0,
		commentPoints: 0,
		postPoints: 0,
		mainfeedCount: 0
	},
	content: {
		comments: [],
		posts: [],
		bookmarked: []
	},
	roles: ['MEMBER']
} as const;

export const userModel = model<IUser>('User', userSchema);
