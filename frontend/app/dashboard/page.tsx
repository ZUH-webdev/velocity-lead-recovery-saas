'use client';

import { CalendarCheck, PhoneMissed, TrendingUp, Users } from 'lucide-react';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import LeadsTable from '../../components/dashboard/LeadsTable';
import StatCard from '../../components/dashboard/StatCard';
import {
  activityFeed,
  formatCurrency,
  leads,
  overviewStats,
} from '../../lib/mock-data';

export default function DashboardOverviewPage() {
  const recentLeads = leads.slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Leads"
          value={String(overviewStats.totalLeads)}
          change={overviewStats.totalLeadsChange}
          icon={Users}
        />
        <StatCard
          label="Appointments Today"
          value={String(overviewStats.appointmentsToday)}
          change={overviewStats.appointmentsTodayChange}
          icon={CalendarCheck}
        />
        <StatCard
          label="Missed Calls Recovered"
          value={String(overviewStats.missedCallsRecovered)}
          change={overviewStats.missedCallsRecoveredChange}
          icon={PhoneMissed}
        />
        <StatCard
          label="Revenue at Risk Recovered"
          value={formatCurrency(overviewStats.revenueRecovered)}
          change={overviewStats.revenueRecoveredChange}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
          <h3 className="text-xs uppercase tracking-widest text-[#888888]">Recent Leads</h3>
          <div className="mt-4">
            <LeadsTable leads={recentLeads} />
          </div>
        </div>
        <ActivityFeed items={activityFeed.slice(0, 8)} />
      </div>
    </div>
  );
}
