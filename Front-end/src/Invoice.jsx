import React, { useRef } from 'react';
// Import jsPDF and html2canvas for PDF generation
// These imports will work after you run: npm install jspdf html2canvas
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './AdminDashboard.css';
import './CreateBill.css';

const Invoice = ({ billData, onBack }) => {
  // billData should contain: customerName, mobileNo, orderNo, dateTime, employee, items (array)
  const {
    customerName = '',
    mobileNo = '',
    orderNo = '',
    dateTime = '',
    employee = '',
  items = [],
  advanceAmount = 0,
  discount = 0,
  discountAmount = 0,
  totalAmount = 0,
  roundedGrandTotal = 0,
  deliveryDate = '',
  deliveryDay = ''
  } = billData || {};

  const invoiceRef = useRef();

  // Helper to format WhatsApp message
  // Generate PDF and return a Blob URL
  const generatePDF = async () => {
    const input = invoiceRef.current;
    if (!input) return null;
    // Use html2canvas to render the invoice as an image
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    // Create a Blob from the PDF
    const pdfBlob = pdf.output('blob');
    // Create a URL for the Blob
    return URL.createObjectURL(pdfBlob);
  };

  // Send PDF via backend to WhatsApp Cloud API
  const handleSendPDFWhatsApp = async () => {
    const phone = '918489597443';
    try {
      const input = invoiceRef.current;
      if (!input) {
        alert('Invoice not ready');
        return;
      }
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output('blob');

      const formData = new FormData();
      formData.append('to', phone);
      formData.append('caption', 'RK PALKHOVA & SWEETS - Invoice');
      formData.append('file', pdfBlob, 'invoice.pdf');

      const resp = await fetch('http://localhost:5000/api/whatsapp/send-pdf', {
        method: 'POST',
        body: formData,
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to send WhatsApp message');
      }
      alert('Invoice sent to WhatsApp successfully');
    } catch (e) {
      console.error(e);
      alert(`Failed to send invoice to WhatsApp: ${e.message}`);
    }
  };
  const getWhatsAppMessage = () => {
    let msg = `*RK PALKHOVA & SWEETS*%0A`;
    msg += `*INVOICE*%0A`;
    msg += `Customer Name: ${customerName}%0A`;
    msg += `Mobile No: ${mobileNo}%0A`;
    msg += `Order No: ${orderNo}%0A`;
    msg += `Date & Time: ${dateTime}%0A`;
    msg += `Employee: ${employee}%0A`;
    msg += `%0A*Items*%0A`;
    if (items && items.length > 0) {
      items.forEach((item, idx) => {
        msg += `${idx + 1}. ${item.sweet} | Qty: ${item.quantity} | Rate: ₹${item.rate} | Total: ₹${item.total}%0A`;
      });
    }
    msg += `%0A*Grand Total: ₹${items.reduce((sum, item) => sum + (Number(item.total) || 0), 0)}*%0A`;
    msg += `%0AThank you for your order!`;
    return msg;
  };


  return (
    <div style={{ position: 'relative' }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          background: '#111',
          color: '#fff',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '0.5rem 1.5rem',
          fontSize: '1rem',
          boxShadow: '0 2px 8px 0 #2228',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        &larr; Back
      </button>
      <div
        ref={invoiceRef}
        style={{
          width: '210mm',
          minHeight: '297mm',
          margin: 'auto',
          background: '#fff',
          boxShadow: '0 0 10px #ccc',
          padding: '32px 40px 32px 40px',
          fontFamily: 'Arial, sans-serif',
          color: '#222',
          position: 'relative',
          borderRadius: '8px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
          <h2 style={{ color: '#b91c1c', marginBottom: 0, letterSpacing: 2 }}>RK PALKHOVA & SWEETS</h2>
          <h4 style={{ color: '#eab308', marginTop: 0, marginBottom: '1.2rem', letterSpacing: 1 }}>INVOICE</h4>
        </div>
        {/* Info Row */}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          gap: 24,
        }}>
          <div style={{ minWidth: 180 }}>
            <div style={{ marginBottom: 4 }}><b>Customer Name:</b> {customerName}</div>
            <div><b>Mobile No:</b> {mobileNo}</div>
          </div>
          <div style={{ minWidth: 180 }}>
            <div style={{ marginBottom: 4 }}><b>Order No:</b> {orderNo}</div>
            <div><b>Date & Time:</b> {dateTime}</div>
          </div>
          <div style={{ minWidth: 180 }}>
            <div><b>Employee:</b> {employee}</div>
          </div>
          <div style={{ minWidth: 180 }}>
            <div><b>Delivery Date:</b> {deliveryDate ? (typeof deliveryDate === 'string' ? deliveryDate : (deliveryDate.toLocaleDateString && deliveryDate.toLocaleDateString('en-CA'))) : ''}</div>
            <div><b>Delivery Day:</b> {deliveryDay}</div>
          </div>
        </div>
        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
          <thead>
            <tr style={{ background: '#eab308', color: '#b91c1c' }}>
              <th style={{ border: '1px solid #eab308', padding: '8px', textAlign: 'center', fontWeight: 700 }}>Sweet Name</th>
              <th style={{ border: '1px solid #eab308', padding: '8px', textAlign: 'center', fontWeight: 700 }}>Quantity</th>
              <th style={{ border: '1px solid #eab308', padding: '8px', textAlign: 'center', fontWeight: 700 }}>Rate</th>
              <th style={{ border: '1px solid #eab308', padding: '8px', textAlign: 'center', fontWeight: 700 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? items.map((item, idx) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #eab308', padding: '8px', textAlign: 'center' }}>{item.sweet}</td>
                <td style={{ border: '1px solid #eab308', padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ border: '1px solid #eab308', padding: '8px', textAlign: 'center' }}>{item.rate}</td>
                <td style={{ border: '1px solid #eab308', padding: '8px', textAlign: 'center' }}>{item.total}</td>
              </tr>
            )) : (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '16px' }}>No items</td></tr>
            )}
          </tbody>
        </table>
        {/* Totals Section */}
        <div style={{
          alignSelf: 'flex-end',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'repeat(4, 1fr)',
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
          margin: '0 0 0 auto',
        }}>
          <div>Total Amount</div>
          <div style={{ textAlign: 'right' }}>₹{totalAmount}</div>
          <div>Advance Amount</div>
          <div style={{ textAlign: 'right' }}>₹{advanceAmount}</div>
          <div>Discount</div>
          <div style={{ textAlign: 'right' }}>₹{discountAmount.toFixed(2)}</div>
          <div style={{ fontWeight: 700, color: '#16a34a' }}>Grand Total (Rounded)</div>
          <div style={{ textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>₹{roundedGrandTotal < 0 ? 0 : roundedGrandTotal}</div>
        </div>
        <div style={{ marginTop: '2.5rem', textAlign: 'center', color: '#888', fontSize: '0.95rem', width: '100%' }}>
          Thank you for your order!
        </div>
      </div>
      <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
        <button
          style={{
            background: '#25D366',
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
            marginRight: '1rem',
          }}
          onClick={handleSendPDFWhatsApp}
        >
          Send Invoice PDF to WhatsApp
        </button>
      </div>
    </div>
  );
};

export default Invoice;
