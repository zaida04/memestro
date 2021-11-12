import type { NextFunction, Request, Response } from 'express';
import { userModel } from '@db/models/User';
import { buildLogger, makeBadRequestError, makeUnauthorizedError } from '@util/index';
import { decryptFormattedJWT } from '../util/token';

export const buildAuthMiddleware = (JWT_KEY: string) => {
	const logger = buildLogger('API:AUTH');
	return async (req: Request<{ authorization?: string }>, res: Response, next: NextFunction) => {
		const { authorization } = req.headers;
		if (!authorization || !authorization.trim().startsWith('Bearer ')) {
			logger.warn(`Rejected request from ${req.ip} for no proper Auth header.`);
			return makeUnauthorizedError(res, 'You must provide a valid token.');
		}

		const id = decryptFormattedJWT(authorization.slice(7).trim(), JWT_KEY);
		if (!id) {
			logger.warn(`Rejected request from ${req.ip} because payload could not be serialized to a proper ID.`);
			return makeBadRequestError(res, 'Malformed token');
		}

		const user = await userModel.findById(id);
		if (!user) {
			logger.warn(`Rejected request from ${req.ip} because user associated with ID doesn't exist.`);
			return makeBadRequestError(res, 'User associated with ID in token payload does NOT exist.');
		}
		logger.info(`Request from ${req.ip} linked to ${user.id}`);

		req.user = user;
		return next();
	};
};

/**
 * import { Request, Response, NextFunction } from "express";


export const authMiddleware = (key: string) => {
    const logger = buildLogger("API:AUTH");
    return async (req: Request, res: Response, next: NextFunction) => {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            logger.warn(`Rejected request from ${req.ip} for no proper Auth header.`);
            return res.status(StatusCodes.UNAUTHORIZED).json({
                code: StatusCodes.UNAUTHORIZED,
                errors: [
                    {
                        message:
                            "You must supply an authorization header with your requests with a valid token."
                    }
                ]
            });
        }
        const { id, tokenLastUpdatedAt } = decryptFormattedJWT(authorization.slice(7).trim(), key);
        if (!id || !tokenLastUpdatedAt) {
            logger.warn(
                `Rejected request from ${req.ip} because payload could not be serialized to a proper ID and tokenLastUpdatedAt Date.`
            );
            return res.status(400).json({
                code: StatusCodes.BAD_REQUEST,
                errors: [
                    {
                        message: "You have provided a malformed token in the authorization header."
                    }
                ]
            });
        }
        const user = await profileModel.findById(id);
        logger.info(`Request from ${req.ip} linked to ${user?.id}`);
        if (!user || user.lastTokenGeneratedAt.getTime() !== tokenLastUpdatedAt.getTime()) {
            logger.warn(
                `Rejected request from ${req.ip} because either user associated with ID doesn't exist, or the tokenLastUpdatedAt doesn't match up with db record.`
            );
            return res.status(400).json({
                code: StatusCodes.BAD_REQUEST,
                errors: [
                    {
                        message:
                            "You have provided a token with a malformed payload. The ID associated with this token is invalid or the last token generation date is invalid."
                    }
                ]
            });
        }
        res.locals.user = user;
        return next();
    };
};

 */
