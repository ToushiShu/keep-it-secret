import { Schema, model, Document, Model } from "mongoose";

/**
 * Post interface.
 */
declare interface IPost extends Document {
    author: string;
    message: string;
    encryptedMessage: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Post model.
 */
export interface PostModel extends Model<IPost> { }

/**
 * Post class.
 */
export class Post {

    private _model: Model<IPost>;

    /**
     * constructor defines Post schema.
     */
    constructor() {
        const schema = new Schema({
            author: { type: String, required: true },
            message: { type: String, required: true },
            encryptedMessage: { type: String, required: true }
        }, { timestamps: true });

        this._model = model<IPost>("Post", schema);
    }

    /**
     * Post model getter.
     */
    public get model(): Model<IPost> {
        return this._model;
    }
}