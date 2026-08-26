import crypto from "crypto";
import { env } from "../config/env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey(keyHex: string, keyEnvName: string): Buffer {
  const key = Buffer.from(keyHex, "hex");
  if (key.length !== 32) {
    throw new Error(`${keyEnvName} must be a 32-byte value encoded as hex (64 hex chars)`);
  }
  return key;
}

// Encrypts a plaintext secret (e.g. an OAuth token) for storage at rest.
// Output format: iv:authTag:ciphertext, all hex-encoded.
// `keyHex` defaults to TOKEN_ENCRYPTION_KEY — pass a different key (e.g.
// TWILIO_CREDENTIAL_ENCRYPTION_KEY) to encrypt under a separately rotatable key.
export function encryptSecret(
  plaintext: string,
  keyHex: string = env.TOKEN_ENCRYPTION_KEY,
  keyEnvName = "TOKEN_ENCRYPTION_KEY",
): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(keyHex, keyEnvName), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${ciphertext.toString("hex")}`;
}

export function decryptSecret(
  payload: string,
  keyHex: string = env.TOKEN_ENCRYPTION_KEY,
  keyEnvName = "TOKEN_ENCRYPTION_KEY",
): string {
  const [ivHex, authTagHex, ciphertextHex] = payload.split(":");
  if (!ivHex || !authTagHex || !ciphertextHex) {
    throw new Error("Malformed encrypted payload");
  }
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(keyHex, keyEnvName), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertextHex, "hex")),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}
