import React, { useEffect, useState } from 'react';
import { fetchInvoices, deleteInvoicePDF } from './api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';

const AdminDashboard = ({ onCreateBill, onLogout }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchInvoices()
      .then(data => {
        setInvoices(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch invoices');
        setLoading(false);
      });
  }, []);

  const handleDeletePDF = async (invoiceId) => {
    if (!window.confirm('Are you sure you want to delete the PDF for this invoice?')) return;
    setDeletingId(invoiceId);
    try {
      await deleteInvoicePDF(invoiceId);
      setInvoices(prev => prev.map(inv =>
        inv._id === invoiceId ? { ...inv, pdfPath: null } : inv
      ));
    } catch (err) {
      alert('Failed to delete PDF: ' + err.message);
    }
    setDeletingId(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="rk-section-title">All Invoices</h2>
        <div>
          <button className="btn btn-success me-2" onClick={onCreateBill}>Create Bill</button>
          <button className="btn btn-outline-dark" onClick={onLogout}>Logout</button>
        </div>
      </div>
      {loading ? (
        <div>Loading invoices...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered rk-bill-table">
            <thead>
              <tr>
                <th>Order No</th>
                <th>Customer Name</th>
                <th>Mobile No</th>
                <th>Date</th>
                <th>Employee</th>
                <th>Grand Total</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv._id}>
                  <td>{inv.orderNo}</td>
                  <td>{inv.customerName}</td>
                  <td>{inv.mobileNo}</td>
                  <td>{inv.dateTime}</td>
                  <td>{inv.employee}</td>
                  <td>₹{inv.roundedGrandTotal}</td>
                  <td>
                    {inv.pdfPath ? (
                      <>
                        <a
                          href={`/api/invoices/${inv._id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary me-2"
                        >
                          View PDF
                        </a>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeletePDF(inv._id)}
                          disabled={deletingId === inv._id}
                        >
                          {deletingId === inv._id ? 'Deleting...' : 'Delete PDF'}
                        </button>
                      </>
                    ) : (
                      <span style={{ color: '#888' }}>No PDF</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
