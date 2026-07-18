import { eq, sql } from "drizzle-orm";
import { getDb, type Env } from "../../_shared/db";
import { questions } from "../../_shared/schema";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const db = getDb(env);
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(questions)
      .where(eq(questions.active, true));
    return Response.json({ count });
  } catch (err) {
    console.error("Failed to count questions", err);
    return Response.json({ error: "Failed to count questions" }, { status: 500 });
  }
};
