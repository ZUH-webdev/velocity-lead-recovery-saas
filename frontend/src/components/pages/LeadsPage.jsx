import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  X,
} from 'lucide-react';
import { useLeads, useLeadDetail } from '../../hooks/useLeads';
import LeadCard from '../LeadCard';
import { generateMockLeads, generateMockConversation } from '../../utils/mockData';

export const LeadsPage = ({ onNavigate, searchTerm: externalSearchTerm, onSearchChange }) => {
  const { leads: apiLeads, loading: leadsLoading } = useLeads();
  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [filterState, setFilterState] = useState('all');
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : localSearchTerm;
  const updateSearchTerm = onSearchChange || setLocalSearchTerm;

  const { lead: selectedLead, conversation } = useLeadDetail(selectedLeadId);

  // Initialize with mock data if API fails
  useEffect(() => {
    if (apiLeads && apiLeads.length > 0) {
      setLeads(apiLeads);
    } else {
      setLeads(generateMockLeads(12));
    }
  }, [apiLeads]);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);

    const matchesFilter =
      filterState === 'all' ||
      lead.state?.toLowerCase() === filterState.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10 pt-4"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
          <Users className="w-9 h-9 text-indigo-500" />
          Live Lead Command Center
        </h1>
        <p className="text-slate-500 mt-2">
          Master-detail view of all active leads with real-time conversation
          history
        </p>
      </motion.div>

      {/* Two-Column Layout */}
      <motion.section
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left: Lead List (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => updateSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-sm"
            />

            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-sm"
            >
              <option value="all">All States</option>
              <option value="greeting">Greeting</option>
              <option value="qualification">Qualification</option>
              <option value="booking">Booking</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[700px] overflow-y-auto">
            {leadsLoading ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-slate-100 rounded-xl animate-pulse"
                />
              ))
            ) : filteredLeads.length > 0 ? (
              filteredLeads.map((lead, idx) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    delay: idx * 0.05,
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedLeadId === lead.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {lead.name}
                        </p>
                        <p className="text-xs text-slate-500">{lead.phone}</p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.score >= 80
                            ? 'bg-emerald-100 text-emerald-700'
                            : lead.score >= 50
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {lead.score}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>{lead.state}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-slate-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No leads found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Conversation Drawer (1 column) */}
        {selectedLeadId && selectedLead ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Lead Details Header */}
            <div className="card-elite rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedLead.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedLead.phone}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedLeadId(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </motion.button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Lead Score</span>
                  <span className="font-semibold text-slate-900">
                    {selectedLead.score}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedLead.score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                Manual Takeover
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium flex items-center justify-center gap-2 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                Call Lead
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as Booked
              </motion.button>
            </div>

            {/* Conversation Thread */}
            <div className="card-elite rounded-2xl p-6 flex-1">
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                Conversation
              </h4>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {conversation && conversation.length > 0 ? (
                  conversation.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex ${
                        msg.sender === 'ai' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          msg.sender === 'ai'
                            ? 'bg-slate-100 text-slate-900'
                            : 'bg-indigo-500 text-white'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 text-sm">
                    No messages yet
                  </p>
                )}
              </div>

              {/* Quick Reply Buttons */}
              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  placeholder="Quick reply..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:col-span-1 card-elite rounded-2xl p-12 flex flex-col items-center justify-center text-center"
          >
            <Users className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 mb-2">
              Select a lead to view conversation
            </p>
            <p className="text-xs text-slate-400">
              Click on any lead card to get started
            </p>
          </motion.div>
        )}
      </motion.section>
    </motion.div>
  );
};

export default LeadsPage;
