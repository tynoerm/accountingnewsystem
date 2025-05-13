import { Schema as _Schema, model}  from 'mongoose';
const Schema = _Schema;

let invoicereceivablesblesSchema = new Schema ({
    invoiceNumber: { 
        type: String },
    contactDetails: { 
        type: String },
    invoiceDate: {
         type: Date },
    dueDate: { 
        type: Date },
    items: [
      {
        description: {
             type: String },
        quantity: {
             type: Number },
        unitPrice: { type: Number },
        total: { 
            type: Number },
      },
    ],
    subtotal: { type: Number },
    tax: { type: Number },
    totalAmount: { type: Number },
    paymentTerms: { type: String },
    paymentMethod: { type: String },

},{
      collection: 'invoicereceivables'
})

export default model ('invoicereceivables', invoicereceivablesblesSchema)