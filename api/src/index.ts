import { Elysia } from "elysia";
import { logger } from "./logger";
import homeRouter from "./routes/home";

const app = new Elysia();
app.use(homeRouter);

app.listen(5000, () => {
	logger.info(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
});
