import express from 'express'
const router = express.Router();
import Transaction from '../../models/Finance/Transaction.js'
import { Parser } from 'json2csv';

// GET all transactions (with optional type filter)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a transaction
router.post('/', async (req, res) => {
  const { date, type, description, amount } = req.body;
  const transaction = new Transaction({ date, type, description, amount });
  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a transaction
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    transaction.date = req.body.date || transaction.date;
    transaction.type = req.body.type || transaction.type;
    transaction.description = req.body.description || transaction.description;
    transaction.amount = req.body.amount || transaction.amount;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    await transaction.remove();
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT toggle reconcile status
router.put('/:id/reconcile', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    transaction.reconciled = !transaction.reconciled;
    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET export transactions as CSV
router.get('/export/csv', async (req, res) => {
  try {
    const transactions = await Transaction.find().lean();
    const fields = ['date', 'type', 'description', 'amount', 'reconciled'];
    const opts = { fields, transforms: [(item) => ({ ...item, date: item.date.toISOString().split('T')[0] })] };

    const parser = new Parser(opts);
    const csv = parser.parse(transactions);

    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export {router as TransactionRoutes}
