import { jwtVerify, type JWTPayload } from "jose";

export const ADMIN_COOKIE_NAME = "iris_admin_session";
export const ADMIN_JWT_ISSUER = "iris-downloader";
export const ADMIN_JWT_AUDIENCE = "iris-admin";

export function getAdminJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET not set");
  return new TextEncoder().encode(secret);
}

export async function verifyAdminSession(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getAdminJwtSecret(), {
    issuer: ADMIN_JWT_ISSUER,
    audience: ADMIN_JWT_AUDIENCE,
  });

  if (payload.role !== "admin") {
    throw new Error("Invalid admin role");
  }

  return payload;
}
