import bcrypt, { compare } from "bcrypt";

/**
 * Encrypt a string.
 * @param str plain text.
 */
export async function encrypt(str: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(str, salt);

    return hash;
}

/**
 * Compare string and hash and see if it matches.
 * @param str plain text.
 * @param hash encrypted password.
 */
export async function compareStr(str: string, hash: string) {
    const matched = await bcrypt.compare(str, hash);

    return matched;
}