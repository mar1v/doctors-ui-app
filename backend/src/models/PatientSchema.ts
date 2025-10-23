import mongoose, { Document, Schema } from "mongoose";

export interface IPatient extends Document {
  fullName: string;
  createdAt: Date;
}

const PatientSchema = new Schema<IPatient>({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IPatient>("Patient", PatientSchema);
