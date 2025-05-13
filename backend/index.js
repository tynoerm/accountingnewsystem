import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cors from "cors";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000', // Your actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.urlencoded({ extended: true })); 
app.use(cors(corsOptions));

// Connecting to MongoDB Database with options
mongoose.connect("mongodb://localhost:27017/accountingsystem", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 40000,  // 30 seconds for connection timeout
  socketTimeoutMS: 40000,   // 30 seconds for socket timeout
})
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("MongoDB connection error: ", err);
  });

// Importing Routes
import { quotationRoutes } from './routes/SalesModule/quotation.js';
import { expensesRoutes } from './routes/ExpensesModule/expenses.js';
import { stocksRoutes } from './routes/StockModule/stocks.js';
import { salesRoutes } from './routes/SalesModule/sales.js';

import {TransactionRoutes} from './routes/Finance/Transaction.js'
import { FixedAssetsRoutes } from './routes/Finance/FixedAssets.js';
import { AccountReceivablesRoutes } from './routes/Finance/AccountsReceivables.js';

import { customerreceivablesRoutes } from './routes/Finance/CustomerReceivables.js';
import { invoicereceivablesRoutes } from './routes/Finance/invoiceReceivables.js';
import { supplierpayablesRoutes } from './routes/Finance/SupplierPayables.js';
import { invoicepayablesRoutes } from './routes/Finance/invoicePayables.js';



// Route Use
app.use("/quotation", quotationRoutes);
app.use("/expense", expensesRoutes);
app.use("/stock", stocksRoutes);
app.use("/salesmodel", salesRoutes);

app.use("/transactions", TransactionRoutes)
app.use("/fixedassets", FixedAssetsRoutes)
app.use("accountreceivables", AccountReceivablesRoutes)

app.use("/customerreceivables", customerreceivablesRoutes)
app.use("/invoicereceivables", invoicereceivablesRoutes)
app.use("/supplierpayables", supplierpayablesRoutes)

app.use("/invoicepayables", invoicepayablesRoutes)

// Start Server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Connection Established Successfully on " + port);
});