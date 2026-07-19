import { eq } from "drizzle-orm";
import { getDb, type Env } from "../functions/_shared/db";
import { users, sessions } from "../functions/_shared/schema";
import {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  hashSessionToken,
  generateId,
} from "../functions/_shared/auth-crypto";
import {
  getSessionTokenFromRequest,
  setSessionCookie,
  clearSessionCookie,
  SESSION_TTL_MS,
} from "../functions/_shared/cookies";

export type PublicUser = Omit<typeof users.$inferSelect, "passwordHash">;

function toPublicUser(user: typeof users.$inferSelect): PublicUser {
  const { passwordHash, ...rest } = user;
  return rest;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function getCurrentUser(request: Request, env: Env): Promise<PublicUser | null> {
  const token = getSessionTokenFromRequest(request);
  if (!token) return null;

  const db = getDb(env);
  const tokenHash = await hashSessionToken(token);
  const [session] = await db.select().from(sessions).where(eq(sessions.id, tokenHash));
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) return null;

  const [user] = await db.select().from(users).where(eq(users.id, session.userId));
  if (!user) return null;
  return toPublicUser(user);
}

async function createSessionForUser(env: Env, userId: string, headers: Headers) {
  const db = getDb(env);
  const { token, hash } = await generateSessionToken();
  await db.insert(sessions).values({
    id: hash,
    userId,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  });
  setSessionCookie(headers, token);
}

export async function handleRegister(request: Request, env: Env): Promise<Response> {
  const body = await request.json().catch(() => null) as { name?: string; email?: string; password?: string } | null;
  const name = body?.name?.trim();
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!name || name.length < 2) {
    return Response.json({ error: "Nome deve ter pelo menos 2 caracteres." }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Email inválido." }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return Response.json({ error: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 });
  }

  const db = getDb(env);
  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) {
    return Response.json({ error: "Já existe uma conta com este email." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const userId = generateId("user");
  const newUser = {
    id: userId,
    email,
    passwordHash,
    name,
    avatarSeed: userId,
  };
  await db.insert(users).values(newUser);

  const headers = new Headers({ "Content-Type": "application/json" });
  await createSessionForUser(env, userId, headers);

  const [created] = await db.select().from(users).where(eq(users.id, userId));
  return new Response(JSON.stringify({ user: toPublicUser(created) }), { headers });
}

export async function handleLogin(request: Request, env: Env): Promise<Response> {
  const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!email || !password) {
    return Response.json({ error: "Email e senha são obrigatórios." }, { status: 400 });
  }

  const db = getDb(env);
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return Response.json({ error: "Email ou palavra-passe incorretos." }, { status: 401 });
  }

  const headers = new Headers({ "Content-Type": "application/json" });
  await createSessionForUser(env, user.id, headers);

  return new Response(JSON.stringify({ user: toPublicUser(user) }), { headers });
}

export async function handleLogout(request: Request, env: Env): Promise<Response> {
  const token = getSessionTokenFromRequest(request);
  if (token) {
    const db = getDb(env);
    const tokenHash = await hashSessionToken(token);
    await db.delete(sessions).where(eq(sessions.id, tokenHash));
  }
  const headers = new Headers({ "Content-Type": "application/json" });
  clearSessionCookie(headers);
  return new Response(JSON.stringify({ ok: true }), { headers });
}

export async function handleMe(request: Request, env: Env): Promise<Response> {
  const user = await getCurrentUser(request, env);
  if (!user) return Response.json({ error: "Não autenticado." }, { status: 401 });
  return Response.json({ user });
}
