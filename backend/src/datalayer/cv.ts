import mongoose, { Schema, Document } from "mongoose";

export interface ICV extends Document {
  pdfFileEn: Buffer;
  pdfFileFr: Buffer;
}

const cvSchema: Schema = new Schema({
  pdfFileEn: { type: Buffer, required: true },
  pdfFileFr: { type: Buffer, required: true },
});

export default mongoose.model<ICV>("CV", cvSchema);
