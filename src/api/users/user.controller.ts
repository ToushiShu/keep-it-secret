// Modules
import { Request, Response } from "express";

import MainController from "../MainController";
import User from "./user.model";
import RESPONSE_CODES from "../utils/response-codes";
import { encrypt, compareStr } from "../utils/password-utils";
import { createToken } from "./utils/jwt-helper";
import JWTPayload from "../interfaces/jwt-payload.interface";

/**
 * User controller.
 */
export default class UserController extends MainController {

    /**
     * @inheritdoc
     */
    public async getAll(req: Request & JWTPayload, res: Response): Promise<Response> {
        let users: any;

        try {
            // Never get hash
            users = await User.find().lean(true).select("-hash");
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json(users);
    }

    /**
     * @inheritdoc
     */
    public async getOneById(req: Request & JWTPayload, res: Response): Promise<Response> {
        const errors = UserController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const id = req.params.id;
        let user: any;

        try {
            // Never get hash
            user = await User.findById(id).lean(true).select("-hash");
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        if (!user) {
            return res.status(RESPONSE_CODES.NOT_FOUND.code).json(RESPONSE_CODES.NOT_FOUND.message);
        }

        return res.status(RESPONSE_CODES.VALID.code).json(user);
    }

    /**
     * @inheritdoc
     */
    public async create(req: Request & JWTPayload, res: Response): Promise<Response> {
        const errors = UserController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const reqBody = {
            email: req.body.email,
            password: req.body.password
        };

        try {
            await UserController.saveNewUser(reqBody);
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json({ status: "ok" });
    }

    /**
     * @inheritdoc
     */
    public async delete(req: Request & JWTPayload, res: Response): Promise<Response> {
        const errors = UserController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const id = req.params.id;

        try {
            await User.findOneAndDelete(id);
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json({ status: "ok" });
    }

    /**
     * @inheritdoc
     */
    public async update(req: Request & JWTPayload, res: Response): Promise<Response> {
        const errors = UserController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const id = req.body.id;

        const hash = await encrypt(req.body.password);

        const user = {
            email: req.body.email,
            hash: hash
        };

        try {
            await User.findByIdAndUpdate(id, user);
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json({ status: "ok" });
    }

    /**
     * Sign up user and return JWT.
     * @param req Request
     * @param res Response
     */
    public async singUp(req: Request, res: Response): Promise<Response> {
        const errors = UserController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const reqBody = {
            email: req.body.email,
            password: req.body.password
        };

        let token = undefined;

        try {
            await UserController.saveNewUser(reqBody);
            token = await createToken({
                email: reqBody.email
            });
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json({ error: err.message });
        }

        return res.status(RESPONSE_CODES.VALID.code).json({ token: token });
    }

    /**
     * Log in user and return JWT.
     * @param req Request
     * @param res Response
     */
    public async logIn(req: Request, res: Response): Promise<Response> {
        const errors = UserController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const reqBody = {
            email: req.body.email,
            password: req.body.password
        };

        let token = undefined;
        try {
            const user = await User.findOne({ email: reqBody.email });
            const passwordMatched = compareStr(reqBody.password, user.hash);
            if (!passwordMatched) {
                throw new Error("Invalid credentials");
            }
            token = await createToken({
                email: reqBody.email
            });
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json({ token: token });
    }

    /**
     * Save a new user to database if it doesn't exist.
     * Otherwise, throw error.
     * @param reqBody { email: string, password: string }
     */
    private static async saveNewUser(reqBody: { email: string; password: string; }) {
        const existingUser = await User.findOne({ email: reqBody.email });
        if (existingUser) {
            throw new Error("Email already used");
        }
        const hash = await encrypt(reqBody.password);
        const user = new User({
            email: reqBody.email,
            hash: hash
        });
        await user.save();
    }
}