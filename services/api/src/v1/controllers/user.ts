import type { NextFunction, Request, Response } from 'express';
import { baseUserData, IUser, userModel } from '#db/models/User';
import { NotFound } from '#util/index';
import { serializeUser } from '#db/serializers';
import { BadRequest, notNullorUndef, Ok, Forbidden } from '#util/http';
import { hasPermission } from '#util/permissions';
import { createJWT } from '../util/token';
import { stripIndents } from 'common-tags';

type UserRequest = Request<{ userID: string }>;
type UserResponse = Response<unknown, { fetchUser: IUser }>;

export default {
	validator: async (req: UserRequest, res: Response, next: NextFunction) => {
		const user = await userModel.findById(req.params.userID);
		if (!user) return NotFound(res, 'The user with the specified ID does not exist.');
		res.locals.fetchUser = user;
		return next();
	},
	get: (_req: UserRequest, res: UserResponse) => {
		return Ok(res, serializeUser(res.locals.fetchUser));
	},
	post: async (req: UserRequest, res: UserResponse) => {
		const { username, email, password, avatarURL }: { username: string; email: string; password: string; avatarURL: string } = req.body;
		const potentialExistingUserCheck = await userModel.findOne({
			$or: [{ 'info.email': email }, { 'info.username': username }]
		});

		if (potentialExistingUserCheck !== null) return BadRequest(res, 'There is already an account associated with this email or username.');
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
		return Ok(res, { token, id: user._id });
	},
	delete: async (req: UserRequest, res: UserResponse) => {
		const user = res.locals.fetchUser;
		const executingUser = req.user!;
		if (!executingUser._id.equals(user._id) && !hasPermission(executingUser, 'MODERATOR'))
			return Forbidden(res, 'You do not have permission to delete this user.');

		user.deleted ||= true;
		await user.save();
		return Ok(res, { ...serializeUser(user), deleted: user.deleted });
	},
	patch: async (req: UserRequest, res: UserResponse) => {
		const user = res.locals.fetchUser;
		const executingUser = req.user!;
		if (!executingUser._id.equals(user._id) && !hasPermission(executingUser, 'ADMIN'))
			return Forbidden(res, 'You do not have permission to edit this user.');
		const oldUser = Object.freeze(serializeUser(user.toJSON()));
		if (notNullorUndef<string>(req.body.username)) user.info.username = req.body.username;
		if (notNullorUndef<string>(req.body.avatarURL)) user.info.avatarURL = req.body.avatarURL;
		if (notNullorUndef<string>(req.body.email)) user.info.email = req.body.email;

		await user.save();
		return Ok(res, {
			oldUser,
			newUser: serializeUser(user)
		});
	},
	report: async (req: UserRequest, res: UserResponse) => {
		const user = res.locals.fetchUser;
		await req.app.reporter.make({
			method: 'POST',
			body: {
				embeds: [
					{
						title: 'New report on a user!',
						description: stripIndents`
							**Reporting User:** ${req.user?._id ?? 'ANONYMOUS'}
							**Reported User:** ${user._id}
							**Reason:** 
							\`\`\`
							${req.body.reason}
							\`\`\`
						`,
						color: 15158332,
						timestamp: new Date().toISOString()
					}
				]
			}
		});
		return Ok(res, {});
	}
};
