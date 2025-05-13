import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function FixedAssets() {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    name: '',
    type: 'equipment',
    purchaseDate: '',
    cost: '',
    usefulLife: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchAssets();
  }, [filter]);

  const fetchAssets = async () => {
    const res = await axios.get(`http://localhost:3001/fixedassets${filter ? `?type=${filter}` : ''}`);
    setAssets(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:3001/assets/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post('http://localhost:3001/fixedassets', form);
    }
    setForm({ name: '', type: 'equipment', purchaseDate: '', cost: '', usefulLife: '' });
    fetchAssets();
  };

  const handleEdit = (asset) => {
    setForm({
      name: asset.name,
      type: asset.type,
      purchaseDate: asset.purchaseDate.substring(0, 10),
      cost: asset.cost,
      usefulLife: asset.usefulLife,
    });
    setEditingId(asset._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/fixedassets/${id}`);
    fetchAssets();
  };

  const calculateDepreciation = (asset) => {
    const yearsPassed = new Date().getFullYear() - new Date(asset.purchaseDate).getFullYear();
    const annualDepreciation = asset.cost / asset.usefulLife;
    const accumulatedDepreciation = Math.min(annualDepreciation * yearsPassed, asset.cost);
    const bookValue = asset.cost - accumulatedDepreciation;
    return { accumulatedDepreciation, bookValue };
  };

  const exportCSV = async () => {
    const res = await axios.get('http://localhost:3001/fixedassets/export/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'fixed_assets.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <nav className="navbar border-bottom shadow-lg p-3 mb-5 rounded" style={{ backgroundColor: 'purple' }}>
        <div className="container-fluid">
          <span className="navbar-brand text-white"><b>FIXED ASSETS MANAGER</b></span>
          <div className="ms-auto">
            <Link to="/Finance" className="btn btn-secondary">BACK</Link>
          </div>
        </div>
      </nav>

      <div className="container-fluid vh-100 d-flex flex-column p-4" style={{ backgroundColor: '#f8f9fa' }}>
        <form className="row g-2 mb-4" onSubmit={handleSubmit}>
          <div className="col-md-2">
            <input type="text" className="form-control" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="equipment">Equipment</option>
              <option value="vehicle">Vehicle</option>
              <option value="building">Building</option>
              <option value="laptops">Laptops</option>
              <option value="furniture">Furniture</option>
            </select>
          </div>
          <div className="col-md-2">
            <input type="date" className="form-control" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" placeholder="Cost" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" placeholder="Useful Life (years)" value={form.usefulLife} onChange={e => setForm({ ...form, usefulLife: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              {editingId ? 'Update' : 'Add'} Asset
            </button>
          </div>
        </form>

        <div className="mb-3 d-flex justify-content-between">
          <div>
            <button className="btn btn-outline-secondary me-2" onClick={() => setFilter('')}>All</button>
            <button className="btn btn-outline-secondary me-2" onClick={() => setFilter('equipment')}>Equipment</button>
            <button className="btn btn-outline-secondary me-2" onClick={() => setFilter('vehicle')}>Vehicles</button>
            <button className="btn btn-outline-secondary me-2" onClick={() => setFilter('building')}>Buildings</button>
            <button className="btn btn-outline-secondary me-2" onClick={() => setFilter('furniture')}>Furniture</button>
            <button className="btn btn-outline-secondary me-2" onClick={() => setFilter('laptops')}>Laptops</button>
          </div>
          <button className="btn btn-success" onClick={exportCSV}>Export CSV</button>
        </div>

        <div className="flex-grow-1 overflow-auto">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Purchase Date</th>
                <th>Cost</th>
                <th>Useful Life (years)</th>
                <th>Accumulated Depreciation</th>
                <th>Book Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => {
                const { accumulatedDepreciation, bookValue } = calculateDepreciation(asset);
                return (
                  <tr key={asset._id}>
                    <td>{asset.name}</td>
                    <td>{asset.type}</td>
                    <td>{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                    <td>${asset.cost}</td>
                    <td>{asset.usefulLife}</td>
                    <td>${accumulatedDepreciation.toFixed(2)}</td>
                    <td>${bookValue.toFixed(2)}</td>
                    <td>
                      <button className="btn btn-sm btn-info me-1" onClick={() => handleEdit(asset)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(asset._id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FixedAssets;
