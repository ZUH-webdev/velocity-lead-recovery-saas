import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  TrendingUp,
  Download,
  BarChart3,
} from 'lucide-react';
import LeadCard from './LeadCard';
import RecoveryFunnel from './RecoveryFunnel';
import CalendarSyncStatus from './CalendarSyncStatus';
import { LivePulse } from './LiveIndicators';

const Dashboard = ({
  metrics = null,
  leads = [],
  selectedLead = null,
  onLeadClick = () => {},
  calendarStatus = null,
  onSync = () => {},
  searchTerm = '',
  onSearchChange = () => {},
  filterState = 'All',
  onFilterChange = () => {},
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
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

  const conversationStates = ['All', 'Greeting', 'Qualification', 'Booking', 'Confirmed'];

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="whitespace-elite pb-20"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
            <TrendingUp className="w-9 h-9 text-indigo-500" />
            Recovery Dashboard
          </h1>
          <p className="text-slate-500 mt-2">
            Real-time lead recovery and appointment booking intelligence
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium flex items-center gap-2 shadow-sm hover:shadow-md hover:shadow-indigo-500/20"
        >
          <Download className="w-4 h-4" />
          Export Report
        </motion.button>
      </motion.div>

      {/* Recovery Funnel Section */}
      {metrics && (
        <motion.section variants={itemVariants}>
          <RecoveryFunnel metrics={metrics} />
        </motion.section>
      )}

      {/* Live Lead Feed */}
      <motion.section variants={itemVariants} className="space-y-6">
        {/* Section Header with Search & Filters */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <BarChart3 className="w-7 h-7 text-indigo-500" />
                Live Lead Feed
              </h2>
              <LivePulse />
            </div>
            <p className="text-slate-500 text-sm">
              {leads.length} active leads • Real-time AI engagement
            </p>
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-medium text-sm flex items-center gap-2 border border-slate-200 transition-colors shadow-elite-sm"
            >
              <Filter className="w-4 h-4" />
              Filter: {filterState}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </motion.button>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10"
              >
                {conversationStates.map((state) => (
                  <motion.button
                    key={state}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      onFilterChange(state);
                      setShowFilters(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                      filterState === state
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {state}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-sm"
          />
        </motion.div>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.length > 0 ? (
            leads.map((lead, idx) => (
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
                <LeadCard
                  lead={lead}
                  onClick={() => onLeadClick(lead)}
                  isSelected={selectedLead?.id === lead.id}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={itemVariants}
              className="col-span-full text-center py-12"
            >
              <p className="text-slate-500">No leads found. Try adjusting your filters.</p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Calendar Sync & Right Sidebar */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Sync (takes up 1 column on large screens) */}
        <div className="lg:col-span-1">
          {calendarStatus && (
            <CalendarSyncStatus
              status={calendarStatus}
              onSync={onSync}
              onSettings={() => {}}
            />
          )}
        </div>

        {/* Additional Stats */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 p-6 rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-800/50"
        >
          <h3 className="text-lg font-semibold text-slate-50 mb-6">Quick Stats</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: 'Today\'s Conversions',
                value: '24',
                change: '+12%',
                positive: true,
              },
              {
                label: 'Avg Response Time',
                value: '45s',
                change: '-8%',
                positive: true,
              },
              {
                label: 'Escalations',
                value: '3',
                change: '-5%',
                positive: true,
              },
              {
                label: 'System Uptime',
                value: '99.97%',
                change: 'Optimal',
                positive: true,
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-slate-50">{stat.value}</span>
                  <span
                    className={`text-sm font-medium ${
                      stat.positive ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Insight */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="mt-4 p-4 rounded-lg bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-800/30"
          >
            <p className="text-slate-300 text-sm">
              <span className="font-semibold">💡 Pro Tip:</span> Your AI engagement rate is
              23% higher than industry average. Keep using targeted follow-ups during peak hours.
            </p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Bottom spacing for scrolling */}
      <div className="h-12" />
    </motion.main>
  );
};

export default Dashboard;
