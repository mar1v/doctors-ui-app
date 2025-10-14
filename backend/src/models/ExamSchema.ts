import mongoose, { Document, Schema } from "mongoose";

export interface IExam extends Document {
  name: string;
  recommendation: string;
  query?: string;
}

const ExamSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  recommendation: { type: String, required: true },
  query: { type: String },
});

export default mongoose.model<IExam>("Exam", ExamSchema);
