
import React, { useState, useEffect } from 'react';
import { fetchInvoices, fetchInvoicesByStatus, updateInvoice, deleteInvoice } from './api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';
import rkLogo from './assets/Rk Palkhova Logo_page-0001.jpg';


const menuTabs = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

const AdminDashboard = ({ onCreateBill, onLogout }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      try {
        if (activeTab === 'all') {
          const data = await fetchInvoices();
          setInvoices(data.invoices || data);
        } else if (activeTab === 'pending') {
          const data = await fetchInvoicesByStatus('pending');
          setInvoices(data.invoices || data);
        } else if (activeTab === 'delivered') {
          const data = await fetchInvoicesByStatus('delivered');
          setInvoices(data.invoices || data);
        } else if (activeTab === 'cancelled') {
          const data = await fetchInvoicesByStatus('cancelled');
          setInvoices(data.invoices || data);
        } else {
          setInvoices([]);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
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
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: 900 }}>
              <h4 style={{ color: '#b91c1c', margin: '1rem 0', textAlign: 'center' }}>All Invoices</h4>
              {loading && <div style={{ textAlign: 'center' }}>Loading...</div>}
              {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
              {!loading && !error && (
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  <table className="table table-bordered table-striped" style={{ fontSize: '1rem', background: '#fff', margin: '0 auto' }}>
                    <thead style={{ background: '#eab308', color: '#b91c1c' }}>
                      <tr>
                        <th>Order No</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center' }}>No invoices found.</td></tr>
                      ) : (
                        invoices.map(inv => (
                          <tr key={inv._id}>
                            <td>{inv.orderNo}</td>
                            <td>{inv.customerName}</td>
                            <td style={{ textTransform: 'capitalize' }}>{inv.status || 'pending'}</td>
                            <td>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <button
                                  onClick={() => setPreviewInvoice(inv)}
                                  className="btn btn-primary btn-sm"
                                >View</button>
                                <select
                                  className="form-select form-select-sm"
                                  value={inv.status || 'pending'}
                                  onChange={async (e) => {
                                    try {
                                      setLoading(true);
                                      await updateInvoice(inv._id, { status: e.target.value });
                                      if (activeTab === 'all') {
                                        const data = await fetchInvoices();
                                        setInvoices(data.invoices || data);
                                      } else {
                                        const data = await fetchInvoicesByStatus(activeTab);
                                        setInvoices(data.invoices || data);
                                      }
                                    } catch (err) {
                                      alert(err.message);
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                  style={{ width: 140 }}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={async () => {
                                    if (!confirm('Delete this invoice and its PDF?')) return;
                                    try {
                                      setLoading(true);
                                      await deleteInvoice(inv._id);
                                      if (activeTab === 'all') {
                                        const data = await fetchInvoices();
                                        setInvoices(data.invoices || data);
                                      } else {
                                        const data = await fetchInvoicesByStatus(activeTab);
                                        setInvoices(data.invoices || data);
                                      }
                                    } catch (err) {
                                      alert(err.message);
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                >Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'pending' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: 900 }}>
              <h4 style={{ color: '#b91c1c', margin: '1rem 0', textAlign: 'center' }}>Pending Invoices</h4>
              {loading && <div style={{ textAlign: 'center' }}>Loading...</div>}
              {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
              {!loading && !error && (
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  <table className="table table-bordered table-striped" style={{ fontSize: '1rem', background: '#fff', margin: '0 auto' }}>
                    <thead style={{ background: '#eab308', color: '#b91c1c' }}>
                      <tr>
                        <th>Order No</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center' }}>No invoices found.</td></tr>
                      ) : (
                        invoices.map(inv => (
                          <tr key={inv._id}>
                            <td>{inv.orderNo}</td>
                            <td>{inv.customerName}</td>
                            <td style={{ textTransform: 'capitalize' }}>{inv.status || 'pending'}</td>
                            <td>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <button
                                  onClick={() => setPreviewInvoice(inv)}
                                  className="btn btn-primary btn-sm"
                                >View</button>
                                <select
                                  className="form-select form-select-sm"
                                  value={inv.status || 'pending'}
                                  onChange={async (e) => {
                                    try {
                                      setLoading(true);
                                      await updateInvoice(inv._id, { status: e.target.value });
                                      const data = await fetchInvoicesByStatus('pending');
                                      setInvoices(data.invoices || data);
                                    } catch (err) {
                                      alert(err.message);
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                  style={{ width: 140 }}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={async () => {
                                    if (!confirm('Delete this invoice and its PDF?')) return;
                                    try {
                                      setLoading(true);
                                      await deleteInvoice(inv._id);
                                      const data = await fetchInvoicesByStatus('pending');
                                      setInvoices(data.invoices || data);
                                    } catch (err) {
                                      alert(err.message);
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                >Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'delivered' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: 900 }}>
              <h4 style={{ color: '#16a34a', margin: '1rem 0', textAlign: 'center' }}>Delivered Invoices</h4>
              {loading && <div style={{ textAlign: 'center' }}>Loading...</div>}
              {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
              {!loading && !error && (
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  <table className="table table-bordered table-striped" style={{ fontSize: '1rem', background: '#fff', margin: '0 auto' }}>
                    <thead style={{ background: '#eab308', color: '#b91c1c' }}>
                      <tr>
                        <th>Order No</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center' }}>No invoices found.</td></tr>
                      ) : (
                        invoices.map(inv => (
                          <tr key={inv._id}>
                            <td>{inv.orderNo}</td>
                            <td>{inv.customerName}</td>
                            <td style={{ textTransform: 'capitalize' }}>{inv.status || 'pending'}</td>
                            <td>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <button
                                  onClick={() => setPreviewInvoice(inv)}
                                  className="btn btn-primary btn-sm"
                                >View</button>
                                <select
                                  className="form-select form-select-sm"
                                  value={inv.status || 'pending'}
                                  onChange={async (e) => {
                                    try {
                                      setLoading(true);
                                      await updateInvoice(inv._id, { status: e.target.value });
                                      const data = await fetchInvoicesByStatus('delivered');
                                      setInvoices(data.invoices || data);
                                    } catch (err) {
                                      alert(err.message);
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                  style={{ width: 140 }}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={async () => {
                                    if (!confirm('Delete this invoice and its PDF?')) return;
                                    try {
                                      setLoading(true);
                                      await deleteInvoice(inv._id);
                                      const data = await fetchInvoicesByStatus('delivered');
                                      setInvoices(data.invoices || data);
                                    } catch (err) {
                                      alert(err.message);
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                >Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'cancelled' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: 900 }}>
              <h4 style={{ color: '#7c4700', margin: '1rem 0', textAlign: 'center' }}>Cancelled Invoices</h4>
              {loading && <div style={{ textAlign: 'center' }}>Loading...</div>}
              {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
              {!loading && !error && (
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  <table className="table table-bordered table-striped" style={{ fontSize: '1rem', background: '#fff', margin: '0 auto' }}>
                    <thead style={{ background: '#eab308', color: '#b91c1c' }}>
                      <tr>
                        <th>Order No</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center' }}>No invoices found.</td></tr>
                      ) : (
                        invoices.map(inv => (
                          <tr key={inv._id}>
                            <td>{inv.orderNo}</td>
                            <td>{inv.customerName}</td>
                            <td style={{ textTransform: 'capitalize' }}>{inv.status || 'pending'}</td>
                            <td>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <button
                                  onClick={() => setPreviewInvoice(inv)}
                                  className="btn btn-primary btn-sm"
                                >View</button>
                                <select
                                  className="form-select form-select-sm"
                                  value={inv.status || 'pending'}
                                  onChange={async (e) => {
                                    try {
                                      setLoading(true);
                                      await updateInvoice(inv._id, { status: e.target.value });
                                      const data = await fetchInvoicesByStatus('cancelled');
                                      setInvoices(data.invoices || data);
                                    } catch (err) {
                                      alert(err.message);
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                  style={{ width: 140 }}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={async () => {
                                    if (!confirm('Delete this invoice and its PDF?')) return;
                                    try {
                                      setLoading(true);
                                      await deleteInvoice(inv._id);
                                      const data = await fetchInvoicesByStatus('cancelled');
                                      setInvoices(data.invoices || data);
                                    } catch (err) {
                                      alert(err.message);
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                >Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      {previewInvoice && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 16, width: '820px', maxWidth: '95vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h5 style={{ margin: 0 }}>Invoice Preview</h5>
              <button className="btn btn-sm btn-secondary" onClick={() => setPreviewInvoice(null)}>Close</button>
            </div>
            <div style={{ width: '100%', height: '1150px', overflow: 'hidden', border: '1px solid #ddd', borderRadius: 4 }}>
              <iframe
                title="Invoice PDF"
                src={`http://localhost:5000/api/invoices/${previewInvoice._id}/pdf`}
                style={{ width: '100%', height: '100%', border: 'none', background: '#f5f5f5' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Chart.js visualization component for daily totals
const VisualizationSection = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const chartRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const resp = await fetch('http://localhost:5000/api/invoices?page=1&limit=1000');
        if (!resp.ok) {
          const e = await resp.json().catch(() => ({}));
          throw new Error(e.error || 'Failed to fetch invoices');
        }
        const data = await resp.json();
        const invoices = data.invoices || data;
        const totalsByDate = {};
        invoices.forEach(inv => {
          const d = (inv.deliveryDate && inv.deliveryDate.length >= 10 ? inv.deliveryDate : (inv.createdAt || '')).slice(0,10);
          const amt = Number(inv.roundedGrandTotal || inv.grandTotal || inv.totalAmount || 0);
          if (d) {
            totalsByDate[d] = (totalsByDate[d] || 0) + amt;
          }
        });
        const labels = Object.keys(totalsByDate).sort();
        const values = labels.map(l => totalsByDate[l]);

        const { Chart } = await import('chart.js/auto');
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
        const ctx = chartRef.current.getContext('2d');
        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Daily Invoice Amount (₹)',
              data: values,
              borderColor: '#b91c1c',
              backgroundColor: 'rgba(234, 179, 8, 0.3)',
              tension: 0.2,
              fill: true,
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
              x: { title: { display: true, text: 'Date' } },
              y: { title: { display: true, text: 'Amount (₹)' }, beginAtZero: true }
            }
          }
        });
        setError(null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    init();
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
      <div style={{ width: '100%', maxWidth: 900 }}>
        <h4 style={{ color: '#0ea5e9', margin: '1rem 0', textAlign: 'center' }}>Daily Invoice Amount</h4>
        {loading && <div style={{ textAlign: 'center' }}>Loading chart...</div>}
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        <div style={{ background: '#fffbe6', border: '1px solid #eab308', borderRadius: 8, padding: 16 }}>
          <canvas ref={chartRef} height="180"></canvas>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;