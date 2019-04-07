// Modules
import jwt from "jsonwebtoken";

import { Configs } from "../configurations";

/**
 * Create JWT.
 * @param payload Data being sent to consumer.
 */
export function createToken(payload: any) {
    // secret key
    const secret = process.env["SECRET"] || Configs.getServerConfigs().secretKey;
    const token = jwt.sign(payload, secret, { expiresIn: 1440 });
    return token;
}