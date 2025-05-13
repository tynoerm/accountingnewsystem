import { Schema as _Schema, model}  from 'mongoose';
const Schema = _Schema;

let supplierpayablesSchema = new Schema ({
supplierDate : {
      type: Date
},
supplierName: { 
    type: String, 
    required: true },


  contactDetails: {
     type: Number, 
     required: true },
paymentTerm: {
     type: String,
     required: true },
  bankingDetails: { 
    type: String, 
    required: true },
  taxClearanceNumber: { 
    type: Number,
     required: true }


},{
      collection: 'supplierpayables'
})

export default model ('supplierpayables', supplierpayablesSchema)