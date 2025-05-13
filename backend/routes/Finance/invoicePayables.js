import mongoose from "mongoose";
import express from "express";
import invoicepayablesSchema from "../../models/Finance/invoicePayables.js";

const router = express.Router();

// Create invoice
router.post("/create-invoice", async (req, res, next) => {
  try {
    const result = await invoicepayablesSchema.create(req.body);
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
    const data = await invoicepayablesSchema.find();
    res.json({ data, status: 200 });
  } catch (err) {
    next(err);
  }
});

export { router as invoicepayablesRoutes }