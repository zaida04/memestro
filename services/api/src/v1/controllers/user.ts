import type { NextFunction, Request, Response } from 'express';
import { baseUserData, IUser, userModel } from '@db/models/User';
import { make404Error } from '@util/index';
import { serializeUser } from '@db/serializers';
import { makeBadRequestError, notNullorUndef, makeSuccessfulRes, makeForbiddenError } from '@util/http';
import { hasPermission } from '@util/permissions';
import { createJWT } from '../util/token';

type UserRequest = Request<{ userID: string }>;
type UserResponse = Response<unknown, { fetchUser: IUser }>;

export default {
	validator: async (req: UserRequest, res: Response, next: NextFunction) => {
		const user = await userModel.findById(req.params.userID);
		if (!user) return make404Error(res, 'The user with the specified ID does not exist.');
		res.locals.fetchUser = user;
		return next();
	},
	get: (_req: UserRequest, res: UserResponse) => {
		return makeSuccessfulRes(res, serializeUser(res.locals.fetchUser));
	},
	post: async (req: UserRequest, res: UserResponse) => {
		const { username, email, password, avatarURL }: { username: string; email: string; password: string; avatarURL: string } = req.body;
		const potentialExistingUserCheck = await userModel.findOne({
			$or: [{ 'info.email': email }, { 'info.username': username }]
		});

		if (potentialExistingUserCheck !== null) return makeBadRequestError(res, 'There is already an account associated with this email or username.');
		const user = new userModel({
			...baseUserData,
			info: {
				email,
				username,
				password,
				avatarURL
			}
		});
		await user.save();
		const token = createJWT(user._id, process.env.JWT_KEY);
		return makeSuccessfulRes(res, { token });
	},
	delete: async (req: UserRequest, res: UserResponse) => {
		const user = res.locals.fetchUser;
		const executingUser = req.user!;

		if (executingUser._id !== user._id && hasPermission(executingUser, 'MODERATOR'))
			return makeForbiddenError(res, 'You do not have permission to delete this user.');
		user.deleted ||= true;
		await user.save();
		return makeSuccessfulRes(res, serializeUser(user.toJSON()));
	},
	patch: async (req: UserRequest, res: UserResponse) => {
		const user = res.locals.fetchUser;
		const oldUser = Object.freeze(serializeUser(user.toJSON()));
		if (notNullorUndef<string>(req.body.username)) user.info.username = req.body.username;
		if (notNullorUndef<string>(req.body.avatarURL)) user.info.avatarURL = req.body.avatarURL;

		await user.save();
		return makeSuccessfulRes(res, {
			oldUser,
			newUser: serializeUser(user)
		});
	}
};
