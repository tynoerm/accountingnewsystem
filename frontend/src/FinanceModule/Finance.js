import React from "react";
import TopMenu from "../Components/TopMenu.js";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer.js";
import { FaShoppingCart, FaRegMoneyBillAlt, FaWarehouse } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div style={styles.container}>
   <nav
        className="navbar border-bottom shadow-lg p-3 mb-5 rounded"
        style={{ backgroundColor: "purple" }}
      >
        <div className="container-fluid">
          <span className="navbar-brand text-white">
            <b>FINANCE</b>
          </span>

          <div className="ms-auto">
            <Link to="/" className="btn btn-primary">BACK</Link>
          </div>
        </div>
      </nav>

      <div style={styles.dashboardContent}>
      <div className="row row-cols-1 row-cols-md-4 g-4">

          {/* Sales Module Card */}
          <div className="col">
            <div className="card shadow-lg rounded">
              <div className="card-body">
                <div style={styles.cardHeader}>
                  <FaShoppingCart style={styles.icon} />
                  <h5 className="card-title">Accounts Payables (Suppliers)</h5>
                </div>
                <p className="card-text">Manages supplier accounts, purchase invoices,</p>
                <Link to="/AccountsPayables" className="btn btn-primary">Next</Link>
              </div>
            </div>
          </div>



          {/* Stock Module Card */}
          <div className="col">
            <div className="card shadow-lg rounded">
              <div className="card-body">
                <div style={styles.cardHeader}>
                  <FaWarehouse style={styles.icon} />
                  <h5 className="card-title">Accounts Receivables (Customers)</h5>
                </div>
                <p className="card-text">Manages customer accounts, sales invoices,</p>
                <Link to="/AccountReceivables" className="btn btn-primary">Next</Link>
              </div>
            </div>
          </div>

          {/* Stock Module Card */}
          <div className="col">
            <div className="card shadow-lg rounded">
              <div className="card-body">
                <div style={styles.cardHeader}>
                  <FaWarehouse style={styles.icon} />
                  <h5 className="card-title">Cash Book / Bank Manager</h5>
                </div>
                <p className="card-text">Captures and reconciles cash, bank, and credit card transactions</p>
                <Link to="/Cashbook" className="btn btn-primary">Next</Link>
              </div>
            </div>
          </div>


          {/* Expenses Module Card */}
          <div className="col">
            <div className="card shadow-lg rounded">
              <div className="card-body">
                <div style={styles.cardHeader}>
                  <FaRegMoneyBillAlt style={styles.icon} />
                  <h5 className="card-title"> Fixed Assets</h5>
                </div>
                <p className="card-text">Tracks and depreciates company fixed assets over time</p>
                <Link to="/FixedAssets" className="btn btn-primary">Next</Link>
              </div>
            </div>
          </div>





        </div>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  dashboardContent: {
    flex: 1,
    padding: '30px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  icon: {
    fontSize: '30px',
    marginRight: '15px',
    color: '#61dafb', // Matching the icon color with React default color
  },
};

export default Dashboard;
