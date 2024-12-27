import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema(
    {
        page: String,
        timestamp: { type: Date, default: Date.now }
      },
  {
    timestamps: true,
  }
);

const Visit = mongoose.model('Visit', visitSchema);

export default Visit;
