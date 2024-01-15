import { Elysia, t } from "elysia";
import { user_create_schema } from "../db/schema";
const userRouter = new Elysia();

userRouter.post(
	"/v1/users",
	async (ctx) => {
		const { name } = ctx.body;
		console.log(name);

		return {
			ok: true,
		};
	},
	{
		body: t.Pick(user_create_schema, ["name"]),
	},
);

export default userRouter;
