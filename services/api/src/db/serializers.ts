import type { LeanDocument } from 'mongoose';
import type { IComment } from './models/Comment';
import type { IPost } from './models/Post';
import type { IUser } from './models/User';

/**
 *
 * What are the purposes of serializers?
 * Picture this, you add a new prop to the mongoose schema that turns out to be sensitive data
 * Boom, you forget to make sure it isn't sent out in a public request and now you are leaking private data
 * We use serializers, which are just methods that return a strict set of properties
 * When we add new properties we want to sent through to the frontend, we add it to the serializer.
 * It's tedious, but it'll prevent leaks.
 *
 */

type leanOrNot<T> = T | LeanDocument<T>;

export const serializeComment = (comment: leanOrNot<IComment>) => ({
	author: comment.author,
	content: comment.content,
	upvotes: comment.upvotes,
	downvotes: comment.downvotes
});

export const serializeUser = (user: leanOrNot<IUser>) => ({
	info: {
		username: user.info.username,
		avatarURL: user.info.avatarURL
	},
	stats: {
		followersCount: user.stats.followersCount,
		followingCount: user.stats.followingCount,
		commentPoints: user.stats.commentPoints,
		postPoints: user.stats.postPoints,
		mainfeedCount: user.stats.mainfeedCount
	}
});

export const serializePost = (post: leanOrNot<IPost>) => ({
	author: post.author,
	shortURL: post.shortURL,
	contentURL: post.contentURL,
	upvotes: post.upvotes,
	downvotes: post.downvotes,
	title: post.title
});
