import { Router } from "express";
import UserController from "./user.controller";
import UserValidator from "./user.validator";

/**
 * user routes class.
 */
export default class UserRoutes {

    private _router: Router;
    private _controller: UserController;

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
        this._controller = new UserController();
    }

    /**
     * Set routes up.
     */
    public setUp() {
        this._router.get("/", this._controller.getAll);
        this._router.get("/:id", this._controller.getOneById);
        this._router.delete("/:id", this._controller.delete);
        this._router.post("/", UserValidator.Validators, this._controller.create);
        this._router.put("/", UserValidator.Validators, this._controller.update);
    }

}