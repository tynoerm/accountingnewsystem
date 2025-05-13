import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const invoicePayablesSchema = new Schema({
  invoiceNumber: { type: String },
  invoiceSupplierName: { type: String },
  invoiceContactDetails: { type: Number },  // fixed typo: should be Number, not number
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
}, {
  collection: 'invoicepayables'
});

export default model('invoicepayables', invoicePayablesSchema);
