import { config } from 'dotenv';
import { join } from 'path';
import { expect } from 'chai';
import fetch from 'node-fetch';
import { existsSync } from 'fs';

const env_path = join(__dirname, '..', 'testing.env');
if (!existsSync(env_path)) throw new Error('Missing a testing env file in the api service folder!');
config({ path: env_path });
if (!process.env.TESTING_PORT) throw new Error('Missing TESTING_PORT!');

let auth_token: string;
const requester = (path: string) =>
	fetch(`http://localhost:${process.env.TESTING_PORT}/api/v1${path}`, {
		headers: {
			Authorization: auth_token ? `Bearer ${auth_token}` : undefined
		} as any
	});

describe('Test API', () => {
	it('Is server alive', async () => {
		expect((await requester('/')).status).to.be.a('number');
	});
});
