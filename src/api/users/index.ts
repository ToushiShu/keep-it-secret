import UserRoutes from "./user.routes";
import express from "express";

/**
 * Initiate user routes.
 * @param app express app.
 */
export default function InitUserRoutes(app: express.Express) {
    const userRoutes = new UserRoutes();
    userRoutes.setUp();

    app.use("/api/users", userRoutes.Router);
}