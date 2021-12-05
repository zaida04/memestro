import { Router } from 'express';
import usersRouter from './routes/users';
import postsRouter from './routes/posts';
import { buildAuthMiddleware } from './middleware/auth';
const auth = buildAuthMiddleware(process.env.JWT_KEY);
const v1Router = Router();

v1Router.use(auth);
v1Router.get('/', (_, res) => res.json({ message: 'Beep boop!' }));
v1Router.use('/users', usersRouter);
v1Router.use('/posts', postsRouter);

export default v1Router;
