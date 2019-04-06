// Modules
import { Request, Response } from "express";

import Database from "../../database";
import MainController from "../MainController";
import RESPONSE_CODES from "../../utils/response-codes";

/**
 * User controller.
 */
export default class UserController extends MainController {

    /**
     * @inheritdoc
     */
    public async getAll(req: Request, res: Response): Promise<Response> {
        let users: any;

        try {
            users = await Database.Models.User.find().lean(true);
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.json(users);
    }

    /**
     * @inheritdoc
     */
    public async getOneById(req: Request, res: Response): Promise<Response> {
        const errors = UserController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const id = req.params.id;
        let user: any;

        try {
            user = await Database.Models.User.findById(id).lean(true);
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
    public async create(req: Request, res: Response): Promise<Response> {
        const errors = UserController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const user = new Database.Models.User({
            email: req.body.email,
            password: req.body.password
        });

        try {
            await user.save();
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json(user);
    }

    /**
     * @inheritdoc
     */
    public async delete(req: Request, res: Response): Promise<Response> {
        const errors = UserController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const id = req.params.id;

        try {
            await Database.Models.User.findOneAndDelete(id);
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json(undefined);
    }

    /**
     * @inheritdoc
     */
    public async update(req: Request, res: Response): Promise<Response> {
        const errors = UserController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const id = req.body.id;

        const user = {
            email: req.body.email,
            password: req.body.password
        };

        try {
            await Database.Models.User.findByIdAndUpdate(id, user);
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json(user);
    }
}