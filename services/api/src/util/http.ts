import type { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { isValidObjectId } from 'mongoose';

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

type ErrorPayload = string | string[] | Record<string, any>[];

export const makeError = (res: Response, statusCode: StatusCodes, statusResponse: StatusResponses, errors: ErrorPayload) =>
	res.status(statusCode).json({
		code: statusResponse,
		errors: Array.isArray(errors) ? errors : [{ message: errors }]
	});

export const BadRequest = (res: Response, errors: ErrorPayload) =>
	/* Construct 400 errors easy */
	makeError(res, StatusCodes.BAD_REQUEST, StatusResponses.BAD_REQUEST, errors);

export const NotFound = (res: Response, errors: ErrorPayload) =>
	/* Construct 404 errors easy */
	makeError(res, StatusCodes.NOT_FOUND, StatusResponses.NOT_FOUND, errors);

export const Unauthorized = (res: Response, errors: ErrorPayload) =>
	/** Construct 401 errors easy */
	makeError(res, StatusCodes.UNAUTHORIZED, StatusResponses.UNAUTHORIZED, errors);

export const Forbidden = (res: Response, errors: ErrorPayload) =>
	/** Construct 403 errors easy */
	makeError(res, StatusCodes.FORBIDDEN, StatusResponses.FORBIDDEN, errors);

export const Ok = (res: Response, payload: Record<string, any>) => res.status(StatusCodes.OK).json(payload);

export function routeValidator(...validations: Array<ValidationChain>) {
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
		return BadRequest(res, errors.array());
	};
}

export const notNullorUndef = <T>(value: any): value is T => !(value === null || value === undefined);
export const validParam = (name: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (req.params[name] && !isValidObjectId(req.params[name])) return BadRequest(res, `Invalid format for URL param ${name}`);
		return next();
	};
};
