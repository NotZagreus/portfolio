import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    firstName: string;
    lastName: string;
    comment: string;
}

const CommentSchema: Schema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        comment: { 
            type: String, 
            required: true,
            validate: {
                validator: (v: string) => v.length <= 240,
                message: "Comment cannot be longer than 240 characters"
            }
        },
    },
    { 
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret._id;
                return ret;
            }
        }
    }
);

export default mongoose.model<IComment>('Comment', CommentSchema);