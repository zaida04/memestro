import { Router } from 'express';
import commentsController from '../controllers/comment';
const commentsRouter = Router();

commentsRouter.post('/', commentsController.post);
commentsRouter
	.route('/:userID')
	/* Validate that comment exists */
	.all(commentsController.validator)
	/* Return comment */
	.get(commentsController.get)
	/* Edit comment */
	.patch(commentsController.patch)
	/* Delete comment */
	.delete(commentsController.delete);

export default commentsRouter;
