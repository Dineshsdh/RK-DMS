
import { useState } from 'react';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import CreateBill from './CreateBill';
import Invoice from './Invoice';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateBill, setShowCreateBill] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [billData, setBillData] = useState(null);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowCreateBill(false);
    setShowInvoice(false);
    setBillData(null);
  };

  // Handler to show CreateBill page
  const handleShowCreateBill = () => {
    setShowCreateBill(true);
    setShowInvoice(false);
    setBillData(null);
  };
  // Handler to go back to dashboard
  const handleBackToDashboard = () => {
    setShowCreateBill(false);
    setShowInvoice(false);
    setBillData(null);
  };

  // Handler to show Invoice page with bill data
  const handleShowInvoice = (data) => {
    setBillData(data);
    setShowInvoice(true);
    setShowCreateBill(false);
  };

  return (
    <>
      {isAuthenticated ? (
        showInvoice ? (
          <Invoice billData={billData} onBack={handleBackToDashboard} />
        ) : showCreateBill ? (
          <CreateBill onLogout={handleLogout} onBack={handleBackToDashboard} onGenerateInvoice={handleShowInvoice} />
        ) : (
          <AdminDashboard onCreateBill={handleShowCreateBill} onLogout={handleLogout} />
        )
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App
