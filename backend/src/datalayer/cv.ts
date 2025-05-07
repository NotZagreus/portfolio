import mongoose, { Schema, Document } from "mongoose";

export interface ICV extends Document {
  pdfFileEn: Buffer;
  pdfFileFr: Buffer;
  createdAt: Date;
}

const cvSchema: Schema = new Schema({
  pdfFileEn: { type: Buffer, required: true },
  pdfFileFr: { type: Buffer, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICV>("CV", cvSchema);
