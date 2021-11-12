import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export enum StatusCodes {
	ACCEPTED = 202,
	BAD_REQUEST = 400,
	CONFLICT = 409,
	CREATED = 201,
	IM_A_TEAPOT = 418,
	NO_CONTENT = 204,
	NOT_FOUND = 404,
	OK = 200,
	REQUEST_TIMEOUT = 408,
	REQUEST_TOO_LONG = 413,
	SERVICE_UNAVAILABLE = 503,
	TOO_MANY_REQUESTS = 429,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403
}

export enum StatusResponses {
	BAD_REQUEST = 'BAD_REQUEST',
	NOT_FOUND = 'NOT_FOUND',
	UNAUTHORIZED = 'UNAUTHORIZED',
	FORBIDDEN = 'FORBIDDEN'
}

export const makeError = (res: Response, statusCode: StatusCodes, statusResponse: StatusResponses, errors: string | string[]) =>
	res.status(statusCode).json({
		code: statusResponse,
		errors: Array.isArray(errors) ? errors : [{ message: errors }]
	});

export const makeBadRequestError = (res: Response, errors: string | string[]) =>
	/* Construct 400 errors easy */
	makeError(res, StatusCodes.BAD_REQUEST, StatusResponses.BAD_REQUEST, errors);

export const make404Error = (res: Response, errors: string | string[]) =>
	/* Construct 404 errors easy */
	makeError(res, StatusCodes.NOT_FOUND, StatusResponses.NOT_FOUND, errors);

export const makeUnauthorizedError = (res: Response, errors: string | string[]) =>
	/** Construct 403 errors easy */
	makeError(res, StatusCodes.UNAUTHORIZED, StatusResponses.UNAUTHORIZED, errors);

export const makeForbiddenError = (res: Response, errors: string | string[]) =>
	makeError(res, StatusCodes.FORBIDDEN, StatusResponses.FORBIDDEN, errors);

export const makeSuccessfulRes = (res: Response, payload: Record<string, any>) => res.status(StatusCodes.OK).json(payload);

export default function routeValidator(...validations: any[]) {
	return async (req: Request, res: Response, next: NextFunction) => {
		// Run all validators on request, so we can get *everything* that's wrong with a request at once instead of one by one
		await Promise.all(validations.map((validation) => validation.run(req)));

		const errors = validationResult(req).formatWith(({ msg, param, value }) => {
			return {
				param,
				message: msg,
				value: value ?? null
			};
		});
		if (errors.isEmpty()) return next();

		// This shitty hack is used to get rid of duplicate errors with a single request property.
		const errorMap = new Map();
		for (const error of errors.array()) {
			errorMap.set(error.param, error);
		}

		return makeBadRequestError(res, Array.from(errorMap.values()));
	};
}

export const notNullorUndef = <T>(value: any): value is T => !(value === null || value === undefined);
