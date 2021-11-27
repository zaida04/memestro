import { Router } from 'express';
import userController from '../controllers/user';
import { routeValidator, validParam } from '#util/http';
import { body } from 'express-validator';
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

userRouter
	.route('/:userID')
	/* Validate that user exists */
	.all(validParam('userID'), userController.validator)
	/* Return user */
	.get(userController.get)
	/* Edit user */
	.patch(userController.patch)
	/* Delete user */
	.delete(userController.delete);

export default userRouter;
