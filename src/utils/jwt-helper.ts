// Modules
import jwt from "jsonwebtoken";

import { Configs } from "../configurations";

export function createToken(payload: any) {
    const token = jwt.sign(payload, Configs.getServerConfigs().secretKey, { expiresIn: 1440 });
    return token;
}