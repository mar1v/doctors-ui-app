import mongoose, { Document, Schema } from "mongoose";

export interface IProcedure extends Document {
  name: string;
  recommendation: string;
  query?: string;
}

const ProcedureSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  recommendation: { type: String, required: true },
  query: { type: String },
});

export default mongoose.model<IProcedure>("Procedure", ProcedureSchema);
