import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const accountReceivablesSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  customerName: { type: String, required: true },
  customerCode: { type: String, required: true },
  email: { type: String, required: true },
  billingAddress: { type: String, required: true },
  creditLimit: { type: Number, required: true },
  taxId: { type: String, required: true },
  invoiceNumber: { type: String },
  contactDetails: { type: String },
  invoiceDate: { type: Date },
  dueDate: { type: Date },
  items: [
    {
      description: { type: String },
      quantity: { type: Number },
      unitPrice: { type: Number },
      total: { type: Number },
    },
  ],
  subtotal: { type: Number },
  tax: { type: Number },
  totalAmount: { type: Number },
  paymentTerms: { type: String },
  paymentMethod: { type: String },
});

export default mongoose.model('accountreceivables', accountReceivablesSchema);
