import { Router } from 'express';
import postController from '../controllers/post';
import multer from 'multer';
import { routeValidator } from '#util/http';
import { CloudflareStorage } from 'multer-cloudflare-storage';
import { body } from 'express-validator';
import commentsRouter from './comments';
import { requireAuth } from '../middleware/auth';

const postsRouter = Router();
const uploader = multer({
	storage: new CloudflareStorage(process.env.CDN_ACCOUNT_ID, process.env.CDN_TOKEN)
});

postsRouter.post(
	/** Create Post */
	'/',
	requireAuth,
	uploader.single('image'),
	routeValidator(
		/** Required params */
		body('title').isLength({ min: 3, max: 50 }),
		body('category').isString().stripLow()
	),
	postController.post
);

/* Validate post exists */
postsRouter.use('/:postID', postController.validator);
postsRouter
	.route('/:postID')
	/* Return post */
	.get(postController.get)
	/* Edit post */
	.patch(requireAuth, postController.patch)
	/* Delete post */
	.delete(requireAuth, postController.delete);

postsRouter.post('/:postID/report', routeValidator(body('reason').isString().isLength({ min: 5, max: 250 })), postController.report);
postsRouter.use('/:postID/comments', postController.validator, commentsRouter);

export default postsRouter;
