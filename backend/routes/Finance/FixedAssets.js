import express from 'express';
const router = express.Router();
import fixedassetsSchema from '../../models/Finance/FixedAssets.js';
import { Parser } from 'json2csv';

// Get all or filtered assets
router.get('/', async (req, res) => {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const assets = await fixedassetsSchema.find(filter);
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create asset
router.post('/', async (req, res) => {
  try {
    const asset = new fixedassetsSchema(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update asset
router.put('/:id', async (req, res) => {
  try {
    const asset = await fixedassetsSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete asset
router.delete('/:id', async (req, res) => {
  try {
    await fixedassetsSchema.findByIdAndDelete(req.params.id);
    res.json({ message: 'Asset deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Export CSV
router.get('/export/csv', async (req, res) => {
  try {
    const assets = await fixedassetsSchema.find();
    const fields = ['name', 'type', 'purchaseDate', 'cost', 'usefulLife'];
    const parser = new Parser({ fields });
    const csv = parser.parse(assets);
    res.header('Content-Type', 'text/csv');
    res.attachment('fixed_assets.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export {router as FixedAssetsRoutes}

