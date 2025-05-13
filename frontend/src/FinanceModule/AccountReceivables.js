import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccountReceivables = () => {
  const [accountsReceivables, setAccountsReceivables] = useState([]);
  const [modalCustomerShow, setModalCustomerShow] = useState(false);
  const [modalInvoiceShow, setModalInvoiceShow] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const [customerForm, setCustomerForm] = useState({
    date: "",
    customerName: "",
    customerCode: "",
    email: "",
    billingAddress: "",
    creditLimit: "",
    taxId: "",
  });

  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: "",
    invoiceCustomerName: "",
    contactDetails: "",
    invoiceDate: "",
    dueDate: "",
    items: [{ description: "", quantity: 0, unitPrice: 0, total: 0 }],
    subtotal: 0,
    tax: 0,
    totalAmount: 0,
    paymentTerms: "",
    paymentMethod: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/invoicereceivables/")
      .then((res) => setAccountsReceivables(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  const handleCustomerChange = (e) => {
    setCustomerForm({ ...customerForm, [e.target.name]: e.target.value });
  };

  const handleInvoiceChange = (e) => {
    setInvoiceForm({ ...invoiceForm, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceForm.items];
    updatedItems[index][field] = field === "quantity" || field === "unitPrice" ? parseFloat(value) : value;
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    setInvoiceForm({ ...invoiceForm, items: updatedItems });
  };

  const addItem = () => {
    setInvoiceForm({
      ...invoiceForm,
      items: [...invoiceForm.items, { description: "", quantity: 0, unitPrice: 0, total: 0 }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = invoiceForm.items.filter((_, i) => i !== index);
    setInvoiceForm({ ...invoiceForm, items: updatedItems });
  };

  const submitCustomer = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/customerreceivables/create-customer", customerForm)
      .then(() => {
        setModalCustomerShow(false);
        toast.success("Customer added successfully!");
      })
      .catch(() => {
        setError("Error creating customer");
        toast.error("Failed to add customer!");
      });
  };

  const submitInvoice = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/invoicereceivables/create-invoice", invoiceForm)
      .then(() => {
        setModalInvoiceShow(false);
        toast.success("Invoice created successfully!");
        setAccountsReceivables((prev) => [...prev, invoiceForm]);
      })
      .catch(() => {
        setError("Error creating invoice");
        toast.error("Failed to create invoice!");
      });
  };

  const filteredAccounts = accountsReceivables.filter((q) => {
    const date = q.invoiceDate ? new Date(q.invoiceDate).toISOString().split("T")[0] : "";
    return date === selectedDate;
  });

  return (
    <div>
      <ToastContainer />
      <nav className="navbar border-bottom shadow-lg p-3 mb-5 rounded" style={{ backgroundColor: "purple" }}>
        <div className="container-fluid">
          <span className="navbar-brand text-white"><b>ACCOUNT RECEIVABLES</b></span>
        </div>
      </nav>

      <div className="d-flex justify-content-between my-4">
        <Button variant="success" onClick={() => setModalCustomerShow(true)}>Add Customer</Button>
        <div>
          <Button variant="primary" onClick={() => setModalInvoiceShow(true)}>Create Sales Invoice</Button>
        </div>
        <Link to="/Finance" className="btn btn-primary">BACK</Link>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-secondary">Sales Invoice for: {selectedDate}</h2>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      {/* Customer Modal */}
      <Modal show={modalCustomerShow} onHide={() => setModalCustomerShow(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Add Customer</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitCustomer}>
            {/* SAME AS BEFORE */}
            {/* You can keep your customer form as-is */}
          </Form>
        </Modal.Body>
      </Modal>

      {/* Invoice Modal */}
      <Modal show={modalInvoiceShow} onHide={() => setModalInvoiceShow(false)} size="xl">
        <Modal.Header closeButton><Modal.Title>Add Invoice</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitInvoice}>
            {/* Invoice Details Section */}
            <h5 className="mb-3 text-primary">Invoice Details</h5>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Invoice Number</Form.Label>
                  <Form.Control name="invoiceNumber" value={invoiceForm.invoiceNumber} onChange={handleInvoiceChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Invoice Date</Form.Label>
                  <Form.Control type="date" name="invoiceDate" value={invoiceForm.invoiceDate} onChange={handleInvoiceChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control type="date" name="dueDate" value={invoiceForm.dueDate} onChange={handleInvoiceChange} required />
                </Form.Group>
              </Col>
            </Row>

            {/* Customer Info Section */}
            <h5 className="mt-4 mb-3 text-primary">Customer Information</h5>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control name="invoiceCustomerName" value={invoiceForm.invoiceCustomerName} onChange={handleInvoiceChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Contact Details</Form.Label>
                  <Form.Control name="contactDetails" value={invoiceForm.contactDetails} onChange={handleInvoiceChange} required />
                </Form.Group>
              </Col>
            </Row>

            {/* Items Section */}
            <h5 className="mt-4 mb-3 text-primary">Invoice Items</h5>
            {invoiceForm.items.map((item, index) => (
              <div key={index} className="border rounded p-3 mb-3">
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <Form.Control value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Unit Price</Form.Label>
                      <Form.Control type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Total</Form.Label>
                      <Form.Control value={item.total} disabled />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Button variant="danger" size="sm" onClick={() => removeItem(index)}>Remove</Button>
                  </Col>
                </Row>
              </div>
            ))}
            <Button variant="secondary" onClick={addItem}>Add Item</Button>

            {/* Summary Section */}
            <h5 className="mt-4 mb-3 text-primary">Summary</h5>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Subtotal</Form.Label>
                  <Form.Control type="number" name="subtotal" value={invoiceForm.subtotal} onChange={handleInvoiceChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Tax</Form.Label>
                  <Form.Control type="number" name="tax" value={invoiceForm.tax} onChange={handleInvoiceChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Total Amount</Form.Label>
                  <Form.Control type="number" name="totalAmount" value={invoiceForm.totalAmount} onChange={handleInvoiceChange} />
                </Form.Group>
              </Col>
            </Row>

            {/* Payment Info */}
            <h5 className="mt-4 mb-3 text-primary">Payment Info</h5>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Payment Terms</Form.Label>
                  <Form.Control name="paymentTerms" value={invoiceForm.paymentTerms} onChange={handleInvoiceChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select name="paymentMethod" value={invoiceForm.paymentMethod} onChange={handleInvoiceChange}>
                    <option value="">Select Method</option>
                    <option>Credit Card</option>
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                    <option>Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" className="mt-4">Submit Invoice</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Table remains same */}
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Invoice Number</th>
            <th>Customer Name</th>
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
          {filteredAccounts.length > 0 ? filteredAccounts.map((item, idx) => (
            <tr key={idx}>
              <td>{item.invoiceNumber}</td>
              <td>{item.invoiceCustomerName}</td>
              <td>{item.invoiceDate?.split("T")[0]}</td>
              <td>{item.dueDate?.split("T")[0]}</td>
              <td>{item.subtotal}</td>
              <td>{item.tax}</td>
              <td>{item.totalAmount}</td>
              <td>{item.paymentTerms}</td>
              <td>{item.paymentMethod}</td>
            </tr>
          )) : <tr><td colSpan="9">No invoices for selected date</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AccountReceivables;
