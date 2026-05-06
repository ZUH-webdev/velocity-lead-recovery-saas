import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Menu,
  Settings,
  Bell,
  LogOut,
  Filter,
  Search,
  Zap,
} from 'lucide-react';
import Dashboard from './Dashboard';
import RecoveryFunnel from './RecoveryFunnel';
import LeadCard from './LeadCard';
import AIConversationMirror from './AIConversationMirror';
import CalendarSyncStatus from './CalendarSyncStatus';
import {
  generateMockLeads,
  generateMockRecoveryMetrics,
  generateMockConversation,
  generateMockCalendarStatus,
} from '../utils/mockData';

// Main layout wrapper for the entire dashboard
export const DashboardLayout = () => {
  const [leads, setLeads] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showConversation, setShowConversation] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [calendarStatus, setCalendarStatus] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('All');

  // Initialize mock data
  useEffect(() => {
    setLeads(generateMockLeads(12));
    setMetrics(generateMockRecoveryMetrics());
    setCalendarStatus(generateMockCalendarStatus());
  }, []);

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setConversation(generateMockConversation());
    setShowConversation(true);
  };

  const handleSync = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCalendarStatus((prev) => ({
      ...prev,
      lastSync: new Date().toISOString(),
    }));
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phoneNumber.includes(searchTerm);
    const matchesFilter =
      filterState === 'All' || lead.conversationState === filterState;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Sidebar - Glassmorphism */}
      <motion.aside
        initial={{ x: sidebarOpen ? 0 : -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="fixed left-0 top-0 h-screen w-72 glass-sidebar z-30 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2.5 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg"
              whileHover={{ scale: 1.1 }}
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Velocity</h1>
              <p className="text-xs text-slate-500">Elite SaaS</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { icon: 'Dashboard', label: 'Dashboard' },
            { icon: 'Leads', label: 'Leads' },
            { icon: 'Calendar', label: 'Calendar' },
            { icon: 'Analytics', label: 'Analytics' },
          ].map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ x: 4, backgroundColor: 'rgba(226, 232, 240, 0.5)' }}
              className="w-full px-4 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 transition-all text-left text-sm font-medium"
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200 space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors text-left text-sm font-medium flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-left text-sm font-medium flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-72' : 'ml-0'
        }`}
      >
        {/* Top Navigation */}
        <nav className="sticky top-0 z-20 glass-effect px-8 py-5 flex items-center justify-between border-b border-slate-200/60">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </motion.button>

          <h2 className="text-lg font-semibold text-slate-900 flex-1 ml-4">
            Lead Recovery Dashboard
          </h2>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-slate-600" />
            </motion.button>
          </div>
        </nav>

        {/* Page Content */}
        <Dashboard
          metrics={metrics}
          leads={filteredLeads}
          selectedLead={selectedLead}
          onLeadClick={handleLeadClick}
          calendarStatus={calendarStatus}
          onSync={handleSync}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterState={filterState}
          onFilterChange={setFilterState}
        />
      </div>

      {/* Conversation Mirror Modal */}
      <AIConversationMirror
        isOpen={showConversation}
        onClose={() => setShowConversation(false)}
        lead={selectedLead}
        conversation={conversation}
      />
    </div>
  );
};

export default DashboardLayout;
