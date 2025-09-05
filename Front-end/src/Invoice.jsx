import React, { useRef } from 'react';
// Import jsPDF and html2canvas for PDF generation
// These imports will work after you run: npm install jspdf html2canvas
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Invoice.css'; // Import the new Invoice.css
import './CreateBill.css';

const Invoice = ({ billData, onBack }) => {
  // billData should contain: customerName, mobileNo, orderNo, dateTime, employee, items (array with sweet, quantity, rate, total, type, no)
  const {
    customerName = '',
    mobileNo = '',
    orderNo = '',
    dateTime = '',
    employee = '',
  items = [],
  advanceAmount = 0,
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
    const canvas = await html2canvas(input, { scale: 1 });
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

 


  return (
    <div className="invoice-wrapper">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="rk-back-btn-invoice"
      >
        &larr; Back
      </button>
      <div
        ref={invoiceRef}
        className="invoice-container"
      >
        {/* Header */}
        <div className="invoice-header">
          <h2 className="invoice-title">RK PALKHOVA & SWEETS</h2>
          <h4 className="invoice-subtitle">INVOICE</h4>
        </div>
        {/* Info Row */}
        <div className="invoice-info-row">
          <div className="invoice-info-col">
            <div className="invoice-info-item"><b>Customer Name:</b> {customerName}</div>
            <div className="invoice-info-item"><b>Mobile No:</b> {mobileNo}</div>
          </div>
          {(deliveryDate || deliveryDay) && (
            <div className="invoice-info-col">
              <div className="invoice-info-item"><b>Delivery Date:</b> {deliveryDate ? (typeof deliveryDate === 'string' ? deliveryDate : (deliveryDate.toLocaleDateString && deliveryDate.toLocaleDateString('en-CA'))) : ''}</div>
              <div className="invoice-info-item"><b>Delivery Day:</b> {deliveryDay}</div>
            </div>
          )}
          <div className="invoice-info-col">
            <div className="invoice-info-item"><b>Order No:</b> {orderNo}</div>
            <div className="invoice-info-item"><b>Date & Time:</b> {dateTime}</div>
          </div>
          <div className="invoice-info-col">
            <div className="invoice-info-item"><b>Employee:</b> {employee}</div>
          </div>
        </div>
        {/* Table */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity (g)</th>
              <th>NO's</th>
              <th>Total Quantity</th>
              <th>Rate</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.sweet}</td>
                <td>{item.type}</td>
                <td>{item.no}</td>
                <td>{item.quantity}</td>
                <td>{item.rate}</td>
                <td>{item.total}</td>
              </tr>
            )) : (
              <tr><td colSpan={6}>No items</td></tr>
            )}
          </tbody>
        </table>
        {/* Totals Section */}
        <div className="invoice-totals">
          <div>Total Amount</div>
          <div style={{ textAlign: 'right' }}>₹{totalAmount}</div>
          <div>Advance Amount</div>
          <div style={{ textAlign: 'right' }}>₹{advanceAmount}</div>
          <div>Discount</div>
          <div style={{ textAlign: 'right' }}>₹{discountAmount.toFixed(2)}</div>
          <div className="invoice-grand-total">Grand Total (Rounded)</div>
          <div style={{ textAlign: 'right' }} className="invoice-grand-total">₹{roundedGrandTotal < 0 ? 0 : roundedGrandTotal}</div>
        </div>
        <div className="invoice-thank-you">
          Thank you for your order!
        </div>
      </div>
      <div className="invoice-download-btn-container">
        <button
          className="invoice-download-btn"
          onClick={async () => {
            const pdfUrl = await generatePDF();
            if (pdfUrl) {
              const link = document.createElement('a');
              link.href = pdfUrl;
              link.download = `invoice_${orderNo || 'document'}.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(pdfUrl);
            }
          }}
        >
          Download Invoice PDF
        </button>
      </div>
    </div>
  );
};

export default Invoice;
