import bcrypt, { compare } from "bcrypt";

/**
 * Encrypt a password.
 * @param password plain text.
 */
export async function cryptPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    return hash;
}

/**
 * Compare password and hash and see if it matches.
 * @param password plain text.
 * @param hash encrypted password.
 */
export async function comparePassword(password: string, hash: string) {
    const matched = await bcrypt.compare(password, hash);

    return matched;
}