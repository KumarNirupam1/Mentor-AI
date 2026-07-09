import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const PREFIX = "enc:";

function getEncryptionKey(): Buffer {
    const secret = process.env.ENCRYPTION_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error("ENCRYPTION_SECRET must be set and at least 32 characters");
    }

    return crypto.scryptSync(secret, "mentor-ai-key-v1", 32);
}

/** Encrypt sensitive values before storing in MongoDB */
export function encryptSecret(plainText: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);

    const encrypted = Buffer.concat([
        cipher.update(plainText, "utf8"),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return [
        PREFIX,
        iv.toString("base64"),
        authTag.toString("base64"),
        encrypted.toString("base64"),
    ].join(":");
}

/** Decrypt values read from MongoDB. Supports legacy plain-text keys during migration. */
export function decryptSecret(stored: string): string {
    if (!stored.startsWith(PREFIX)) {
        return stored;
    }

    const parts = stored.split(":");
    if (parts.length !== 4) {
        throw new Error("Invalid encrypted secret format");
    }

    const iv = Buffer.from(parts[1]!, "base64");
    const authTag = Buffer.from(parts[2]!, "base64");
    const encrypted = Buffer.from(parts[3]!, "base64");

    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]).toString("utf8");
}

export function hasStoredSecret(stored: string | null | undefined): boolean {
    return Boolean(stored?.trim());
}
