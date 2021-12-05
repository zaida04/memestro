import { Router } from 'express';
import commentsController from '../controllers/comment';
import { routeValidator, validParam } from '#util/http';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth';
const commentsRouter = Router();

commentsRouter
	.route('/')
	.post(
		requireAuth,
		routeValidator(
			/** Required params */
			body('content').isLength({ min: 3, max: 50 })
		),
		commentsController.post
	)
	.get(commentsController.getAll);

/* Validate that comment exists */
commentsRouter.use('/:commentID', validParam('commentID'), commentsController.validator);
commentsRouter
	.route('/:commentID')
	/* Return comment */
	.get(commentsController.get)
	/* Edit comment */
	.patch(requireAuth, commentsController.patch)
	/* Delete comment */
	.delete(requireAuth, commentsController.delete);

commentsRouter.post('/:commentID/report', routeValidator(body('reason').isString().isLength({ min: 5, max: 250 })), commentsController.report);

export default commentsRouter;
