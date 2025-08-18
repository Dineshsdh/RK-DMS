import React, { useState, useEffect } from 'react';
import { fetchSweets, createInvoice } from './api';
// Bootstrap Trash SVG icon
const TrashIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
  </svg>
);
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';
import './CreateBill.css';

const CreateBill = ({ onBack, onGenerateInvoice }) => {
  const employeeNames = [
    'Anand',
    'Dinesh',
    'Kama',
    'Varun',
    'Harish'
  ];

  const [employee, setEmployee] = useState('');
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [orderNo, setOrderNo] = useState('');
  // Get current date and time in yyyy-MM-ddTHH:mm format
  const getCurrentDateTime = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const yyyy = now.getFullYear();
    const MM = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  };
  const [dateTime, setDateTime] = useState(getCurrentDateTime());
  // Delivery date and day
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryDay, setDeliveryDay] = useState('');
  const [items, setItems] = useState([
    { sweet: '', quantity: '', rate: '' }
  ]);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [discount, setDiscount] = useState(0); // discount as amount

  // Fetch sweets on component mount
  useEffect(() => {
    setLoading(true);
    fetchSweets()
      .then(data => {
        setSweets(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        console.error('Failed to fetch sweets:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Calculate total and grand total
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  // Discount as direct amount
  const discountAmount = Number(discount) || 0;
  let grandTotal = totalAmount - (Number(advanceAmount) || 0) - discountAmount;
  const roundedGrandTotal = Math.round(grandTotal);

  // Handler to update item fields
  const handleItemChange = (idx, field, value) => {
    setItems(prev =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        
        // If sweet is changed, automatically set the rate
        if (field === 'sweet') {
          const selectedSweet = sweets.find(s => s.name === value);
          return {
            ...item,
            sweet: value,
            rate: selectedSweet ? selectedSweet.rate : item.rate,
            total: item.quantity && selectedSweet 
              ? item.quantity * selectedSweet.rate 
              : (item.quantity && item.rate ? item.quantity * item.rate : item.total)
          };
        }
        
        // For other fields
        return {
          ...item,
          [field]: value,
          total:
            field === 'quantity' || field === 'rate'
              ? (field === 'quantity' ? value : item.quantity) *
                (field === 'rate' ? value : item.rate)
              : item.total
        };
      })
    );
  };

  // Handler to add a new item row
  const handleAddItem = () => {
    setItems([...items, { sweet: '', quantity: '', rate: '' }]);
  };

  // Handler to delete an item row
  const handleDeleteItem = (idx) => {
    setItems(items => items.filter((_, i) => i !== idx));
  };

  const handleGeneratePDF = async () => {
    // Validate required fields
    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    
    if (items.length === 0 || !items.some(item => item.sweet && item.quantity)) {
      alert('Please add at least one item with sweet and quantity');
      return;
    }

    const invoiceData = {
      customerName,
      mobileNo,
      orderNo,
      dateTime,
      employee,
      items: items.filter(item => item.sweet && item.quantity).map(item => ({
        sweet: item.sweet,
        quantity: item.quantity,
        rate: item.rate,
        total: item.total
      })),
      advanceAmount: Number(advanceAmount) || 0,
      discount: Number(discount) || 0,
      discountAmount: discountAmount,
      totalAmount: totalAmount,
      grandTotal: grandTotal,
      roundedGrandTotal: roundedGrandTotal,
      deliveryDate: deliveryDate ? deliveryDate.toISOString().split('T')[0] : '',
      deliveryDay: deliveryDay
    };

    try {
      setLoading(true);
      // Save invoice to backend
      const savedInvoice = await createInvoice(invoiceData);
      console.log('Invoice saved successfully:', savedInvoice);
      
      // Generate PDF with saved invoice data
      if (typeof onGenerateInvoice === 'function') {
        onGenerateInvoice(savedInvoice);
      }
    } catch (error) {
      console.error('Failed to save invoice:', error);
      alert('Failed to save invoice: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rk-dashboard-bg" style={{ position: 'relative' }}>
      <button className="rk-back-btn" onClick={onBack}>&larr; Back</button>
      <div>
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="rk-section-title">Create Bill</h2>
          </div>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          {loading && (
            <div className="alert alert-info" role="alert">
              Loading sweets...
            </div>
          )}
          <div className="rk-dashboard-card">
            <h4 className="rk-section-title">Order Details</h4>
            <div className="row mb-4">
              <div className="col-md-2 mb-2">
                <label className="rk-order-details-label">Customer Name</label>
                <input className="form-control" type="text" placeholder="Enter name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
              </div>
              <div className="col-md-2 mb-2">
                <label className="rk-order-details-label">Mobile No</label>
                <input
                  className="form-control"
                  type="tel"
                  placeholder="Enter mobile"
                  value={mobileNo}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  onChange={e => {
                    // Only allow digits and max 10 characters
                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                    setMobileNo(val);
                  }}
                />
              </div>
              <div className="col-md-2 mb-2">
                <label className="rk-order-details-label">Order No</label>
                <input className="form-control" type="text" placeholder="Order number" value={orderNo} onChange={e => setOrderNo(e.target.value)} />
              </div>
              <div className="col-md-3 mb-2">
                <label className="rk-order-details-label">Time & Date</label>
                <input className="form-control" type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} />
              </div>
              <div className="col-md-3 mb-2">
                <label className="rk-order-details-label">Employee Name</label>
                <select className="form-control" value={employee} onChange={e => setEmployee(e.target.value)}>
                  <option value="">Select Employee</option>
                  {employeeNames.map((name, i) => (
                    <option key={i} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 mb-2">
                <label className="rk-order-details-label">Delivery Date</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DatePicker
                    className="form-control"
                    selected={deliveryDate}
                    onChange={date => {
                      setDeliveryDate(date);
                      if (date) {
                        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        setDeliveryDay(days[date.getDay()]);
                      } else {
                        setDeliveryDay('');
                      }
                    }}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select delivery date"
                    isClearable
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>
              <div className="col-md-2 mb-2">
                <label className="rk-order-details-label">Delivery Day</label>
                <input className="form-control" type="text" value={deliveryDay} readOnly placeholder="Day" />
              </div>
            </div>
            <h4 className="rk-section-title">Bill Section</h4>

            {/* Advance and Discount Section */}
            <div className="row mb-4">
              <div className="col-md-3 mb-2">
                <label className="rk-order-details-label">Advance Amount</label>
                <input className="form-control" type="number" min="0" value={advanceAmount} onChange={e => setAdvanceAmount(e.target.value)} placeholder="Advance amount" />
              </div>
              <div className="col-md-3 mb-2">
                <label className="rk-order-details-label">Discount (Amount)</label>
                <input className="form-control" type="number" min="0" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Discount amount" />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table rk-bill-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Total Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <select 
                          className="form-control" 
                          value={item.sweet} 
                          onChange={e => handleItemChange(idx, 'sweet', e.target.value)}
                        >
                          <option value="">Select Sweet</option>
                          {sweets.map(sweet => (
                            <option key={sweet._id} value={sweet.name}>
                              {sweet.name} 
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input className="form-control" type="number" min="0" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))} placeholder="Qty" />
                      </td>
                      <td>
                        <input className="form-control" type="number" min="0" value={item.rate} onChange={e => handleItemChange(idx, 'rate', Number(e.target.value))} placeholder="Rate" />
                      </td>
                      <td>
                        <input className="form-control" type="number" min="0" value={item.total || ''} readOnly placeholder="Total" />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          style={{
                            borderRadius: '0.4rem',
                            padding: '0.25rem 0.7rem',
                            marginLeft: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#dc2626',
                            border: 'none',
                            color: '#fff',
                            transition: 'background 0.2s',
                          }}
                          onClick={() => handleDeleteItem(idx)}
                          title="Delete item"
                        >
                          {TrashIcon}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center">
              <button className="rk-add-item-btn" onClick={handleAddItem}>Add Item</button>
            </div>

            {/* Square layout for totals */}
            <div className="row justify-content-center mt-4 mb-2">
              <div className="col-md-6">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 1fr 1fr',
                  gap: '0.5rem',
                  background: '#fffbe6',
                  borderRadius: '1rem',
                  boxShadow: '0 2px 8px 0 #eab30844',
                  border: '2px solid #eab308',
                  padding: '1.5rem',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: '#b91c1c',
                  minWidth: '260px',
                  maxWidth: '350px',
                  margin: '0 auto',
                }}>
                  <div>Total Amount</div>
                  <div style={{ textAlign: 'right' }}>₹{totalAmount}</div>
                  <div>Advance Amount</div>
                  <div style={{ textAlign: 'right' }}>₹{advanceAmount || 0}</div>
                  <div>Discount</div>
                  <div style={{ textAlign: 'right' }}>₹{discountAmount.toFixed(2)}</div>
                  <div style={{ fontWeight: 700, color: '#16a34a' }}>Grand Total (Rounded)</div>
                  <div style={{ textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>₹{roundedGrandTotal < 0 ? 0 : roundedGrandTotal}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Generate PDF Button at bottom center */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
          <button
            style={{
              background: '#111',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem 2.5rem',
              fontSize: '1.1rem',
              boxShadow: '0 2px 8px 0 #2228',
              cursor: 'pointer',
              transition: 'background 0.2s',
              marginBottom: '1.5rem',
            }}
            onClick={handleGeneratePDF}
            disabled={loading}
          >
            {loading ? 'Saving Invoice...' : 'Generate PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBill;
