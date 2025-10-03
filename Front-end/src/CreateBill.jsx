import React, { useState, useEffect } from 'react';
import { fetchSweets, createInvoice } from './api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';
import './CreateBill.css';

// Bootstrap Trash SVG icon
const TrashIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
  </svg>
);

const CreateBill = ({ onBack, onGenerateInvoice }) => {
  const employeeNames = ['Anand', 'Dinesh', 'Kama', 'Varun', 'Harish'];

  const [employee, setEmployee] = useState('');
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [orderNo, setOrderNo] = useState('');
  
  const getCurrentDateTime = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const [dateTime, setDateTime] = useState(getCurrentDateTime());
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [items, setItems] = useState([{ sweet: '', type: '', no: '', quantity: '', rate: '', total: '' }]);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [packageAmount, setPackageAmount] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchSweets()
      .then(data => setSweets(data))
      .catch(err => {
        setError(err.message);
        console.error('Failed to fetch sweets:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalAmount = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const discountAmount = Number(discount) || 0;
  const packageHandlingAmount = Number(packageAmount) || 0;
  let grandTotal = totalAmount + packageHandlingAmount - (Number(advanceAmount) || 0) - discountAmount;
  const roundedGrandTotal = Math.round(grandTotal);

  const handleItemChange = (idx, field, value) => {
    setItems(prev =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        let newItem = { ...item, [field]: value };
        if (field === 'sweet') {
          const selectedSweet = sweets.find(s => s.name === value);
          newItem.rate = selectedSweet ? selectedSweet.rate : item.rate;
        }
        if (['type', 'no'].includes(field)) {
          const typeVal = field === 'type' ? value : item.type;
          const noVal = field === 'no' ? value : item.no;
          const qty = (Number(typeVal) * Number(noVal)) / 1000;
          newItem.quantity = isNaN(qty) ? '' : qty.toFixed(3);
        }
        if (['rate', 'quantity', 'type', 'no', 'sweet'].includes(field)) {
          newItem.total = (Number(newItem.quantity) || 0) * (newItem.rate || 0);
        }
        return newItem;
      })
    );
  };

  const handleAddItem = () => {
    setItems([...items, { sweet: '', type: '', no: '', quantity: '', rate: '', total: '' }]);
  };

  const handleDeleteItem = (idx) => {
    setItems(items => items.filter((_, i) => i !== idx));
  };

  const handleGeneratePDF = async () => {
    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    if (!items.some(item => item.sweet && item.quantity)) {
      alert('Please add at least one valid item');
      return;
    }
    
    // Format deliveryTime for submission as 12-hour string
    let formattedDeliveryTime = '';
    if (deliveryTime instanceof Date) {
      let hours = deliveryTime.getHours();
      const minutes = deliveryTime.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      formattedDeliveryTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }
    
    const invoiceData = {
      customerName,
      mobileNo,
      orderNo,
      dateTime,
      employee,
      items: items.filter(item => item.sweet && item.quantity),
      advanceAmount: Number(advanceAmount) || 0,
      discountAmount: discountAmount,
      packageHandlingAmount: packageHandlingAmount, // Fixed: using correct key name
      totalAmount: totalAmount,
      deliveryDate: deliveryDate ? deliveryDate.toISOString().split('T')[0] : '',
      deliveryTime: formattedDeliveryTime
    };
    
    try {
      setLoading(true);
      await createInvoice(invoiceData);
      if (typeof onGenerateInvoice === 'function') onGenerateInvoice(invoiceData);
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
      <div className="container py-4">
        <h2 className="rk-section-title text-center mb-4" style={{ color: '#fff' }}>Create Bill</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="alert alert-info">Loading...</div>}
        <div className="rk-dashboard-card">
          <h4 className="rk-section-title">Order Details</h4>
          <div className="row mb-4">
            <div className="col-md-2 mb-2">
              <label className="rk-order-details-label">Customer Name</label>
              <input className="form-control" type="text" placeholder="Enter name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
            </div>
            <div className="col-md-2 mb-2">
              <label className="rk-order-details-label">Mobile No</label>
              <input className="form-control" type="tel" placeholder="Enter mobile" value={mobileNo} maxLength={10} onChange={e => setMobileNo(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))} />
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
                {employeeNames.map((name, i) => <option key={i} value={name}>{name}</option>)}
              </select>
            </div>
            <div className="col-md-2 mb-2">
              <label className="rk-order-details-label">Delivery Date</label>
              <DatePicker
                className="form-control"
                selected={deliveryDate}
                onChange={date => setDeliveryDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                isClearable
                showMonthDropdown
                showYearDropdown
              />
            </div>
            <div className="col-md-2 mb-2">
              <label className="rk-order-details-label">Delivery Time</label>
              <DatePicker
                className="form-control"
                selected={deliveryTime}
                onChange={date => setDeliveryTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="hh:mm aa"
                placeholderText="Select time"
                isClearable
              />
            </div>
          </div>
          <h4 className="rk-section-title">Bill Section</h4>
          <div className="row mb-4">
            <div className="col-md-3 mb-2">
              <label className="rk-order-details-label">Advance Amount</label>
              <input className="form-control" type="number" value={advanceAmount} onChange={e => setAdvanceAmount(e.target.value)} placeholder="Advance amount" />
            </div>
            <div className="col-md-3 mb-2">
              <label className="rk-order-details-label">Discount Amount</label>
              <input className="form-control" type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Discount amount" />
            </div>
            <div className="col-md-3 mb-2">
              <label className="rk-order-details-label">Package Handling</label>
              <input 
                className="form-control" 
                type="number" 
                value={packageAmount} 
                onChange={e => setPackageAmount(e.target.value)} 
                placeholder="Package handling amount" 
              />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table rk-bill-table">
              <thead>
                <tr>
                  <th>Product Name</th><th>Quantity (g)</th><th>NO's</th><th>Total Quantity (Kg)</th><th>Rate</th><th>Total Amount</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <select className="form-control" value={item.sweet} onChange={e => handleItemChange(idx, 'sweet', e.target.value)}>
                        <option value="">Select Product</option>
                        {sweets.map(sweet => <option key={sweet._id} value={sweet.name}>{sweet.name}</option>)}
                      </select>
                    </td>
                    <td><input className="form-control" type="number" min="0" value={item.type} onChange={e => handleItemChange(idx, 'type', e.target.value)} placeholder="g" /></td>
                    <td><input className="form-control" type="number" min="0" value={item.no} onChange={e => handleItemChange(idx, 'no', e.target.value)} placeholder="Nos" /></td>
                    <td><input className="form-control" type="number" value={item.quantity || ''} readOnly placeholder="Kg" /></td>
                    <td><input className="form-control" type="number" min="0" value={item.rate} onChange={e => handleItemChange(idx, 'rate', e.target.value)} placeholder="Rate" /></td>
                    <td><input className="form-control" type="number" value={item.total || ''} readOnly placeholder="Total" /></td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(idx)} title="Delete item">{TrashIcon}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center"><button className="rk-add-item-btn" onClick={handleAddItem}>Add Item</button></div>
          
          <div className="row justify-content-center mt-4 mb-2">
            <div className="col-md-6">
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: 'repeat(5, 1fr)',
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
                <div style={{ textAlign: 'right' }}>₹{totalAmount.toFixed(2)}</div>
                
                <div>Package Handling</div>
                <div style={{ textAlign: 'right' }}>₹{packageHandlingAmount.toFixed(2)}</div>
                
                <div>Discount</div>
                <div style={{ textAlign: 'right' }}>₹{discountAmount.toFixed(2)}</div>
                
                <div>Advance Amount</div>
                <div style={{ textAlign: 'right' }}>₹{Number(advanceAmount || 0).toFixed(2)}</div>

                <div style={{ fontWeight: 700, color: '#16a34a' }}>Grand Total</div>
                <div style={{ textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>₹{(roundedGrandTotal < 0 ? 0 : roundedGrandTotal).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-5 mb-4">
          <button className="rk-generate-btn" onClick={handleGeneratePDF} disabled={loading}>
            {loading ? 'Saving Invoice...' : 'Generate & View Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBill;