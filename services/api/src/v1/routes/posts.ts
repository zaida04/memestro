import { Router } from 'express';
import postController from '../controllers/post';
import multer from '@util/multer';
const postsRouter = Router();

postsRouter.post('/', postController.post);
postsRouter
	.route('/:postID')
	/* Validate post exists */
	.all(postController.validator)
	/* Return post */
	.get(postController.get)
	/* Create post */
	.post(multer.getInstance().single('image'), postController.post)
	/* Edit post */
	.patch(postController.patch)
	/* Delete post */
	.delete(postController.delete);

export default postsRouter;
