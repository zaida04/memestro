import { Router } from 'express';
import commentsController from '../controllers/comment';
import { validParam } from '#util/http';
const commentsRouter = Router();

commentsRouter.post('/', commentsController.post);
commentsRouter
	.route('/:commentID')
	/* Validate that comment exists */
	.all(validParam('commentID'), commentsController.validator)
	/* Return comment */
	.get(commentsController.get)
	/* Edit comment */
	.patch(commentsController.patch)
	/* Delete comment */
	.delete(commentsController.delete);

export default commentsRouter;
