import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, BarChart3, Filter, ChevronDown, Search } from 'lucide-react';
import { useMetrics } from '../hooks/useLeads';
import { KPIGrid } from './KPICard';
import { ActivityPulseFeed } from './ActivityPulseFeed';
import RecoveryFunnel from './RecoveryFunnel';
import CalendarSyncStatus from './CalendarSyncStatus';
import LeadCard from './LeadCard';
import { LivePulse } from './LiveIndicators';
import { generateMockRecoveryMetrics, generateMockActivities, generateMockLeads } from '../utils/mockData';

const Dashboard = ({ onNavigate = () => {} }) => {
  const { metrics, loading: metricsLoading } = useMetrics();
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [calendarStatus, setCalendarStatus] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('All');

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

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10 pt-4"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
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
          className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium flex items-center gap-2 shadow-sm hover:shadow-md hover:shadow-indigo-500/20 transition-all"
        >
          <Download className="w-4 h-4" />
          Export Report
        </motion.button>
      </motion.div>

      {/* KPI Grid */}
      <motion.section variants={itemVariants}>
        <KPIGrid
          metrics={metrics || generateMockRecoveryMetrics()}
          isLoading={metricsLoading}
        />
      </motion.section>

      {/* Recovery Funnel Section */}
      <motion.section variants={itemVariants}>
        <RecoveryFunnel metrics={metrics || generateMockRecoveryMetrics()} />
      </motion.section>

      {/* Two Column Layout: Leads + Activity Feed */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Live Leads Feed (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section Header */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-indigo-500" />
                  Live Leads
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
                className="px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-medium text-sm flex items-center gap-2 border border-slate-200 transition-colors shadow-sm"
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
                  className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10"
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
          <motion.div whileHover={{ scale: 1.01 }} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-sm"
            />
          </motion.div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    onClick={() => setSelectedLead(lead)}
                    isSelected={selectedLead?.id === lead.id}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="col-span-full text-center py-12"
              >
                <p className="text-slate-500">No leads found. Waiting for your first missed call to recover...</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Activity Feed + Calendar (1 column) */}
        <div className="space-y-6">
          {/* Activity Feed Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-elite rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>Activity Pulse</span>
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
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
          >
            <CalendarSyncStatus status={calendarStatus} />
          </motion.div>
        </div>
      </motion.section>
    </motion.main>
  );
};

export default Dashboard;
