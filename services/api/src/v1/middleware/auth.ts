import type { NextFunction, Request, Response } from 'express';
import { userModel } from '#db/models/User';
import { buildLogger, BadRequest, Unauthorized, InternalError } from '#util/index';
import { decryptFormattedJWT } from '../util/token';

export const buildAuthMiddleware = (JWT_KEY: string) => {
	const logger = buildLogger('API:AUTH');
	return async (req: Request<{ authorization?: string }>, res: Response, next: NextFunction) => {
		const { authorization } = req.headers;
		const isProperToken = authorization && authorization.trim().startsWith('Bearer ');
		if (isProperToken) {
			let id;
			try {
				id = decryptFormattedJWT(authorization.slice(7).trim(), JWT_KEY);
			} catch (e) {
				logger.error(`Bad JWT providedf rom ${req.ip}. ${e} - ${authorization}`);
				return InternalError(res);
			}

			if (!id) {
				logger.warn(`Rejected request from ${req.ip} because payload could not be serialized to a proper ID.`);
				return BadRequest(res, 'Malformed token');
			}
			const user = await userModel.findById(id);
			if (!user || user.deleted) {
				logger.warn(`Rejected request from ${req.ip} because user associated with ID doesn't exist.`);
				return BadRequest(res, 'User associated with ID in token payload does NOT exist.');
			}
			logger.info(`Request from ${req.ip} linked to ${user.id} for ${req.method} ${req.url}`);
			req.user = user;
		}
		return next();
	};
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) return Unauthorized(res, 'You must provide an authentication token to do this!');
	return next();
};
