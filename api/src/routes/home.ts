import { Elysia } from "elysia";
const pkg = await Bun.file("package.json").text();
const parsedPkg = JSON.parse(pkg);
const homeRouter = new Elysia();

homeRouter.get("/v1", () => {
	return {
		message: "Welcome to the Memestro API!",
		version: parsedPkg.version,
	};
});

export default homeRouter;
