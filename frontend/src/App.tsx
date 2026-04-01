import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TestingList from './pages/TestingList';
import TestingForm from './pages/TestingForm';
import BackendList from './pages/BackendList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/testing-list"
            element={
              <ProtectedRoute>
                <TestingList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/testing-form"
            element={
              <ProtectedRoute>
                <TestingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/backend-list"
            element={
              <ProtectedRoute>
                <BackendList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;