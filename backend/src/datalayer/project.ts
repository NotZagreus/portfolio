import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  image: string;
  github_link?: string;
}

const ProjectSchema: Schema = new Schema(
  {
    titleEn: { type: String, required: true },
    descriptionEn: { type: String, required: true },
    titleFr: { type: String, required: true },
    descriptionFr: { type: String, required: true },
    image: { type: String },
    github_link: { type: String },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

export default mongoose.model<IProject>("Project", ProjectSchema);
