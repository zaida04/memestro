import { Router } from 'express';
import postController from '../controllers/post';
import { routeValidator, validParam } from '#util/http';
import multer from 'multer';
import { CloudflareStorage } from 'multer-cloudflare-storage';
import { body } from 'express-validator';
const postsRouter = Router();
const uploader = multer({
	storage: new CloudflareStorage(process.env.CDN_ACCOUNT_ID, process.env.CDN_TOKEN)
});

postsRouter.post(
	/** Create Post */
	'/',
	routeValidator(
		/** Required params */
		body('title').isLength({ min: 3, max: 50 }),
		body('category').isString().stripLow()
	),
	uploader.single('image'),
	postController.post
);

postsRouter
	.route('/:postID')
	/* Validate post exists */
	.all(validParam('postID'), postController.validator)
	/* Return post */
	.get(postController.get)
	/* Edit post */
	.patch(postController.patch)
	/* Delete post */
	.delete(postController.delete);

export default postsRouter;
