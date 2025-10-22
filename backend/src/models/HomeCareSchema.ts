import mongoose, { Document, Schema } from "mongoose";

export interface IHomeCare extends Document {
  name: string;
  morning: boolean;
  day: boolean;
  evening: boolean;
}

const HomeCareSchema = new Schema<IHomeCare>({
  name: { type: String, required: true },
  morning: { type: Boolean, default: false },
  day: { type: Boolean, default: false },
  evening: { type: Boolean, default: false },
});

export default mongoose.model<IHomeCare>("HomeCare", HomeCareSchema);
