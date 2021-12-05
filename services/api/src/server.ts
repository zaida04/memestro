import { buildLogger, RestUtil } from './util';
import v1Router from './v1';
import mongoose from 'mongoose';
import express from 'express';

const app = express();
app.reporter = new RestUtil({ apiURL: process.env.REPORT_WEBHOOK, full: true }, {});
const logger = buildLogger(`API:${process.pid}`);
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

// Why do we export? For testing reasons, so we can import the server in mocha/chai
export default app;
