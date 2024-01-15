import { Elysia } from "elysia";
import { logger } from "./logger";
import homeRouter from "./routes/home";

const app = new Elysia();
app.use(homeRouter);

app.get("/", ({ set }) => {
	set.status = 301;
	set.redirect = "/v1/";
});

app.listen(5000, () => {
	logger.info(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
});
