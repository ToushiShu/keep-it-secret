import express from "express";

/**
 * server class for building and starting express.
 */
export default class Server {
    private port: string;
    private app: express.Express;

    /**
     * constructor.
     * @param port express port
     */
    constructor(port: string) {
        this.port = port;
        this.app = express();
    }

    /**
     * Define routes.
     */
    private buildRoutes() {
        // Route for '/'
        this.app.get("/", (req, res) => res.send("Hello World!"));
    }

    /**
     * start express server.
     */
    private listen() {
        // Listen to requests
        this.app.listen(this.port, () => console.log(`App listening on port ${this.port}!`));
    }

    /**
     * start express server.
     * step 1 : build routes.
     * step 2 : listen for requests.
     */
    public start() {
        this.buildRoutes();
        this.listen();
    }
}