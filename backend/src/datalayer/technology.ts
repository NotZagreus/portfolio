import mongoose, { Schema, Document } from "mongoose";

export interface ITechnology extends Document {
  name: string;
  image: string;
}

const TechnologySchema: Schema = new Schema(
  {
    nameEn: { type: String, required: true },
    image: { type: String, required: true  },
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

export default mongoose.model<ITechnology>("Technology", TechnologySchema);
