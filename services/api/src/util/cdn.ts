import { MakeOptions } from '.';
import { JSONB, RestUtil } from './http';

export class CDN extends RestUtil {
	public constructor(private accountID: string, private token: string) {
		super(`https://api.cloudflare.com/client/v4/accounts/${accountID}/images/v1`);
	}

	public async make<T extends JSONB>(data: MakeOptions) {
		return super.make<T>({
			headers: {
				Authorization: `Bearer ${this.token}`
			},
			...data
		});
	}
}
