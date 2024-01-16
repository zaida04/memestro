import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// this connects us to the postgres db. it's our raw connection
// your database url should go as the first string parameter
// make sure you replace things like username, password, and database_name
// the first two will likely be the default postgres info
// the last one, you should create a database using pgadmin and substitute the name in the url
const sql_connection = postgres("postgresql://postgres:password@localhost:5432/postgres", { max: 1 });
// this creates the drizzle utility so we can run queries
const drizzle_client = drizzle(sql_connection);

// this allows us to use our created drizzle util and our raw db connection in other files
export { drizzle_client, sql_connection, drizzle_client as db };
