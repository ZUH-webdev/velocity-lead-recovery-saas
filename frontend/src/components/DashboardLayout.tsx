"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Dashboard from './Dashboard';
import {
  generateMockLeads,
  generateMockRecoveryMetrics,
  generateMockConversation,
  generateMockCalendarStatus,
} from '../utils/mockData';
import AIConversationMirror from './AIConversationMirror';
import type { CalendarStatus, ConversationMessage, Lead, RecoveryMetrics } from '../types';

// Main layout wrapper for the entire dashboard
export const DashboardLayout = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [metrics, setMetrics] = useState<RecoveryMetrics | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [calendarStatus, setCalendarStatus] = useState<CalendarStatus | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('All');

  // Initialize mock data
  useEffect(() => {
    setLeads(generateMockLeads(12));
    setMetrics(generateMockRecoveryMetrics());
    setCalendarStatus(generateMockCalendarStatus());
  }, []);

  const handleLeadClick = (lead: Lead) => {
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
      lead.phoneNumber?.includes(searchTerm) || false;
    const matchesFilter =
      filterState === 'All' || lead.conversationState === filterState;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <Dashboard />

      {/* Conversation Mirror Modal */}
      <AIConversationMirror
        isOpen={showConversation}
        onClose={() => setShowConversation(false)}
        lead={selectedLead}
        conversation={conversation}
      />
    </motion.div>
  );
};

export default DashboardLayout;
