// Modules
import { Request, Response } from "express";

import Database from "../../database";
import MainController from "../MainController";
import RESPONSE_CODES from "../utils/response-codes";

/**
 * Post controller.
 */
export default class PostController extends MainController {

    /**
     * @inheritdoc
     */
    public async getAll(req: Request, res: Response): Promise<Response> {
        let posts: any;

        try {
            posts = await Database.Models.Post.find().lean(true);
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json(posts);
    }

    /**
     * @inheritdoc
     */
    public async getOneById(req: Request, res: Response): Promise<Response> {
        const errors = PostController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const id = req.params.id;
        let post: any;

        try {
            post = await Database.Models.Post.findById(id).lean(true);
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
    public async create(req: Request, res: Response): Promise<Response> {
        const errors = PostController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        try {
            const post = new Database.Models.Post({
                author: req.body.author,
                message: req.body.message,
                encryptedMessage: req.body.encryptedMessage
            });

            await post.save();

        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json({ status: "ok" });
    }

    /**
     * @inheritdoc
     */
    public async delete(req: Request, res: Response): Promise<Response> {
        const errors = PostController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const id = req.params.id;

        try {
            await Database.Models.Post.findOneAndDelete(id);
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json({ status: "ok" });
    }

    /**
     * @inheritdoc
     */
    public async update(req: Request, res: Response): Promise<Response> {
        const errors = PostController.validateRequest(req, res);
        if (errors) {
            return res.status(RESPONSE_CODES.INVALID_REQUEST.code).json(errors);
        }

        const id = req.body.id;

        const post = {
            author: req.body.author,
            message: req.body.message,
            encryptedMessage: req.body.encryptedMessage
        };

        try {
            await Database.Models.Post.findByIdAndUpdate(id, post);
        } catch (err) {
            return res.status(RESPONSE_CODES.INTERNAL_ERROR.code).json(err);
        }

        return res.status(RESPONSE_CODES.VALID.code).json({ status: "ok" });
    }
}