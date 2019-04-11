import mongoose, { Schema, Document } from "mongoose";

/**
 * Post interface.
 */
export declare interface IPost extends Document {
    author: string;
    message: string;
    encryptedMessage: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Post schema.
 */
const PostSchema = new Schema({
    author: { type: String, required: true },
    message: { type: String, required: true },
    encryptedMessage: { type: String, required: true }
}, { timestamps: true });

// Export the model and return the IPost interface.
export default mongoose.model<IPost>("Post", PostSchema);
