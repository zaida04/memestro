import type { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import fetch from 'node-fetch';

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

export const makeBadRequestError = (res: Response, errors: ErrorPayload) =>
	/* Construct 400 errors easy */
	makeError(res, StatusCodes.BAD_REQUEST, StatusResponses.BAD_REQUEST, errors);

export const make404Error = (res: Response, errors: ErrorPayload) =>
	/* Construct 404 errors easy */
	makeError(res, StatusCodes.NOT_FOUND, StatusResponses.NOT_FOUND, errors);

export const makeUnauthorizedError = (res: Response, errors: ErrorPayload) =>
	/** Construct 401 errors easy */
	makeError(res, StatusCodes.UNAUTHORIZED, StatusResponses.UNAUTHORIZED, errors);

export const makeForbiddenError = (res: Response, errors: ErrorPayload) =>
	/** Construct 403 errors easy */
	makeError(res, StatusCodes.FORBIDDEN, StatusResponses.FORBIDDEN, errors);

export const makeSuccessfulRes = (res: Response, payload: Record<string, any>) => res.status(StatusCodes.OK).json(payload);

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
		return makeBadRequestError(res, errors.array());
	};
}

export const notNullorUndef = <T>(value: any): value is T => !(value === null || value === undefined);
export type JSONB = Record<string, any>;
export type RequestBodyObject = JSONB | undefined;
export interface MakeOptions {
	method: string;
	path: string;
	body?: Record<string, any>;
	headers?: Record<string, any>;
}

export class HTTPError extends Error {
	public constructor(msg: string, public method: string, public path: string, public code: number | string) {
		super(`[HTTPError:${code}:${method.toUpperCase()}] ${path} - ${msg}`);
	}
}

export class RestUtil {
	public constructor(private apiURL: string, private headers: Record<string, any>) {}
	public async make<T extends JSONB>(data: MakeOptions): Promise<T> {
		const headers = { ...(data.headers ?? {}), ...this.headers };
		const requestOptions = {
			body: data.body ? JSON.stringify(data.body) : undefined,
			headers: {
				'content-type': 'application/json',
				...headers
			},
			method: data.method
		};

		let request;
		try {
			request = await fetch(this.apiURL + data.path, requestOptions);
		} catch (e: any) {
			throw new Error(`Error while making API call, ${e.message.toString()}`);
		}

		if (!request.ok) {
			const parsedRequest = await request.json().catch(() => ({ message: 'Cannot parse JSON Error Response.' }));
			throw new HTTPError(parsedRequest.message, data.method, data.path, request.status);
		}

		return request.json().catch(() => ({})) as Promise<T>;
	}

	public get<T extends JSONB>(path: string): Promise<T> {
		return this.make<T>({
			method: 'GET',
			path
		});
	}

	public post<T extends JSONB, B = RequestBodyObject>(path: string, body?: B): Promise<T> {
		return this.make<T>({
			body,
			method: 'POST',
			path
		});
	}

	public delete<T extends JSONB, B = RequestBodyObject>(path: string, body?: B): Promise<T> {
		return this.make<T>({
			body,
			method: 'DELETE',
			path
		});
	}

	public patch<T extends JSONB, B = RequestBodyObject>(path: string, body: B): Promise<T> {
		return this.make<T>({
			body,
			method: 'PATCH',
			path
		});
	}

	public put<T extends JSONB, B = RequestBodyObject>(path: string, body?: B): Promise<T> {
		return this.make<T>({
			body,
			method: 'PUT',
			path
		});
	}
}

export const validParam = (name: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (req.params[name] && !isValidObjectId(req.params[name])) return makeBadRequestError(res, `Invalid format for URL param ${name}`);
		return next();
	};
};
