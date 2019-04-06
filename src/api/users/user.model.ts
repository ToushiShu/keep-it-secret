import { Schema, model, Document, Model } from "mongoose";

/**
 * User interface.
 */
declare interface IUser extends Document {
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * User model.
 */
export interface UserModel extends Model<IUser> { }

/**
 * User class.
 */
export class User {

    private _model: Model<IUser>;

    /**
     * constructor defines User schema.
     */
    constructor() {
        const schema = new Schema({
            email: { type: String, required: true },
            password: { type: String, required: true }
        }, { timestamps: true });

        this._model = model<IUser>("User", schema);
    }

    /**
     * User model getter.
     */
    public get model(): Model<IUser> {
        return this._model;
    }
}