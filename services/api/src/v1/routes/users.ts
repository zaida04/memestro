import { Router } from 'express';
import userController from '../controllers/user';
import { routeValidator, validParam } from '#util/http';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth';
const userRouter = Router();

/* Create user username, email, password, avatarURL */
userRouter.post(
	'/',
	routeValidator(
		body('username').isLength({ min: 3, max: 25 }),
		body('email').isEmail(),
		body('password').isLength({ min: 5, max: 25 }),
		body('avatarURL').optional()
	),
	userController.post
);

/* Validate that user exists */
userRouter.use('/:userID', validParam('userID'), userController.validator);
userRouter
	.route('/:userID')
	/* Return user */
	.get(userController.get)
	/* Edit user */
	.patch(requireAuth, userController.patch)
	/* Delete user */
	.delete(requireAuth, userController.delete);

userRouter.post('/:userID/report', routeValidator(body('reason').isString().isLength({ min: 5, max: 250 })), userController.report);

export default userRouter;
