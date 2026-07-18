import type { Env } from "../_shared/db";

export const onRequestGet: PagesFunction<Env> = async () => {
  return Response.json({ status: "ok" });
};
