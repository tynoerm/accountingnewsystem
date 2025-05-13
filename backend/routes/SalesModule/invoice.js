// routes/invoiceRoutes.js
import express from 'express';
let router = express.Router();
import Invoice from '../../models/SalesModule/invoice.js'
import quotationSchema from'../../models/SalesModule/quotation.js';


// Create an invoice from a quotation
router.post('/create-invoice', (req, res) => {
  const { quoteId, paymentMethod, currency } = req.body;

  quotationSchema.findById(quoteId)
    .then(quotation => {
      if (!quotation) {
        return res.status(404).json({ error: 'Quotation not found' });
      }

      const newInvoice = new Invoice({
        quoteId,
        totalAmount: quotation.totalPrice,
        paymentMethod,
        currency
      });

      newInvoice.save()
        .then(invoice => res.json(invoice))
        .catch(err => res.status(500).json({ error: err.message }));
    })
    console.log(err)
    .catch(err => res.status(500).json({ error: err.message }));
});


export {router as invoiceRoutes}
