import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import WelcomePage from './pages/WelcomePage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import AuthCallback from './pages/AuthCallback';

const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-brand-dark text-white flex flex-col">
    <Navbar />
    <main className="flex-grow">{children}</main>
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-brand-dark text-white flex flex-col">
    <Navbar isAdmin />
    <main className="flex-grow">{children}</main>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/auth-callback" element={<AuthCallback />} />

          {/* Protected — harus login dulu */}
          <Route path="/home" element={
            <ProtectedRoute>
              <MainLayout><LandingPage /></MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <MainLayout><Dashboard /></MainLayout>
            </ProtectedRoute>
          } />

          {/* Admin only — harus login + role admin */}
          <Route path="/admin/*" element={
            <ProtectedRoute adminOnly>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
