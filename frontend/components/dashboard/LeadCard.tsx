import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Phone,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import type { Lead } from '../../types';

interface Props {
  lead: Lead;
  onClick?: () => void;
  isSelected?: boolean;
}

const LeadCard = ({ lead, onClick, isSelected = false }: Props) => {
  const getLeadScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getLeadScoreBg = (score) => {
    if (score >= 80) return 'bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'bg-blue-50 border-blue-200';
    if (score >= 40) return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  const getStateColor = (state) => {
    const states = {
      Greeting: 'bg-blue-50 text-blue-700 border-blue-200',
      Qualification: 'bg-purple-50 text-purple-700 border-purple-200',
      Booking: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      Confirmed: 'bg-teal-50 text-teal-700 border-teal-200',
    };
    return states[state] || states.Greeting;
  };

  const getStateIcon = (state) => {
    const icons = {
      Greeting: <MessageCircle className="w-4 h-4" />,
      Qualification: <AlertCircle className="w-4 h-4" />,
      Booking: <Phone className="w-4 h-4" />,
      Confirmed: <CheckCircle className="w-4 h-4" />,
    };
    return icons[state] || icons.Greeting;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={onClick}
      className={clsx(
        'relative p-6 rounded-2xl border cursor-pointer lead-card-elite group',
        isSelected && 'ring-2 ring-indigo-500 shadow-elite-glow border-indigo-400'
      )}
    >
      {/* Subtle hover gradient overlay */}
      <div
        className={clsx(
          'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100',
          'bg-gradient-to-br from-violet-500/10 via-transparent to-emerald-500/8 transition-opacity duration-300',
          'pointer-events-none'
        )}
      />

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Header: Name and Lead Score */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-base mb-1 truncate">{lead.name}</h3>
            <p className="text-slate-500 text-xs font-mono">{lead.phone}</p>
          </div>

          {/* Lead Score Badge - Premium Style */}
          <motion.div
            className={clsx(
              'flex-shrink-0 px-3 py-2 rounded-xl border flex items-center gap-1.5 backdrop-blur-md',
              'font-bold text-sm',
              getLeadScoreBg(lead.score),
              getLeadScoreColor(lead.score)
            )}
            whileHover={{ scale: 1.1, rotate: 2 }}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-lg">{lead.score}</span>
          </motion.div>
        </div>

        {/* Status Pill - Soft Pastel Style */}
        <div className="flex items-center gap-2 flex-wrap">
          <motion.div
            className={clsx(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md',
              getStateColor(lead.state)
            )}
            whileHover={{ scale: 1.05 }}
          >
            {getStateIcon(lead.state)}
            <span>{lead.state}</span>
          </motion.div>

          {lead.source && (
            <span className="px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200">
              {lead.source}
            </span>
          )}
        </div>

        {/* Footer: Last interaction and action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
          <div className="text-xs text-slate-500">
            {lead.lastInteraction
              ? new Date(lead.lastInteraction).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Just now'}
          </div>

          <div className="flex items-center gap-2">
            {lead.appointmentScheduled && (
              <motion.div
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle className="w-3 h-3" />
                Scheduled
              </motion.div>
            )}
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadCard;
