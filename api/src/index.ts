import { Elysia } from "elysia";
import { logger } from "./logger";

const app = new Elysia();

app.get("/", () => "Hello Elysia");

app.listen(3000, () => {
	logger.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
});
