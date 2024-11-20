import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  secure_url: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  uniqueLink: { type: String, required: true }, // If this needs to be different, modify accordingly
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Types.ObjectId, required: true },
});

export default mongoose.models.File || mongoose.model("File", fileSchema);
