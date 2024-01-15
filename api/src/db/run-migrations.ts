import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle_client, sql_connection } from "./client";
import { logger } from "../logger";

async function main() {
	logger.warn("Running migrations...");

	// runs our migrations from the drizzle folder
	await migrate(drizzle_client, { migrationsFolder: "./drizzle" });
	logger.info("Migrations complete!");

	// closes our raw sql connection
	await sql_connection.end();
}

main();
