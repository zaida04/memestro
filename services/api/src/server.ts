import { buildLogger } from './util';
import v1Router from './v1';
import mongoose from 'mongoose';
import express from 'express';
import multerSingleton from '@util/multer';

export const startApplication = () => {
	const app = express();
	const port = process.env.PORT ?? 3005;
	const logger = buildLogger(`API:${process.pid}`);
	multerSingleton.createInstance(process.env.CDN_ACCOUNT_ID, process.env.CDN_TOKEN);
	mongoose
		.connect(process.env.MONGO_URL, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		.then(() => logger.info('MongoDB Connected'))
		.catch(logger.error);

	app.use(express.json());
	app.get('/', (_, res) =>
		res.json({
			message:
				'Welcome to the Memestro API. This is a private API that is not available to the public. Please do not use this API if you are not authorized'
		})
	);
	app.use('/api/v1', v1Router);
	app.listen(port, () => logger.info(`Server process started on port ${port} on process ${process.pid}`));
};
