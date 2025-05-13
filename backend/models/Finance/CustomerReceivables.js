import { Schema as _Schema, model}  from 'mongoose';
const Schema = _Schema;

let customerReceivablesSchema = new Schema ({
date : {
      type: Date
},
customerName: { 
    type: String, 
    required: true },
  customerCode: {
     type: String, 
     required: true },
  email: {
     type: String,
     required: true },
  billingAddress: { 
    type: String, 
    required: true },
  creditLimit: { 
    type: Number,
     required: true },
  taxId: { 
    type: String, 
    required: true }

},{
      collection: 'customerreceivables'
})

export default model ('customereceivables', customerReceivablesSchema)