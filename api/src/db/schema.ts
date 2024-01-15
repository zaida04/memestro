import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const id = varchar("id", { length: 30 }).notNull().primaryKey();
const other_id = (column_name: string) => varchar(column_name, { length: 30 }).notNull();
const created_at = timestamp("created_at")
	.notNull()
	.$defaultFn(() => new Date());
const updated_at = timestamp("updated_at");

export const users = pgTable("users", {
	id,
	name: text("name"),
	banned: boolean("banned").default(false),
	created_at,
	updated_at,
});
export type User = typeof users.$inferSelect;
export const user_create_schema = createInsertSchema(users);
export const user_select_schema = createSelectSchema(users);
export const user_relations = relations(users, ({ many }) => ({
	posts: many(posts),
	comments: many(comments),
}));

export const posts = pgTable("posts", {
	id,
	creator_id: other_id("creator_id").references(() => users.id),
	title: text("title"),
	description: text("description"),
	image_url: text("image_url"),
	deleted: boolean("deleted").default(false),
	created_at,
	updated_at,
});
export type Post = typeof posts.$inferSelect;
export const post_create_schema = createInsertSchema(posts);
export const post_select_schema = createSelectSchema(posts);
export const post_relations = relations(posts, ({ one, many }) => ({
	creator: one(users, {
		fields: [posts.creator_id],
		references: [users.id],
	}),
	comments: many(comments),
}));

export const comments = pgTable("comments", {
	id,
	post_id: other_id("post_id").references(() => posts.id),
	creator_id: other_id("creator_id").references(() => users.id),
	comment: text("comment"),
	deleted: boolean("deleted").default(false),
	created_at,
	updated_at,
});
export type Comment = typeof comments.$inferSelect;
export const comment_create_schema = createInsertSchema(comments);
export const comment_select_schema = createSelectSchema(comments);
export const comment_relations = relations(comments, ({ one, many }) => ({
	creator: one(users, {
		fields: [comments.creator_id],
		references: [users.id],
	}),
	post: one(posts, {
		fields: [comments.post_id],
		references: [posts.id],
	}),
}));
