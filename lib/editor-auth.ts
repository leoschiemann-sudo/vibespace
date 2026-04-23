import "server-only";
import { cookies } from "next/headers";
import { hash, verify } from "@node-rs/argon2";

const SESSION_COOKIE_NAME = "editor_session";
const SESSION_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

export interface SessionPayload {
  authenticated: boolean;
  expiresAt: number;
}

/**
 * Hash an editor password using Argon2id
 */
export async function hashEditorPassword(password: string): Promise<string> {
  return hash(password, {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

/**
 * Verify an editor password against a hash
 */
export async function verifyEditorPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await verify(hash, password);
  } catch {
    return false;
  }
}

/**
 * Create a session payload
 */
export function createSessionPayload(): SessionPayload {
  const expiresAt = Date.now() + SESSION_DURATION_SECONDS * 1000;
  return {
    authenticated: true,
    expiresAt,
  };
}

/**
 * Validate a session payload
 */
export function validateSessionPayload(payload: SessionPayload): boolean {
  if (!payload.authenticated) {
    return false;
  }
  if (Date.now() > payload.expiresAt) {
    return false;
  }
  return true;
}

/**
 * Encode session payload to base64
 */
export function encodeSessionPayload(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

/**
 * Decode session payload from base64
 */
export function decodeSessionPayload(encoded: string): SessionPayload | null {
  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    return JSON.parse(decoded) as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Get cookie options for the session cookie
 */
export function getSessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  };
}

/**
 * Set the editor session cookie
 */
export async function setEditorSessionCookie(payload: SessionPayload): Promise<void> {
  const cookieStore = await cookies();
  const options = getSessionCookieOptions();
  cookieStore.set(options.name, encodeSessionPayload(payload), {
    httpOnly: options.httpOnly,
    sameSite: options.sameSite,
    secure: options.secure,
    maxAge: options.maxAge,
    path: options.path,
  });
}

/**
 * Clear the editor session cookie
 */
export async function clearEditorSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get the current editor session
 */
export async function getEditorSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie) {
    return null;
  }
  
  const payload = decodeSessionPayload(sessionCookie.value);
  if (!payload) {
    return null;
  }
  
  if (!validateSessionPayload(payload)) {
    return null;
  }
  
  return payload;
}
