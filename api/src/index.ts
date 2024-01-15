import { Elysia } from "elysia";
import { logger } from "./logger";
import homeRouter from "./routes/home";
import userRouter from "./routes/users";

const app = new Elysia();
app.use(homeRouter);
app.use(userRouter);

app.get("/", ({ set }) => {
	set.status = 301;
	set.redirect = "/v1/";
});

app.listen(5000, () => {
	logger.info(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
});
