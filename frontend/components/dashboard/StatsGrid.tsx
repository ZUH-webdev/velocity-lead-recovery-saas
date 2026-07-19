import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import AdvancedStatCard from './AdvancedStatCard';
import {
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  Phone,
  Calendar,
  Activity,
  Brain,
} from 'lucide-react';
import type { RecoveryMetrics } from '../../types';

interface Props {
  metrics?: Partial<RecoveryMetrics>;
  isLoading?: boolean;
}

const StatsGrid = ({ metrics = {}, isLoading = false }: Props) => {
  // Default metrics structure
  const defaultMetrics = {
    revenueRecovered: 125680,
    recoveryRate: 73.2,
    leadsRecovered: 1240,
    activeConversations: 48,
    appointmentsBooked: 342,
    conversionRate: 68.5,
    aiHandled: 892,
    systemUptime: 99.8,
  };

  const displayMetrics = useMemo(() => ({ ...defaultMetrics, ...metrics }), [metrics]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const stats = [
    {
      icon: DollarSign,
      label: 'Revenue Recovered',
      value: displayMetrics.revenueRecovered,
      prefix: '$',
      suffix: '',
      color: 'indigo',
      animateValue: true,
      endValue: 125680,
    },
    {
      icon: TrendingUp,
      label: 'Recovery Rate',
      value: displayMetrics.recoveryRate,
      prefix: '',
      suffix: '%',
      color: 'purple',
      animateValue: true,
      endValue: 73.2,
    },
    {
      icon: Users,
      label: 'Leads Recovered',
      value: displayMetrics.leadsRecovered,
      prefix: '',
      suffix: '',
      color: 'emerald',
      animateValue: true,
      endValue: 1240,
    },
    {
      icon: Phone,
      label: 'Active Conversations',
      value: displayMetrics.activeConversations,
      prefix: '',
      suffix: '',
      color: 'amber',
      animateValue: true,
      endValue: 48,
    },
    {
      icon: Calendar,
      label: 'Appointments Booked',
      value: displayMetrics.appointmentsBooked,
      prefix: '',
      suffix: '',
      color: 'indigo',
      animateValue: true,
      endValue: 342,
    },
    {
      icon: Activity,
      label: 'Conversion Rate',
      value: displayMetrics.conversionRate,
      prefix: '',
      suffix: '%',
      color: 'purple',
      animateValue: true,
      endValue: 68.5,
    },
    {
      icon: Brain,
      label: 'AI Handled',
      value: displayMetrics.aiHandled,
      prefix: '',
      suffix: 'msgs',
      color: 'emerald',
      animateValue: true,
      endValue: 892,
    },
    {
      icon: Zap,
      label: 'System Uptime',
      value: displayMetrics.systemUptime,
      prefix: '',
      suffix: '%',
      color: 'amber',
      animateValue: true,
      endValue: 99.8,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <AdvancedStatCard
            key={`stat-${index}`}
            icon={stat.icon}
            label={stat.label}
            value={String(stat.value)}
            prefix={stat.prefix}
            suffix={stat.suffix}
            color={stat.color as 'indigo' | 'purple' | 'emerald' | 'amber' | 'blue'}
            isLoading={isLoading}
            animateValue={stat.animateValue}
            endValue={stat.endValue}
            index={index}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default StatsGrid;
