import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import rkLogo from './assets/Rk Palkhova Logo_page-0001.jpg';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
  Font,
} from '@react-pdf/renderer';

// --- Font Registration and Helper Functions ---
Font.register({
  family: 'Times-Roman',
  fonts: [
    { src: 'https://fonts.gstatic.com/l/font?kit=z6XVDUZjxJVOV4eXEwjkvw&skey=a1029226f80653a8&v=v17', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/l/font?kit=z6XTDUZjxJVOV4eXEwjkvw&skey=cd2dd6afe6bf0eb2&v=v17', fontWeight: 'bold' },
  ]
});
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf', fontWeight: 'bold' },
  ]
});
Font.registerHyphenationCallback(word => [word]);

const formatDateOnly = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};


// --- PDF Document Component ---
const InvoicePDFDocument = ({ logoUrl }) => {
  // No destructuring needed here as the variables are not used

  // Removed unused variable 'roundedGrandTotal'

  const styles = StyleSheet.create({
    page: { fontFamily: 'Times-Roman', fontSize: 10, padding: 40, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 2, borderBottomColor: '#eab308', paddingBottom: 12, marginBottom: 20 },
    brandSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    brandText: { color: '#b91c1c', fontSize: 22, fontWeight: 'bold' },
    address: { color: '#333', fontSize: 9 },
    logo: { width: 80, height: 80, objectFit: 'contain' },
    estimateBox: { border: '1px solid #b91c1c', padding: 5, borderRadius: 5, alignSelf: 'flex-start', minWidth: 80, textAlign: 'center', marginTop: 5, },
    estimateText: { fontSize: 14, fontWeight: 'bold', color: '#b91c1c' },
    metaInfo: { flexDirection: 'column', alignItems: 'flex-start', paddingTop: 10 },
    metaData: { fontSize: 9, color: '#444', marginTop: 2 },
    section: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    billTo: { fontSize: 9, marginBottom: 2 },
    sectionLabel: { fontWeight: 'bold', fontSize: 11, marginBottom: 4 },
    table: { width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb' },
    tableRow: { flexDirection: 'row' },
    tableHeader: { backgroundColor: '#fef3c7', fontWeight: 'bold', fontSize: 9, textAlign: 'center', borderRightWidth: 1, borderRightColor: '#e5e7eb', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', padding: 5, flex: 1 },
    tableCell: { borderRightWidth: 1, borderRightColor: '#e5e7eb', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', padding: 5, fontSize: 9, flex: 1, textAlign: 'center' },
    rupeeSymbol: { fontFamily: 'Roboto' },
    totals: { alignSelf: 'flex-end', width: '40%', marginTop: 'auto' },
    totalsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
    totalsLabel: { fontSize: 9 },
    totalsValue: { fontSize: 9, textAlign: 'right' },
    grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, fontWeight: 'bold', backgroundColor: '#fef3c7', padding: 5 },
    notes: { color: '#6b7280', fontSize: 8, marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandSection}>
            <Image src={logoUrl} style={styles.logo} />
            <View>
              <Text style={styles.brandText}>RK SWEETS AND BAKERY</Text>
              <Text style={styles.address}>12,13, Hasthampatti Main Road, Salem - 636007</Text>
            </View>
          </View>
          <View style={styles.estimateBox}>
            <Text style={styles.estimateText}>ESTIMATE</Text>
          </View>
        </View>
        {/* The rest of the PDF document structure should be placed here */}
      </Page>
    </Document>
  );
};


// --- Main Invoice Component with HTML Preview ---
export const Invoice = ({ billData, onBack }) => {
  const invoiceRef = useRef();

  const {
    customerName = '', mobileNo = '', orderNo = '', dateTime = '', items = [],
    advanceAmount = 0, discountAmount = 0, totalAmount = 0, packageHandlingAmount = 0,
    deliveryDate = '', deliveryTime = ''
  } = billData || {};
  const logoUrl = rkLogo;
  // Calculate grand total and round it
  const grandTotal = totalAmount - discountAmount - advanceAmount + Number(packageHandlingAmount);
  const roundedGrandTotal = Math.round(grandTotal * 100) / 100;

  const handleManualDownload = async () => {
    try {
      const response = await fetch(logoUrl);
      const imageBlob = await response.blob();
      const logoDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageBlob);
      });

      const blob = await pdf(<InvoicePDFDocument billData={billData} logoUrl={logoDataUrl} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `estimate-${orderNo || 'invoice'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Sorry, there was an error creating the PDF.');
    }
  };

  const handleDownloadImage = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/jpeg', 0.9);
    const link = document.createElement('a');
    link.href = data;
    link.download = `estimate-${orderNo || 'invoice'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '1rem' }}>
      <div className="d-flex justify-content-center align-items-center mb-3 gap-3">
        <button onClick={onBack} className="btn btn-dark fw-bold">&larr; Back to Dashboard</button>
        <button className="btn btn-danger fw-bold" onClick={handleManualDownload}>Download PDF</button>
        <button className="btn btn-primary fw-bold" onClick={handleDownloadImage}>Download Image</button>
      </div>

      <div ref={invoiceRef} style={{ width: '210mm', minHeight: '297mm', margin: 'auto', background: '#fff', boxShadow: '0 0 15px rgba(0,0,0,0.1)', padding: '40px', color: '#333', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', fontFamily: 'Times New Roman, Times, serif' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #eab308', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={logoUrl} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            <div>
              <h2 style={{ fontWeight: 700, color: '#b91c1c', margin: 0, fontSize: '1.8rem' }}>RK SWEETS AND BAKERY</h2>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>12,13, Hasthampatti Main Road, Salem - 636007</p>
            </div>
          </div>
          <div style={{ border: '1px solid #b91c1c', padding: '5px 10px', borderRadius: '5px', marginTop: '5px', textAlign: 'center' }}>
            <h4 style={{ margin: 0, fontWeight: 'bold', color: '#b91c1c' }}>ESTIMATE</h4>
          </div>
        </header>

       <section style={{ display: 'flex', justifyContent: 'space-between', margin: '1.5rem 0' }}>
                 <div>
                   <h5 style={{ fontWeight: 'bold' }}>BILL TO</h5>
                   <p style={{ margin: '0 0 2px' }}>Customer Name: {customerName || <span style={{ color: '#aaa' }}>N/A</span>}</p>
                   <p style={{ margin: '0 0 2px' }}>Mobile Number: {mobileNo || <span style={{ color: '#aaa' }}>N/A</span>}</p>
                 </div>
                 <div style={{ textAlign: 'left' }}>
                   <p style={{ margin: '0 0 2px' }}><strong>Order No:</strong> {orderNo}</p>
                   <p style={{ margin: '0 0 2px' }}><strong>Date:</strong> {formatDateOnly(dateTime)}</p>
                   <p style={{ margin: '0 0 2px' }}><strong>Delivery Date:</strong> {deliveryDate || 'N/A'}</p>
                   <p style={{ margin: '0 0 2px' }}><strong>Delivery Time:</strong> {deliveryTime || 'N/A'}</p>
                 </div>
               </section>
       
               <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                 <thead>
                   <tr style={{ background: '#fef3c7', fontWeight: 'bold' }}>
                     <th style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'left', width: '30%' }}>DESCRIPTION</th>
                     <th style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'center' }}>GRAMS</th>
                     <th style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'center' }}>NO's</th>
                     <th style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'center' }}>QTY (Kg)</th>
                     <th style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'center' }}>RATE</th>
                     <th style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'center' }}>TOTAL</th>
                   </tr>
                 </thead>
                 <tbody>
                   {items && items.length > 0 ? (
                     items.map((item, idx) => (
                       <tr key={idx}>
                         <td style={{ border: '1px solid #e5e7eb', padding: '8px' }}>{item.sweet}</td>
                         <td style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'center' }}>{item.type}</td>
                         <td style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'center' }}>{item.no}</td>
                         <td style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                         <td style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'center' }}>₹{Number(item.rate).toFixed(2)}</td>
                         <td style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'center' }}>₹{Number(item.total).toFixed(2)}</td>
                       </tr>
                     ))
                   ) : (
                     <tr><td colSpan="6" style={{ textAlign: 'center', padding: '8px' }}>No items found.</td></tr>
                   )}
                 </tbody>
               </table>
       
               <div style={{ alignSelf: 'flex-end', width: '40%', marginTop: 'auto' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                   <span>Total</span><span>₹{totalAmount.toFixed(2)}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                   <span>Discount</span><span>₹{discountAmount.toFixed(2)}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                   <span>Advance</span><span>₹{advanceAmount.toFixed(2)}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                   <span>Package Handling</span><span>₹{Number(packageHandlingAmount).toFixed(2)}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', background: '#fef3c7', fontWeight: 'bold', marginTop: '8px', padding: '8px' }}>
                   <span>Balance Due</span><span>₹{roundedGrandTotal < 0 ? '0.00' : roundedGrandTotal.toFixed(2)}</span>
                 </div>
               </div>
       
               <footer style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#666', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                 <p className="fw-bold">Notes & Terms</p>
                 <p>50% advance payment is required for order confirmation. Balance is due upon delivery.</p>
               </footer>
             </div>
           </div>
         );
       };
       
       export default Invoice;