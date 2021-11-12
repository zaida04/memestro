import { Router } from 'express';
import postController from '../controllers/post';
const postsRouter = Router();

postsRouter.post('/', postController.post);
postsRouter
	.route('/:postID')
	/* Validate post exists */
	.all(postController.validator)
	/* Return post */
	.get(postController.get)
	/* Edit post */
	.patch(postController.patch)
	/* Delete post */
	.delete(postController.delete);

export default postsRouter;
