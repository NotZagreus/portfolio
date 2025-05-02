import mongoose, { Schema, Document } from "mongoose";

export interface IPortfolio extends Document {
  titleEn: string;
  titleFr: string;
  specializationEn: string;
  specializationFr: string;
  descriptionEn: string;
  descriptionFr: string;
}

const PortfolioSchema: Schema = new Schema(
  {
    titleEn: { type: String, required: true },
    titleFr: { type: String, required: true },
    specializationEn: { type: String, required: true },
    specializationFr: { type: String, required: true },
    descriptionEn: { type: String, required: true },
    descriptionFr: { type: String, required: true },
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

export default mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
