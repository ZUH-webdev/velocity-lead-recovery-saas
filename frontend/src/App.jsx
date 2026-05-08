import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/appStore';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import Dashboard from './components/Dashboard';
import LeadsPage from './components/pages/LeadsPage';
import CalendarPage from './components/pages/CalendarPage';
import SettingsPage from './components/pages/SettingsPage';
import './index.css';

function App() {
  const { currentPage, setCurrentPage } = useAppStore();

  // Render the appropriate page based on currentPage state
  const renderPage = () => {
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
      {/* Fixed Sidebar */}
      <Sidebar onNavigate={setCurrentPage} />

      {/* Main Content Area */}
      <div className="ml-64 flex flex-col">
        {/* Fixed Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 pt-20 px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
