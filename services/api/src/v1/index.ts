import { Router } from 'express';
import usersRouter from './routes/users';
import postsRouter from './routes/posts';
import commentsRouter from './routes/comments';
const v1Router = Router();

v1Router.get('/', (_, res) => res.json({ message: 'Beep boop!' }));
v1Router.use(usersRouter);
v1Router.use(postsRouter);
v1Router.use(commentsRouter);

export default v1Router;
