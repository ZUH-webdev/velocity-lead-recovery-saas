import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import Dashboard from './components/Dashboard';
import LeadsPage from './components/pages/LeadsPage';
import CalendarPage from './components/pages/CalendarPage';
import SettingsPage from './components/pages/SettingsPage';
import Home from './components/pages/Home';
import SignIn from './components/pages/SignIn';
import SignUp from './components/pages/SignUp';
import { useAppStore } from './store/appStore';
import './index.css';

// Main dashboard layout component
function DashboardLayout() {
  const { currentPage, setCurrentPage } = useAppStore();

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const transitionSettings = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transitionSettings}
          >
            <Dashboard onNavigate={setCurrentPage} />
          </motion.div>
        );
      case 'leads':
        return (
          <motion.div
            key="leads"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transitionSettings}
          >
            <LeadsPage onNavigate={setCurrentPage} />
          </motion.div>
        );
      case 'calendar':
        return (
          <motion.div
            key="calendar"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transitionSettings}
          >
            <CalendarPage onNavigate={setCurrentPage} />
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div
            key="settings"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transitionSettings}
          >
            <SettingsPage onNavigate={setCurrentPage} />
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="dashboard"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transitionSettings}
          >
            <Dashboard onNavigate={setCurrentPage} />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Sidebar onNavigate={setCurrentPage} />
      <div className="ml-64 flex flex-col">
        <Header />
        <main className="flex-1 pt-20 px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

// App component with routing
function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />}
      />
      <Route
        path="/signin"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// Main App component with AuthProvider and Router
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
