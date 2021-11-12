import { Router } from 'express';
import userController from '../controllers/user';
const userRouter = Router();

userRouter.post('/', userController.post);
userRouter
	.route('/:userID')
	/* Validate that user exists */
	.all(userController.validator)
	/* Return user */
	.get(userController.get)
	/* Edit user */
	.patch(userController.patch)
	/* Delete user */
	.delete(userController.delete);

export default userRouter;
