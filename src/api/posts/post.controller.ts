// Modules
import { Request, Response } from "express";

import MainController from "../MainController";
import Post from "./post.model";
import RESPONSE_CODES from "../utils/response-codes";
import JWTPayload from "../interfaces/jwt-payload.interface";
import { encrypt } from "../utils/password-utils";

/**
 * Post controller.
 */
export default class PostController extends MainController {

    /**
     * @inheritdoc
     */
    public async getAll(req: Request & JWTPayload, res: Response): Promise<Response> {
        let posts: any;
        try {
            posts = await Post.find().lean(true);
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json(posts);
    }

    /**
     * @inheritdoc
     */
    public async getOneById(req: Request & JWTPayload, res: Response): Promise<Response> {
        const errors = PostController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const id = req.params.id;
        let post: any;

        try {
            post = await Post.findById(id).lean(true);
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        if (!post) {
            return res.status(RESPONSE_CODES.NOT_FOUND.code).json(RESPONSE_CODES.NOT_FOUND.message);
        }

        return res.status(RESPONSE_CODES.VALID.code).json(post);
    }

    /**
     * @inheritdoc
     */
    public async create(req: Request & JWTPayload, res: Response): Promise<Response> {
        const errors = PostController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const post = new Post({
            author: req.user.email,
            message: req.body.message
        });

        try {
            const encryptedMessage = await encrypt(req.body.message);

            post.encryptedMessage = encryptedMessage;

            await post.save();

        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json(post);
    }

    /**
     * @inheritdoc
     */
    public async delete(req: Request & JWTPayload, res: Response): Promise<Response> {
        const errors = PostController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const id = req.params.id;

        try {
            await Post.findOneAndDelete(id);
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json({ status: "ok" });
    }

    /**
     * @inheritdoc
     */
    public async update(req: Request & JWTPayload, res: Response): Promise<Response> {
        const errors = PostController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const id = req.body.id;
        const post = {
            author: req.user.email,
            message: req.body.message,
            encryptedMessage: ""
        };

        try {
            const encryptedMessage = await encrypt(req.body.message);
            post.encryptedMessage = encryptedMessage;

            await Post.findByIdAndUpdate(id, post);
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json(post);
    }
}