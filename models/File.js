import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  uniqueLink: { type: String, required: true },
});

export default mongoose.models.File || mongoose.model('File', fileSchema);
