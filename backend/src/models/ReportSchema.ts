import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  patient: mongoose.Types.ObjectId;
  medications: { name: string; recommendation: string }[];
  procedures: { name: string; recommendation: string }[];
  exams: { name: string; recommendation: string }[];
  specialists: { name: string; query?: string }[];
  homeCares?: { name: string; morning: boolean; evening: boolean }[];
  comments?: string;
  additionalInfo?: string;
}

const ReportSchema = new Schema<IReport>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    medications: [{ name: String, recommendation: String }],
    procedures: [{ name: String, recommendation: String }],
    exams: [{ name: String, recommendation: String }],
    specialists: [{ name: String, query: String }],
    homeCares: [{ name: String, morning: Boolean, evening: Boolean }],
    comments: String,
    additionalInfo: String,
  },
  { timestamps: true }
);

export default mongoose.model<IReport>("Report", ReportSchema);
