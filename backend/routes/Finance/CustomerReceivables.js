import mongoose from "mongoose";
import express from "express";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";


import customerReceivablesSchema from "../../models/Finance/CustomerReceivables.js"


let router = express.Router();



router.route("/create-customer").post(async (req, res, next) => {
  await customerReceivablesSchema
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

export { router as customerreceivablesRoutes }