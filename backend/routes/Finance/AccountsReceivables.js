import express from 'express';
const router = express.Router();
import accountReceivablesSchema from '../../models/Finance/AccountsReceivables.js';
import { Parser } from 'json2csv';

// GET all account receivables (optional date filter)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.date ? { date: req.query.date } : {};
    const accountReceivables = await accountReceivablesSchema.find(filter).sort({ date: -1 });
    res.json(accountReceivables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a customer
router.post("/create-customer", async (req, res, next) => {
  try {
    const result = await accountReceivablesSchema.create(req.body);
    res.json({
      data: result,
      message: "Customer created successfully",
      status: 200,
    });
  } catch (err) {
    next(err);
  }
});

// POST create a sales invoice for account receivables
router.post('/create-invoice', async (req, res) => {
  const {
    invoiceNumber,
    customerName,
    contactDetails,
    invoiceDate,
    dueDate,
    items,
    subtotal,
    tax,
    totalAmount,
    paymentTerms,
    paymentMethod,
  } = req.body;

  const invoice = new accountReceivablesSchema({
    invoiceNumber,
    customerName,
    contactDetails,
    invoiceDate,
    dueDate,
    items,
    subtotal,
    tax,
    totalAmount,
    paymentTerms,
    paymentMethod,
  });

  try {
    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a sales invoice
router.put('/:id', async (req, res) => {
  try {
    const invoice = await accountReceivablesSchema.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    invoice.invoiceNumber = req.body.invoiceNumber || invoice.invoiceNumber;
    invoice.customerName = req.body.customerName || invoice.customerName;
    invoice.contactDetails = req.body.contactDetails || invoice.contactDetails;
    invoice.invoiceDate = req.body.invoiceDate || invoice.invoiceDate;
    invoice.dueDate = req.body.dueDate || invoice.dueDate;
    invoice.items = req.body.items || invoice.items;
    invoice.subtotal = req.body.subtotal || invoice.subtotal;
    invoice.tax = req.body.tax || invoice.tax;
    invoice.totalAmount = req.body.totalAmount || invoice.totalAmount;
    invoice.paymentTerms = req.body.paymentTerms || invoice.paymentTerms;
    invoice.paymentMethod = req.body.paymentMethod || invoice.paymentMethod;

    const updatedInvoice = await invoice.save();
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a sales invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await accountReceivablesSchema.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    await invoice.remove();
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET export account receivables as CSV
router.get('/export/csv', async (req, res) => {
  try {
    const accountReceivables = await accountReceivablesSchema.find().lean();
    const fields = ['date', 'invoiceNumber', 'customerName', 'invoiceDate', 'dueDate', 'subtotal', 'tax', 'totalAmount', 'paymentTerms', 'paymentMethod'];
    const opts = { fields, transforms: [(item) => ({ ...item, date: item.date?.toISOString().split('T')[0] })] };

    const parser = new Parser(opts);
    const csv = parser.parse(accountReceivables);

    res.header('Content-Type', 'text/csv');
    res.attachment('account_receivables.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export { router as AccountReceivablesRoutes };
