import { Elysia } from "elysia";

const homeRouter = new Elysia();

homeRouter.get("/", () => "Hello Elysia");

export default homeRouter;
