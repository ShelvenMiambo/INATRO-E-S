import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// Usado nas Cloudflare Pages Functions / rotas "edge" em produção, onde o D1
// é injetado como binding (env.DB) em vez de um ficheiro local.
export function getDb(d1: D1Database) {
  return drizzle(d1, { schema });
}
