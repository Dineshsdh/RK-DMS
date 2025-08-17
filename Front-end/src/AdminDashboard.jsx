
import React, { useState, useEffect } from 'react';
import { fetchInvoices } from './api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';
import rkLogo from './assets/Rk Palkhova Logo_page-0001.jpg';


const menuTabs = [
  { key: 'all', label: 'All' },
  { key: 'processing', label: 'Processing' },
  { key: 'completed', label: 'Completed' },
  { key: 'visualization', label: 'Visualization' },
];

const AdminDashboard = ({ onCreateBill, onLogout }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === 'all') {
      setLoading(true);
      fetchInvoices()
        .then(data => {
          // Handle the new paginated response structure
          setInvoices(data.invoices || data);
          setError(null);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #eab308 0%, #b91c1c 60%, #7c4700 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative',
      padding: 0,
      margin: 0
    }}>
      <div style={{
        width: '100%',
        position: 'relative',
        background: 'linear-gradient(90deg, #eab308 0%, #b91c1c 100%)',
        boxShadow: '0 2px 8px 0 #eab30844',
        minHeight: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem 2.5rem',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <img src={rkLogo} alt="RK Logo" style={{ height: 60, width: 60, borderRadius: '50%', background: '#fffbe6', boxShadow: '0 2px 8px 0 #eab30844' }} />
          <h1 style={{
            color: '#fff',
            fontWeight: 800,
            letterSpacing: 2,
            fontSize: '2.2rem',
            margin: 0,
            textAlign: 'center',
          }}>RK PALKHOVA & SWEETS</h1>
        </div>
        <button
          style={{
            position: 'absolute',
            right: '2.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(90deg, #00ff62ff 0%, #eab308 100%)',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.5rem 1.5rem',
            fontSize: '1rem',
            boxShadow: '0 2px 8px 0 #cfcbc213',
            cursor: 'pointer',
            transition: 'background 0.2s',
            marginLeft: '1rem'
          }}
          onClick={typeof onCreateBill === 'function' ? onCreateBill : undefined}
        >
          Create Bill
        </button>
        <button
          className="rk-logout-btn"
          style={{
            position: 'absolute',
            left: '2.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#fff',
            color: '#b91c1c',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.5rem 1.5rem',
            fontSize: '1rem',
            boxShadow: '0 2px 8px 0 #eab30844',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            marginRight: '1rem'
          }}
          onClick={typeof onLogout === 'function' ? onLogout : undefined}
        >
          Logout
        </button>
      </div>

      {/* Row-wise menu */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fffbe6',
        boxShadow: '0 2px 8px 0 #eab30822',
        marginTop: 0,
        marginBottom: 0,
      }}>
        {menuTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '1.1rem 0',
              background: activeTab === tab.key ? '#eab308' : 'transparent',
              color: activeTab === tab.key ? '#b91c1c' : '#7c4700',
              border: 'none',
              borderBottom: activeTab === tab.key ? '4px solid #b91c1c' : '2px solid #eab308',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
              outline: 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content below menu, equal width to menu */}
      <div style={{
        width: '100%',
        minHeight: '300px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        borderTop: '1px solid #eab308',
        borderBottom: '1px solid #eab308',
        marginBottom: '2rem',
      }}>
        {activeTab === 'all' && (
          <div style={{ width: '100%' }}>
            <h4 style={{ color: '#b91c1c', margin: '1rem 0' }}>All Invoices</h4>
            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {!loading && !error && (
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                <table className="table table-bordered table-striped" style={{ fontSize: '1rem', background: '#fff' }}>
                  <thead style={{ background: '#eab308', color: '#b91c1c' }}>
                    <tr>
                      <th>Order No</th>
                      <th>Customer</th>
                      <th>Mobile</th>
                      <th>Date & Time</th>
                      <th>Employee</th>
                      <th>Amount</th>
                      <th>Delivery Date</th>
                      <th>Delivery Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length === 0 ? (
                      <tr><td colSpan={8} style={{ textAlign: 'center' }}>No invoices found.</td></tr>
                    ) : (
                      invoices.map(inv => (
                        <tr key={inv._id}>
                          <td>{inv.orderNo}</td>
                          <td>{inv.customerName}</td>
                          <td>{inv.mobileNo}</td>
                          <td>{inv.dateTime}</td>
                          <td>{inv.employee}</td>
                          <td>₹{inv.roundedGrandTotal}</td>
                          <td>{inv.deliveryDate}</td>
                          <td>{inv.deliveryDay}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeTab === 'processing' && (
          <div style={{ width: '100%', textAlign: 'center', fontSize: '1.2rem', color: '#eab308' }}>
            Processing Orders will be shown here.
          </div>
        )}
        {activeTab === 'completed' && (
          <div style={{ width: '100%', textAlign: 'center', fontSize: '1.2rem', color: '#16a34a' }}>
            Completed Orders will be shown here.
          </div>
        )}
        {activeTab === 'visualization' && (
          <div style={{ width: '100%', textAlign: 'center', fontSize: '1.2rem', color: '#0ea5e9' }}>
            Visualization/Analytics will be shown here.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
