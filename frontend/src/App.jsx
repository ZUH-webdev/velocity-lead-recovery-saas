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
import HelpPage from './components/pages/HelpPage';
import Home from './components/pages/Home';
import SignIn from './components/pages/SignIn';
import SignUp from './components/pages/SignUp';
import { useAppStore } from './store/appStore';
import './index.css';

// Main dashboard layout component
function DashboardLayout() {
  const { currentPage, setCurrentPage } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [headerSearchTerm, setHeaderSearchTerm] = React.useState('');

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
            <Dashboard
              onNavigate={setCurrentPage}
              searchTerm={headerSearchTerm}
              onSearchChange={setHeaderSearchTerm}
            />
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
            <LeadsPage
              onNavigate={setCurrentPage}
              searchTerm={headerSearchTerm}
              onSearchChange={setHeaderSearchTerm}
            />
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
      case 'help':
        return (
          <motion.div
            key="help"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transitionSettings}
          >
            <HelpPage onNavigate={setCurrentPage} />
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
            <Dashboard
              onNavigate={setCurrentPage}
              searchTerm={headerSearchTerm}
              onSearchChange={setHeaderSearchTerm}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec]">
      {/* Obsidian Soft Neumorphism Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#e0e5ec] via-[#e8edf5] to-[#e0e5ec] -z-10" />
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      {/* Fixed Sidebar */}
      <Sidebar onNavigate={setCurrentPage} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Fixed Header */}
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        searchValue={headerSearchTerm}
        onSearch={setHeaderSearchTerm}
      />
      
      {/* Main Content Area */}
      <main className="md:ml-72 pt-24 md:pt-28 pb-10 min-h-screen px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
        </div>
      </main>
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
