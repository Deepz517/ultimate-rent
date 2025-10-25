import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import './App.css';

// --- Placeholder Components ---
// In a real app, these would be in their own files.
const LoginPage = () => <div>Login Page</div>;
const LandlordDashboard = () => <div>Landlord Dashboard</div>;
const TenantPortal = () => <div>Tenant Portal</div>;
const NotFound = () => <div>404 Not Found</div>;

// --- Mock Auth Hook ---
// This will be replaced with a real JWT-based auth hook.
const useAuth = () => {
  // Mock values: set to 'LANDLORD', 'TENANT', or null to test routing.
  const role: 'LANDLORD' | 'TENANT' | null = 'LANDLORD'; // Change this to test roles
  const isAuthenticated = role !== null;
  return { isAuthenticated, role };
};

// --- Protected Route Component ---
interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />; // Or a specific "Unauthorized" page
  }

  return children;
};


function App() {
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

          {/* Landlord Routes */}
          <Route
            path="/landlord/*"
            element={
              <ProtectedRoute allowedRoles={['LANDLORD']}>
                <LandlordDashboard />
              </ProtectedRoute>
            }
          />

          {/* Tenant Routes */}
          <Route
            path="/tenant/*"
            element={
              <ProtectedRoute allowedRoles={['TENANT']}>
                <TenantPortal />
              </ProtectedRoute>
            }
          />

          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
