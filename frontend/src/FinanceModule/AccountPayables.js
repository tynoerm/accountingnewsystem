import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

const AccountsPayables = () => {
  const [AccountspayablesForm, setAccountspayablesForm] = useState([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Supplier fields
  const [supplierDate, setSupplierDate] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("");
  const [bankingDetails, setBankingDetails] = useState("");
  const [taxClearanceNumber, setTaxClearanceNumber] = useState("");

  // Invoice fields
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceSupplierName, setInvoiceSupplierName] = useState("");
  const [invoiceContactDetails, setInvoiceContactDetails] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([
    { description: "", quantity: 0, unitPrice: 0, total: 0 },
  ]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/invoicepayables/")
      .then((res) => {
        setAccountspayablesForm(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredAccountspayables = AccountspayablesForm.filter((q) => {
    const date = q.invoiceDate ? new Date(q.invoiceDate).toISOString().split("T")[0] : "";
    return date === selectedDate;
  });
  

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    updatedItems[index].total =
      updatedItems[index].quantity * updatedItems[index].unitPrice;
    setItems(updatedItems);

    const subtotalCalc = updatedItems.reduce((sum, item) => sum + item.total, 0);
    setSubtotal(subtotalCalc);
    setTotalAmount(subtotalCalc + Number(tax));
  };

  const addItem = () => {
    setItems([
      ...items,
      { description: "", quantity: 0, unitPrice: 0, total: 0 },
    ]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);

    const subtotalCalc = updatedItems.reduce((sum, item) => sum + item.total, 0);
    setSubtotal(subtotalCalc);
    setTotalAmount(subtotalCalc + Number(tax));
  };

  const handleSubmitSupplier = (e) => {
    e.preventDefault();
    if (
      !supplierDate ||
      !supplierName ||
      !contactDetails ||
      !paymentTerm ||
      !bankingDetails ||
      !taxClearanceNumber
    ) {
      setError("All supplier fields are required.");
      return;
    }
    setError("");
    const supplierData = {
      supplierDate,
      supplierName,
      contactDetails,
      paymentTerm,
      bankingDetails,
      taxClearanceNumber,
    };
    

    axios
      .post(
        "http://localhost:3001/supplierpayables/create-supplier",
        supplierData
      )
      .then((res) => {
        setAccountspayablesForm((prev) => [...prev, supplierData]);
        setShowSupplierModal(false);
      })
      .catch(() => setError("Error submitting supplier."));
  };

  const handleSubmitInvoice = (e) => {
    e.preventDefault();
    if (
      !invoiceNumber ||
      !invoiceSupplierName ||
      !invoiceContactDetails ||
      !invoiceDate ||
      !dueDate ||
      items.length === 0
    ) {
      setError("All invoice fields are required.");
      return;
    }
    setError("");

    const invoiceData = {
      invoiceNumber,
      invoiceSupplierName,
      invoiceContactDetails,
      invoiceDate,
      dueDate,
      items,
      subtotal,
      tax,
      totalAmount,
      paymentTerms,
      paymentMethod,
    };

    axios
      .post("http://localhost:3001/invoicepayables/create-invoice", invoiceData)
      .then((res) => {
        setShowInvoiceModal(false);
        return axios.get("http://localhost:3001/invoicepayables/");
      })
      .then((res) => setAccountspayablesForm(res.data.data))
      .catch(() => setError("Error submitting invoice."));
  }; 

  const handleDownload = async (type) => {
    try {
      const res = await axios.get(
        `https://accounting-system-1.onrender.com/expense/download/${type}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `file.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <div>
      <nav className="navbar border-bottom shadow-lg p-3 mb-5 rounded" style={{ backgroundColor: "purple" }}>
        <div className="container-fluid">
          <span className="navbar-brand text-white"><b>ACCOUNT PAYABLES</b></span>
        </div>
      </nav>

      <div className="d-flex justify-content-between my-4">
        <Button variant="success" onClick={() => setShowSupplierModal(true)}>ADD A SUPPLIER</Button>
        <div>
          <Button variant="primary" onClick={() => setShowInvoiceModal(true)}>CREATE PURCHASE INVOICE</Button>
          <Button variant="success" onClick={() => handleDownload("excel")}>DOWNLOAD EXCEL</Button>
        </div>
        <Link to="/Finance" className="btn btn-primary">BACK</Link>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-secondary">Purchase Invoices for: {selectedDate}</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="form-control w-auto"
        />
      </div>

      {/* Supplier Modal */}
      <Modal show={showSupplierModal} onHide={() => setShowSupplierModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Add a Supplier</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {/* Display error if any */}
    {error && <div className="alert alert-danger">{error}</div>}

    <form onSubmit={handleSubmitSupplier}>
      {/* Supplier Info */}
      <div className="mb-3">
        <label className="form-label">Date</label>
        <input
          type="date"
          value={supplierDate}
          onChange={(e) => setSupplierDate(e.target.value)}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Supplier Name</label>
        <input
          type="text"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          className="form-control"
          placeholder="Supplier Name"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contact Details</label>
        <input
          type="number"
          value={contactDetails}
          onChange={(e) => setContactDetails(e.target.value)}
          className="form-control"
          placeholder="Contact Number"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Payment Term</label>
        <input
          type="text"
          value={paymentTerm}
          onChange={(e) => setPaymentTerm(e.target.value)}
          className="form-control"
          placeholder="e.g. Net 30"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Banking Details</label>
        <textarea
          value={bankingDetails}
          onChange={(e) => setBankingDetails(e.target.value)}
          className="form-control"
          placeholder="Bank name, account number, branch"
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Tax Clearance Number</label>
        <input
          type="number"
          value={taxClearanceNumber}
          onChange={(e) => setTaxClearanceNumber(e.target.value)}
          className="form-control"
          placeholder="Tax Clearance Number"
          required
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" variant="primary" className="w-100">
        Add Supplier
      </Button>
    </form>
  </Modal.Body>
</Modal>


      {/* Invoice Modal */}
      <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add Purchase Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmitInvoice}>
            <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="form-control mb-2" placeholder="Invoice Number" required />
            <input type="text" value={invoiceSupplierName} onChange={(e) => setInvoiceSupplierName(e.target.value)} className="form-control mb-2" placeholder="Supplier Name" required />
            <input type="number" value={invoiceContactDetails} onChange={(e) => setInvoiceContactDetails(e.target.value)} className="form-control mb-2" placeholder="Contact Details" required />
            <div className="row">
              <div className="col">
                <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="form-control mb-2" placeholder="Invoice Date" required />
              </div>
              <div className="col">
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="form-control mb-2" placeholder="Due Date" required />
              </div>
            </div>
            <h5>Items</h5>
            {items.map((item, idx) => (
              <div key={idx} className="d-flex mb-2 gap-2">
                <input type="text" value={item.description} onChange={(e) => handleItemChange(idx, "description", e.target.value)} placeholder="Description" className="form-control" required />
                <input type="number" value={item.quantity} onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))} placeholder="Qty" className="form-control" required />
                <input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(idx, "unitPrice", Number(e.target.value))} placeholder="Unit Price" className="form-control" required />
                <input type="number" value={item.total} readOnly className="form-control" placeholder="Total" />
                <Button variant="danger" onClick={() => removeItem(idx)}>X</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={addItem}>Add Item</Button>

            <input type="number" value={subtotal} readOnly className="form-control my-2" placeholder="Subtotal" />
            <input type="number" value={tax} onChange={(e) => { setTax(Number(e.target.value)); setTotalAmount(subtotal + Number(e.target.value)); }} className="form-control mb-2" placeholder="Tax" />
            <input type="number" value={totalAmount} readOnly className="form-control mb-2" placeholder="Total Amount" />
            <input type="text" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="form-control mb-2" placeholder="Payment Terms" required />
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="form-control mb-3" required>
              <option value="">Select Payment Method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
            <Button type="submit" variant="primary" className="w-100">Submit Invoice</Button>
          </form>
        </Modal.Body>
      </Modal>


      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Invoice Number</th>
            <th>Supplier Name</th>
            <th>Invoice Date</th>
            <th>Due Date</th>
            <th>Subtotal</th>
            <th>Tax</th>
            <th>Total Amount</th>
            <th>Payment Terms</th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccountspayables.length > 0 ? filteredAccountspayables.map((inv, idx) => (
            <tr key={idx}>
              <td>{inv.invoiceNumber || "N/A"}</td>
              <td>{inv.supplierName || "N/A"}</td>
              <td>{inv.invoiceDate ? inv.invoiceDate.split("T")[0] : "N/A"}</td>
              <td>{inv.dueDate ? inv.dueDate.split("T")[0] : "N/A"}</td>
              <td>{inv.subtotal ?? "N/A"}</td>
              <td>{inv.tax ?? "N/A"}</td>
              <td>{inv.totalAmount ?? "N/A"}</td>
              <td>{inv.paymentTerms || "N/A"}</td>
              <td>{inv.paymentMethod || "N/A"}</td>
            </tr>
          )) : (
            <tr><td colSpan="9">No purchase invoices found for the selected date</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsPayables;
