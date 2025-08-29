
import { useState, lazy, Suspense } from 'react';

const Login = lazy(() => import('./Login'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const CreateBill = lazy(() => import('./CreateBill'));


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
    <Suspense fallback={<div>Loading...</div>}>
      {isAuthenticated ? (
        showCreateBill ? (
          <CreateBill onLogout={handleLogout} onBack={handleBackToDashboard} onGenerateInvoice={handleInvoiceCreated} />
        ) : (
          <AdminDashboard onCreateBill={handleShowCreateBill} onLogout={handleLogout} />
        )
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </Suspense>
  );
}

export default App
