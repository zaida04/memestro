import fetch from 'node-fetch';
import type { StorageEngine } from 'multer';
import type { Request } from 'express';
import FormData from 'form-data';

interface CloudflareCDNUploadResponse {
	success: boolean;
	result: {
		id: string;
		filename: string;
		metadata: {
			meta: string;
		};
		requireSignedURLs: boolean;
		variants: {
			thumbnail: string;
			hero: string;
			original: string;
		};
		uploaded: string;
	}[];
}

class CloudflareStorage implements StorageEngine {
	private destURL: string;
	public constructor(private accountID: string, private accountToken: string) {
		if (!accountID || typeof accountID === 'string') throw new Error('You must specify a proper accountID belonging to your cloudflare account.');
		if (!accountToken || typeof accountToken === 'string') throw new Error('You must specify a proper account token.');
		this.destURL = `https://api.cloudflare.com/client/v4/accounts/${this.accountID}/images/v1`;
	}

	public _handleFile(req: Request, file: Express.Multer.File, callback: (error?: any, info?: Partial<Express.Multer.File>) => void): void {
		const body = new FormData();
		body.append('file', file.stream);
		void fetch(this.destURL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.accountToken}`,
				...body.getHeaders()
			},
			body
		})
			.then((response) => response.json() as Promise<CloudflareCDNUploadResponse>)
			.then((data) => {
				callback(null, {
					path: data.result[0].variants.original,
					filename: data.result[0].filename,
					destination: data.result[0].id
				});
			});
	}

	public _removeFile(_req: Request, file: Express.Multer.File, callback: (error: Error | null) => void): void {
		void fetch(`${this.destURL}/${file.destination}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${this.accountToken}`
			}
		}).then((response) => {
			if (response.ok) return callback(null);
			return callback(new Error());
		});
	}
}

export { CloudflareStorage };
export default CloudflareStorage;
