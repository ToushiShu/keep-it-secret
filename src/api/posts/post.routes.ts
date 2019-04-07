import { Router } from "express";
import PostController from "./post.controller";
import PostValidator from "./post.validator";

/**
 * post routes class.
 */
export default class PostRoutes {

    private _router: Router;
    private _controller: PostController;

    /**
     * Router getter.
     */
    public get Router() {
        return this._router;
    }

    /**
     * constructor.
     * Instanciate router.
     * Instanciate controller.
     */
    constructor() {
        this._router = Router();
        this._controller = new PostController();
    }

    /**
     * Set routes up.
     */
    public setUp() {
        this._router.get("/", this._controller.getAll);
        this._router.get("/:id", this._controller.getOneById);
        this._router.delete("/:id", this._controller.delete);
        this._router.post("/", PostValidator.Validators, this._controller.create);
        this._router.put("/", PostValidator.Validators, this._controller.update);
    }

}