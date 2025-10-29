import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import LandlordLayout from './components/layout/LandlordLayout';
import DashboardPage from './pages/DashboardPage';
import TenantsPage from './pages/TenantsPage';
import LeasesPage from './pages/LeasesPage';
import PaymentsPage from './pages/PaymentsPage';
import UtilityBillsPage from './pages/UtilityBillsPage';
import ReportsPage from './pages/ReportsPage';
import TenantLayout from './components/layout/TenantLayout';
import TenantDashboardPage from './pages/TenantDashboardPage';
import './App.css';

// --- Placeholder Pages ---
const NotFound = () => <div>404 Not Found</div>;
const Unauthorized = () => <div>403 Unauthorized</div>;


// --- Protected Route Component ---
interface ProtectedRouteProps {
  allowedRoles: ('LANDLORD' | 'TENANT')[];
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};


function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/landlord/*"
            element={
              <ProtectedRoute allowedRoles={['LANDLORD']}>
                <LandlordLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant/*"
            element={
              <ProtectedRoute allowedRoles={['TENANT']}>
                <TenantLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                user?.role === 'LANDLORD' ? (
                  <Navigate to="/landlord" />
                ) : (
                  <Navigate to="/tenant" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
