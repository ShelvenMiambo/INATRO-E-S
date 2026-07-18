import { getDb, type Env } from "../_shared/db";
import { categories } from "../_shared/schema";
import { asc } from "drizzle-orm";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const db = getDb(env);
    const cats = await db.select().from(categories).orderBy(asc(categories.sortOrder));
    return Response.json(cats);
  } catch (err) {
    console.error("Failed to fetch categories", err);
    return Response.json({ error: "Failed to load categories" }, { status: 500 });
  }
};
