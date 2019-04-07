import { Request, Response } from "express";
import { validationResult } from "express-validator/check";

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
    public abstract async getAll(req: Request, res: Response): Promise<Response>;

    /**
     * Get one by id.
     * @param req Request.
     * @param res Response.
     */
    public abstract async getOneById(req: Request, res: Response): Promise<Response>;

    /**
     * Create.
     * @param req Request.
     * @param res Response.
     */
    public abstract async create(req: Request, res: Response): Promise<Response>;

    /**
     * Delete.
     * @param req Request.
     * @param res Response.
     */
    public abstract async delete(req: Request, res: Response): Promise<Response>;

    /**
     * Update.
     * @param req Request.
     * @param res Response.
     */
    public abstract async update(req: Request, res: Response): Promise<Response>;
}