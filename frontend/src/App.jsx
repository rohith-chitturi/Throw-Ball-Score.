import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import MatchDetail from './pages/MatchDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ScorerDashboard from './pages/ScorerDashboard';
import ScoringPanel from './pages/ScoringPanel';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, roles = ['admin'] }) => {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            padding: '1rem',
            fontSize: '0.875rem',
            fontWeight: '600'
          },
          success: { iconTheme: { primary: '#3b82f6', secondary: '#fff' } }
        }}
      />
      <Router>
        <div className="min-h-screen bg-slate-900 text-white">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/match/:id" element={<MatchDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scorer"
                element={
                  <ProtectedRoute roles={['scorer']}>
                    <ScorerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/match/:id"
                element={
                  <ProtectedRoute roles={['scorer']}>
                    <ScoringPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute roles={['admin', 'scorer', 'user']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
