
import { useState } from 'react';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import CreateBill from './CreateBill';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateBill, setShowCreateBill] = useState(false);
  const [billData, setBillData] = useState(null);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowCreateBill(false);
    setBillData(null);
  };

  // Handler to show CreateBill page
  const handleShowCreateBill = () => {
    setShowCreateBill(true);
    setBillData(null);
  };
  // Handler to go back to dashboard
  const handleBackToDashboard = () => {
    setShowCreateBill(false);
    setBillData(null);
  };

  // Handler to show Invoice page with bill data
  const handleInvoiceCreated = () => {
    // After creating invoice (and server-side PDF), return to dashboard
    setShowCreateBill(false);
    setBillData(null);
  };

  return (
    <>
      {isAuthenticated ? (
        showCreateBill ? (
          <CreateBill onLogout={handleLogout} onBack={handleBackToDashboard} onGenerateInvoice={handleInvoiceCreated} />
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
