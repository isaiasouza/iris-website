import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "change-me-in-production-please"
);

const TTL_HOURS = 72;

export interface ValidationPayload {
  license_id: string;
  hardware_id: string;
  plan: string;
  expires_at: string; // ISO string
}

export async function signValidationToken(
  payload: ValidationPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TTL_HOURS}h`)
    .setIssuer("iris-downloader")
    .sign(SECRET);
}

export async function verifyValidationToken(
  token: string
): Promise<ValidationPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: "iris-downloader",
    });
    return payload as unknown as ValidationPayload;
  } catch {
    return null;
  }
}

export function tokenExpiresAt(): Date {
  const d = new Date();
  d.setHours(d.getHours() + TTL_HOURS);
  return d;
}
