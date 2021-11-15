import { Router } from 'express';
import usersRouter from './routes/users';
import postsRouter from './routes/posts';
import commentsRouter from './routes/comments';
const v1Router = Router();

v1Router.get('/', (_, res) => res.json({ message: 'Beep boop!' }));
v1Router.use('/users', usersRouter);
v1Router.use('/posts', postsRouter);
v1Router.use('/comments', commentsRouter);

export default v1Router;
