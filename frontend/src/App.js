
import './App.css';
import Footer from './Components/Footer.js';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from "./Dashboard.js"

import SalesModuleDashboard from './SalesModule/Dashboard.js';
import Sales from "./SalesModule/Sales.js"

import Expenses from './ExpensesModule/Expenses.js';
import Stock from './StockModule/Stock.js';
import Quotation from './SalesModule/Quotation.js';
import SalesReports from './SalesModule/SalesReports.js';

import Finance from './FinanceModule/Finance.js'
import AccountsPayables from './FinanceModule/AccountPayables.js';
import AccountReceivables from './FinanceModule/AccountReceivables.js';

import Cashbook from './FinanceModule/Cashbook.js'
import FixedAssets from './FinanceModule/FixedAssets.js';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Dashboard/>} />
        <Route path="Sales" element={<Sales/>} />
        <Route path="SalesModuleDashboard" element={<SalesModuleDashboard/>} />    
        <Route path="Quotation" element={<Quotation/>} />
        <Route path="Expenses" element={<Expenses/>} />


        <Route path="Finance" element={<Finance/>} />
        <Route path="AccountsPayables" element={<AccountsPayables/>} />
        <Route path="AccountReceivables" element={<AccountReceivables/>} /> 

        <Route path="Cashbook" element={<Cashbook/>} /> 
        <Route path="FixedAssets" element={<FixedAssets/>} /> 
       

        <Route path="Stock" element={<Stock/>} />
        <Route path="SalesReports" element={<SalesReports/>} />


      </Routes>
    </Router>
  );
}

export default App;
