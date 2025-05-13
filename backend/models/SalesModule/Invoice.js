import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
import mongoose from "mongoose";


const invoiceSchema = new mongoose.Schema({
  quoteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation', required: true },
  dateIssued: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  paymentMethod: { type: String, required: true },
  currency: { type: String, required: true }


}, {
    collection: 'Invoice'
 })
 
 export default model('Invoice', invoiceSchema)