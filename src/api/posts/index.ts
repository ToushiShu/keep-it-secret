import PostRoutes from "./post.routes";
import express from "express";

/**
 * Initiate post routes.
 * @param app express app.
 */
export default function InitPostRoutes(app: express.Express) {
    const postRoutes = new PostRoutes();
    postRoutes.setUp();

    app.use("/api/posts", postRoutes.Router);
}