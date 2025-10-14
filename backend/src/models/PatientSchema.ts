import mongoose, { Document, Schema } from "mongoose";

export interface IPatient extends Document {
  fullName: string;
  birthDate: Date;
  phoneNumber: string;
  email?: string;
  diagnosis?: string;
  createdAt: Date;
}

const PatientSchema = new Schema<IPatient>({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^\+?[0-9]{10,15}$/,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  diagnosis: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IPatient>("Patient", PatientSchema);
