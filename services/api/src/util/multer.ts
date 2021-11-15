import multer, { Multer } from 'multer';
import cloudStorage from './multer-storage-cloudflare';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class MulterSingleton {
	private static _instance?: Multer;
	public static createInstance(acc_id: string, acc_token: string) {
		this._instance = multer({
			storage: new cloudStorage(acc_id, acc_token)
		});
	}

	public static getInstance() {
		if (MulterSingleton._instance) return MulterSingleton._instance;
		throw new Error('No multer instance!!');
	}
}

export { MulterSingleton };
export default MulterSingleton;
