"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, BarChart3, Filter, ChevronDown, Search } from 'lucide-react';
import { useMetrics } from '../hooks/useLeads';
import StatsGrid from './StatsGrid';
import PremiumFunnelChart from './PremiumFunnelChart';
import { ActivityPulseFeed } from './ActivityPulseFeed';
import CalendarSyncStatus from './CalendarSyncStatus';
import LeadCard from './LeadCard';
import { LivePulse } from './LiveIndicators';
import { generateMockRecoveryMetrics, generateMockActivities, generateMockLeads } from '../utils/mockData';

const Dashboard = ({ onNavigate = () => {}, searchTerm: externalSearchTerm, onSearchChange }) => {
  const { metrics, loading: metricsLoading } = useMetrics();
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [calendarStatus, setCalendarStatus] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterState, setFilterState] = useState('All');

  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : localSearchTerm;
  const updateSearchTerm = onSearchChange || setLocalSearchTerm;

  const conversationStates = ['All', 'Greeting', 'Qualification', 'Booking', 'Confirmed'];

  // Initialize mock data
  useEffect(() => {
    setActivityLoading(true);
    setTimeout(() => {
      const mockActivities = generateMockActivities(5);
      const mockLeads = generateMockLeads(6);
      setActivities(mockActivities);
      setLeads(mockLeads);
      setActivityLoading(false);
    }, 500);
  }, []);

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

  const filteredLeads = leads.filter((lead) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(searchValue) ||
      lead.phone.toLowerCase().includes(searchValue) ||
      lead.state.toLowerCase().includes(searchValue) ||
      lead.source.toLowerCase().includes(searchValue)
    );
  });

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-8 pb-10 pt-4"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 flex items-center gap-2 md:gap-3 tracking-tight">
            <TrendingUp className="w-6 md:w-9 h-6 md:h-9 text-indigo-500 flex-shrink-0" />
            Recovery Dashboard
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-2">
            Real-time lead recovery and appointment booking intelligence
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2.5 rounded-xl bg-white/65 hover:bg-white/80 backdrop-blur-md border border-white/50 text-slate-800 font-semibold flex items-center gap-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)] transition-all whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          Export Report
        </motion.button>
      </motion.div>

      {/* KPI Grid - Elite Stats */}
      <motion.section variants={itemVariants}>
        <StatsGrid
          metrics={metrics || generateMockRecoveryMetrics()}
          isLoading={metricsLoading}
        />
      </motion.section>

      {/* Recovery Funnel Section - Premium Design */}
      <motion.section variants={itemVariants}>
        <PremiumFunnelChart metrics={metrics || generateMockRecoveryMetrics()} />
      </motion.section>

      {/* Two Column Layout: Leads + Activity Feed */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-4 md:gap-8">
        {/* Left: Live Leads Feed (2 columns) */}
        <div className="min-w-0 space-y-3 md:space-y-6">
          {/* Section Header */}
          <div className="flex items-start md:items-end justify-between gap-2 md:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2 flex-wrap">
                <h2 className="text-lg md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 md:w-6 h-5 md:h-6 text-indigo-500 flex-shrink-0" />
                  <span className="truncate">Live Leads</span>
                </h2>
                <LivePulse />
              </div>
              <p className="text-xs md:text-sm text-slate-500 truncate">
                {leads.length} active leads • Real-time AI engagement
              </p>
            </div>

            {/* Filter Dropdown - Hide on mobile */}
            <div className="relative hidden sm:block flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 rounded-lg bg-white/60 hover:bg-white/80 backdrop-blur-md text-slate-800 font-semibold text-xs md:text-sm flex items-center gap-2 border border-white/50 transition-colors shadow-[0_10px_24px_rgba(15,23,42,0.06)] whitespace-nowrap"
              >
                <Filter className="w-4 h-4" />
                {filterState}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                />
              </motion.button>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-white/50 bg-white/75 backdrop-blur-md shadow-[0_16px_40px_rgba(15,23,42,0.12)] z-10 overflow-hidden"
                >
                  {conversationStates.map((state) => (
                    <motion.button
                      key={state}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        setFilterState(state);
                        setShowFilters(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                        filterState === state
                          ? 'bg-violet-500/10 text-violet-700'
                          : 'text-slate-700 hover:bg-white/70'
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
          <motion.div whileHover={{ scale: 1.01 }} className="relative">
            <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, phone..."
              value={searchTerm}
              onChange={(e) => updateSearchTerm(e.target.value)}
              className="w-full pl-9 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white/65 backdrop-blur-md border border-white/50 text-slate-900 placeholder-slate-400 text-sm md:text-base focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 transition-all shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
            />
          </motion.div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {filteredLeads.length > 0 ? (
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
                  <LeadCard
                    lead={lead}
                    onClick={() => setSelectedLead(lead)}
                    isSelected={selectedLead?.id === lead.id}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="col-span-full text-center py-8 md:py-12"
              >
                <p className="text-slate-500 text-sm md:text-base">No leads found. Waiting for your first missed call to recover...</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Activity Feed + Calendar (1 column) */}
        <div className="min-w-0 space-y-3 md:space-y-6">
          {/* Activity Feed Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-elite rounded-lg md:rounded-2xl p-4 md:p-6"
          >
            <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 md:mb-4 flex items-center gap-2">
              <span>Activity Pulse</span>
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse flex-shrink-0" />
            </h3>
            <ActivityPulseFeed
              activities={activities}
              isLoading={activityLoading}
              maxItems={5}
            />
          </motion.div>

          {/* Calendar Sync Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full"
          >
            <CalendarSyncStatus status={calendarStatus} />
          </motion.div>
        </div>
      </motion.section>
    </motion.main>
  );
};

export default Dashboard;
