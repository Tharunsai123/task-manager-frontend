import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import UserProfile from './components/Profile/UserProfile';
import PrivateRoute from './components/Auth/PrivateRoute';

import './App.css';

function App() {
  // One-time cleanup of old avatar data
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.avatar) {
          delete userData.avatar;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Error cleaning up user data:', error);
      }
    }
  }, []);

  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AuthProvider>
        <TaskProvider>
          <div className="app-wrapper">
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <UserProfile />
                    </PrivateRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
            <ToastContainer 
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;