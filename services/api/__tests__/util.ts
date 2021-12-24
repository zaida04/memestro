import fetch, { Response, HeadersInit } from 'node-fetch';
import { config } from 'dotenv';
import { join } from 'path';
import { existsSync } from 'fs';
import FormData from 'form-data';

export const setupTestEnvironment = () => {
	const env_path = join(__dirname, '..', 'testing.env');
	if (!existsSync(env_path)) throw new Error('Missing a testing env file in the api service folder!');
	config({ path: env_path });
};

export const createUser = (requester: Requester) => {
	return requester.make<{ id: string; token: string }>('/users', {
		method: 'POST',
		body: {
			username: `TESTINGACC${Math.floor(Math.random() * 100000 + 1)}`,
			email: `test${Math.floor(Math.random() * 100000 + 1)}@email1.com`,
			password: 'testingpassword',
			avatarURL: 'https://google.com'
		}
	});
};

interface Req {
	body?: Record<string, any>;
	method: string;
	headers?: Record<string, any>;
}

export class Requester {
	public user: { id: string; token: string } | undefined;
	public constructor(public HOST: string, public PORT: string | number) {}

	public async make<T = Record<string, any>>(path: string, options: Req): Promise<[Response, T]> {
		const headers: HeadersInit = {
			'content-type': 'application/json',
			...options.headers
		};
		if (this.user?.token) headers.Authorization = `Bearer ${this.user.token}`;
		const req = await fetch(`http://${this.HOST}:${this.PORT}/api/v1${path}`, {
			headers,
			body: options.body ? (options.body instanceof FormData ? options.body : JSON.stringify(options.body)) : undefined,
			method: options.method
		});

		const data = (await req.json()) as T;
		console.log(`	\x1b[31m${options.method} \x1b[33m${path}: \x1b[0m${JSON.stringify(data)}`);

		return [req, data];
	}

	public makeReq<T = Record<string, any>>(path: string, options: Req) {
		return this.make<T>(path, options).then((res) => res[0]);
	}

	public makeData<T = Record<string, any>>(path: string, options: Req) {
		return this.make<T>(path, options).then((res) => res[1]);
	}

	public setUser(data: { id: string; token: string } | undefined) {
		this.user = data;
	}
}
