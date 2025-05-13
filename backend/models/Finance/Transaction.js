import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, enum: ['cash', 'bank', 'credit_card'], required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  reconciled: { type: Boolean, default: false }
}, {
    collection: 'transaction'
 })
 
export default model('transactions', transactionSchema);
