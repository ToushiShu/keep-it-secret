import mongoose, { Connection, connection } from "mongoose";
import { Configs } from "./configurations";
import { UserModel, User } from "./api/users/user.model";

/**
 * List every models.
 */
declare interface IModels {
    User: UserModel;

}

/**
 * Database class.
 * Singleton Pattern : can work by itself.
 * If the connection doesn't exist, it creates it.
 */
export default class Database {

    private static instance: Database;

    private _db: Connection;

    private _models: IModels;

    /**
     * models getter.
     * Creates a Database instance if there is none.
     */
    public static get Models() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance._models;
    }

    /**
     * constructor.
     * step 1 : connect to database.
     * step 2 : build models.
     */
    constructor() {
        this.connectToDb(Configs.getDatabaseConfig().connectionString);
        this.buildModels();
    }

    /**
     * Define models.
     */
    private buildModels() {
        this._models = {
            User: new User().model
        };
    }

    /**
     * Connect to MongoDB.
     */
    private connectToDb(connectionString: string) {
        (<any>mongoose).Promise = Promise;

        try {
            mongoose.connect(connectionString, { useNewUrlParser: true, useFindAndModify: false });
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Mongoose has connected.
     * Fired when database fires "open" event.
     */
    private connected() {
        console.log("Mongoose has connected");
    }

    /**
     * Mongoose has failed to connect.
     * Fired when database fires "error" event.
     */
    private error(error: string) {
        console.log("Mongoose has failed", error);
    }
}