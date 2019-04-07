// Modules
import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import expressValidator from "express-validator";
import expressJwt from "express-jwt";

import InitUserRoutes from "./api/users";

/**
 * server class for building and starting express.
 */
export default class Server {
    private _port: string;
    private _secret: string;
    private _app: express.Express;

    /**
     * constructor.
     * @param port express port.
     * @param secret secret for JWT.
     */
    constructor(port: string, secret: string) {
        this._port = port;
        this._secret = secret;
        this._app = express();
    }

    /**
     * Adds modules to express.
     */
    private addModules() {
        this._app.use(compression());
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(expressValidator());
        // Authentication is mandatory except for signing up and logging in
        this._app.use(expressJwt({ secret: this._secret })
            .unless({ path: ["/api/users/signup", "/api/users/login"] })
        );
    }

    /**
     * Define routes.
     */
    private buildRoutes() {
        // User routes
        InitUserRoutes(this._app);
    }

    /**
     * start express server.
     */
    private listen() {
        // Listen to requests
        this._app.listen(this._port, () => console.log(`App listening on port ${this._port}!`));
    }

    /**
     * start express server.
     * step 1 : add modules to express.
     * step 2 : build routes.
     * step 3 : listen for requests.
     */
    public start() {
        this.addModules();
        this.buildRoutes();
        this.listen();
    }
}