import mongoose from "mongoose";
import { Configs } from "./configurations";

/**
 * Database class.
 * Singleton Pattern : can work by itself.
 * If the connection doesn't exist, it creates it.
 */
export default class Database {

    private connectionString: string;
    /**
     * constructor.
     */
    constructor(connectionString: string) {
        this.connectionString = connectionString;
    }

    /**
     * Connect to MongoDB.
     */
    public async start() {
        (<any>mongoose).Promise = Promise;

        try {
            await mongoose.connect(this.connectionString, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
            console.log(`Connected to ${this.connectionString}`);
        } catch (err) {
            console.error(err);
        }
    }
}