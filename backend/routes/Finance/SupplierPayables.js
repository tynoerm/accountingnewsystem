import mongoose from "mongoose";
import express from "express";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";


import supplierpayablesSchema from "../../models/Finance/SupplierPayables.js"


let router = express.Router();



router.route("/create-supplier").post(async (req, res, next) => {
  await supplierpayablesSchema
    .create(req.body)
    .then((result) => {
      res.json({
        data: result,
        message: "stocks created successfully",
        status: 200,
      });
    })
    .catch((err) => {
      return next(err);
    });
});

export { router as supplierpayablesRoutes }