import fetch, { Response } from 'node-fetch';

export type JSONB = Record<string, any>;
export type RequestBodyObject = JSONB | undefined;
export interface MakeOptions {
	method: string;
	path?: string;
	body?: Record<string, any>;
	headers?: Record<string, any>;
}

export class HTTPError extends Error {
	public constructor(msg: string, public method: string, public path: string, public code: number | string) {
		super(`[HTTPError:${code}:${method.toUpperCase()}] ${path} - ${msg}`);
	}
}

export class RestUtil {
	public constructor(private options: { apiURL: string; full: boolean }, private headers: Record<string, any> = {}) {}
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

		let request: Response;
		try {
			request = await fetch(this.options.full ? this.options.apiURL : this.options.apiURL + data.path, requestOptions);
		} catch (e: any) {
			throw new Error(`Error while making API call, ${e.message.toString()}`);
		}

		if (!request.ok) {
			const parsedRequest = await request.json().catch(() => request.text().catch(() => ({ message: 'Cannot parse JSON Error Response.' })));
			throw new HTTPError(JSON.stringify(parsedRequest.message ?? parsedRequest), data.method, data.path ?? this.options.apiURL, request.status);
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
