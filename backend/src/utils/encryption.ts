import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const PREFIX = "enc1";

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

    // Format: enc1:<iv>:<authTag>:<ciphertext>  (PREFIX must not contain ':')
    return [
        PREFIX,
        iv.toString("base64"),
        authTag.toString("base64"),
        encrypted.toString("base64"),
    ].join(":");
}

/** Decrypt values from MongoDB. Supports legacy plain-text and old broken "enc:" format. */
export function decryptSecret(stored: string): string {
    // Legacy plain-text keys (pre-encryption)
    if (!stored.startsWith("enc")) {
        return stored;
    }

    const parts = stored.split(":");

    // Current format: enc1:iv:tag:data  (4 parts)
    // Broken old format: enc::iv:tag:data  (5 parts because PREFIX was "enc:")
    let ivB64: string;
    let tagB64: string;
    let dataB64: string;

    if (parts[0] === "enc1" && parts.length === 4) {
        ivB64 = parts[1]!;
        tagB64 = parts[2]!;
        dataB64 = parts[3]!;
    } else if (parts[0] === "enc" && parts.length === 5 && parts[1] === "") {
        // Recover keys encrypted with the old "enc:" PREFIX bug
        ivB64 = parts[2]!;
        tagB64 = parts[3]!;
        dataB64 = parts[4]!;
    } else if (parts[0] === "enc" && parts.length === 4) {
        ivB64 = parts[1]!;
        tagB64 = parts[2]!;
        dataB64 = parts[3]!;
    } else {
        throw new Error("Invalid encrypted secret format");
    }

    const iv = Buffer.from(ivB64, "base64");
    const authTag = Buffer.from(tagB64, "base64");
    const encrypted = Buffer.from(dataB64, "base64");

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
