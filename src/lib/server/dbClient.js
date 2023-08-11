import ReplitDB from "@replit/database";
import JSONdb from "simple-json-db";
import { env } from '$env/dynamic/private';

let db

if (env.REPLIT_DB_URL) {
   db = new ReplitDB()
} else {
 db = new JSONdb("./db.json");
}
export default db;