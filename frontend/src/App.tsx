import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Applications from './pages/Applications/Applications';
import Analytics from './pages/Analytics/Analytics';
import ResumeManagement from './pages/Resumes/ResumeManagement';
import Notifications from './pages/Notifications/Notifications';
import Settings from './pages/Settings/Settings';
import Auth from './pages/Auth/Auth';
import Onboarding from './pages/Onboarding/Onboarding';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import { useAuthStore, useUIStore } from './store';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = window.location.pathname;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Handle Onboarding Flow
  if (user && !user.onboarded && location !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (user && user.onboarded && location === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { isAuthenticated } = useAuthStore();
  const { theme, primaryHue } = useUIStore();

  useEffect(() => {
    // Apply Theme (Light/Dark)
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply Primary Color Hue
    document.documentElement.style.setProperty('--primary-hue', primaryHue.toString());
  }, [theme, primaryHue]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Auth /> : <Navigate to="/dashboard" replace />} 
        />

        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Onboarding Route (Protected but outside Layout) */}
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } 
        />

        {/* Protected Routes with Sidebar/Layout */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="resumes" element={<ResumeManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
