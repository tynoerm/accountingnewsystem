import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ date: '', type: 'cash', description: '', amount: '' });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    const res = await axios.get(`http://localhost:3001/transactions${filter ? `?type=${filter}` : ''}`);
    setTransactions(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:3001/transactions/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post('http://localhost:3001/transactions', form);
    }
    setForm({ date: '', type: 'cash', description: '', amount: '' });
    fetchTransactions();
  };

  const handleEdit = (tx) => {
    setForm({
      date: tx.date.substring(0, 10),
      type: tx.type,
      description: tx.description,
      amount: tx.amount,
    });
    setEditingId(tx._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/transactions/${id}`);
    fetchTransactions();
  };

  const toggleReconcile = async (id) => {
    await axios.put(`http://localhost:3001/transactions/${id}/reconcile`);
    fetchTransactions();
  };

  const exportCSV = async () => {
    const res = await axios.get('http://localhost:3001/transactions/export/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <nav className="navbar border-bottom shadow-lg p-3 mb-5 rounded" style={{ backgroundColor: 'purple' }}>
        <div className="container-fluid">
          <span className="navbar-brand text-white"><b>CASH BOOK</b></span>
          <div className="ms-auto">
            <Link to="/Finance" className="btn btn-secondary">BACK</Link>
          </div>
        </div>
      </nav>

      <div className="container-fluid mt-4">
        <form className="row g-2 mb-4" onSubmit={handleSubmit}>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="credit_card">Credit Card</option>
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Amount"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary w-100">
              {editingId ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>

        <div className="mb-3 d-flex justify-content-between">
          <div>
            <button className="btn btn-outline-secondary me-2" onClick={() => setFilter('')}>All</button>
            <button className="btn btn-outline-secondary me-2" onClick={() => setFilter('cash')}>Cash</button>
            <button className="btn btn-outline-secondary me-2" onClick={() => setFilter('bank')}>Bank</button>
            <button className="btn btn-outline-secondary me-2" onClick={() => setFilter('credit_card')}>Credit Card</button>
          </div>
          <button className="btn btn-success" onClick={exportCSV}>Export CSV</button>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered w-100">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Reconciled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx._id}>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>{tx.type}</td>
                  <td>{tx.description}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.reconciled ? '✅' : '❌'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-1"
                      onClick={() => toggleReconcile(tx._id)}
                    >
                      {tx.reconciled ? 'Unreconcile' : 'Reconcile'}
                    </button>
                    <button
                      className="btn btn-sm btn-info me-1"
                      onClick={() => handleEdit(tx)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(tx._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
