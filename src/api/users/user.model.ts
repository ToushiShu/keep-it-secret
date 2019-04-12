import mongoose, { Schema, Document } from "mongoose";

/**
 * User interface.
 */
export declare interface IUser extends Document {
    email: string;
    hash: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * User schema.
 */
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    hash: { type: String, required: true }
}, { timestamps: true });

// Export the model and return the IUser interface.
export default mongoose.model<IUser>("User", UserSchema);
