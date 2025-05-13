import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const fixedassetsSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['equipment', 'vehicle', 'building', 'furniture', 'laptops'],
    required: true
  },
  purchaseDate: { type: Date, required: true },
  cost: { type: Number, required: true },
  usefulLife: { type: Number, required: true }
}, {
  timestamps: true,
  collection: 'fixedassets'
});

export default model('fixedassets', fixedassetsSchema);
