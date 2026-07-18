import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

// Dev local (Node runtime, `next dev`): SQLite em ficheiro que espelha o schema do D1.
// Em produção (Cloudflare Pages), este cliente é substituído pelo binding D1 via
// `drizzle-orm/d1` — ver src/lib/db/client.edge.ts, usado pelas rotas que correm
// no runtime "edge"/Cloudflare Workers.
const sqlite = new Database(process.env.LOCAL_DB_PATH ?? "./data/local.db");
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
