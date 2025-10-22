import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  patient: mongoose.Types.ObjectId;
  medications: { name: string; recommendation: string }[];
  procedures: { name: string; recommendation: string }[];
  exams: { name: string; recommendation: string }[];
  specialists: { name: string }[];
  homeCares: {
    name: string;
    morning: boolean;
    day: boolean;
    evening: boolean;
  }[];
  psychoScale?: number;
  comments?: string;
  createdAt?: Date;
}

const ReportSchema = new Schema<IReport>({
  patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  medications: [{ name: String, recommendation: String }],
  procedures: [{ name: String, recommendation: String }],
  exams: [{ name: String, recommendation: String }],
  specialists: [{ name: String }],
  homeCares: [
    {
      name: String,
      morning: Boolean,
      day: Boolean,
      evening: Boolean,
    },
  ],
  psychoScale: Number,
  comments: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReport>("Report", ReportSchema);
