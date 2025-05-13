import mongoose from "mongoose";
import express from "express";
import invoicereceivablesSchema from "../../models/Finance/invoiceReceivables.js";

const router = express.Router();

// Create invoice
router.post("/create-invoice", async (req, res, next) => {
  try {
    const result = await invoicereceivablesSchema.create(req.body);
    res.json({
      data: result,
      message: "Invoice created successfully",
      status: 200,
    });
  } catch (err) {
    next(err);
  }
});

// Get all invoices
router.get("/", async (req, res, next) => {
  try {
    const data = await invoicereceivablesSchema.find();
    res.json({ data, status: 200 });
  } catch (err) {
    next(err);
  }
});

export { router as invoicereceivablesRoutes }