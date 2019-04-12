import { Request, Response } from "express";
import { validationResult } from "express-validator/check";
import JWTPayload from "./interfaces/jwt-payload.interface";

/**
 * MainController abstract class.
 * Every Controller has to inherit this class.
 */
export default abstract class MainController {

    /**
     * Validate request according to validation middleware.
     * @param req Request.
     * @param res Response.
     */
    protected static validateRequest(req: Request, res: Response) {
        const errors = validationResult(req);
        console.log("err", errors.array());
        if (!errors.isEmpty()) {
            return {
                errors: errors.array()
            };
        }
    }

    /**
     * Get all.
     * @param req Request.
     * @param res Response.
     */
    public abstract async getAll(req: Request & JWTPayload, res: Response): Promise<Response>;

    /**
     * Get one by id.
     * @param req Request.
     * @param res Response.
     */
    public abstract async getOneById(req: Request & JWTPayload, res: Response): Promise<Response>;

    /**
     * Create.
     * @param req Request.
     * @param res Response.
     */
    public abstract async create(req: Request & JWTPayload, res: Response): Promise<Response>;

    /**
     * Delete.
     * @param req Request.
     * @param res Response.
     */
    public abstract async delete(req: Request & JWTPayload, res: Response): Promise<Response>;

    /**
     * Update.
     * @param req Request.
     * @param res Response.
     */
    public abstract async update(req: Request & JWTPayload, res: Response): Promise<Response>;
}