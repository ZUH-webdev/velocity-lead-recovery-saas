import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, PhoneCall, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const eventTypeConfig = {
  message: {
    icon: MessageCircle,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  call: {
    icon: PhoneCall,
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
  },
  booking: {
    icon: CheckCircle2,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  alert: {
    icon: AlertCircle,
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
  },
  scheduling: {
    icon: Clock,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
};

export const ActivityEvent = ({ event, index }) => {
  const config = eventTypeConfig[event.type] || eventTypeConfig.message;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 30 }}
      className="flex gap-4 group"
    >
      {/* Timeline Dot */}
      <div className="relative pt-1">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.08 + 0.1 }}
          className={`w-3 h-3 rounded-full ring-4 ring-white ${config.bgColor} border-2 ${config.borderColor}`}
        />
        {/* Connector Line */}
        {index < 4 && (
          <div className={`absolute top-6 left-1.5 w-0.5 h-8 ${config.bgColor} opacity-40`} />
        )}
      </div>

      {/* Event Content */}
      <motion.div
        className="flex-1 pb-4"
        whileHover={{ x: 4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor} transition-all group-hover:shadow-md`}>
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${config.textColor} flex-shrink-0`} />
              <p className={`text-sm font-semibold ${config.textColor}`}>
                {event.title}
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 ml-auto">
              {event.timestamp
                ? formatDistanceToNow(new Date(event.timestamp), {
                    addSuffix: true,
                  })
                : 'Recently'}
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-1">
            {event.description}
          </p>

          {event.metadata && (
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className={`px-2 py-1 rounded-full ${config.bgColor} ${config.textColor}`}>
                {event.metadata}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ActivityPulseFeed = ({
  activities = [],
  isLoading = false,
  maxItems = 5,
}) => {
  const displayActivities = activities.slice(0, maxItems);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.08,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-3 h-3 rounded-full bg-slate-200 flex-shrink-0 mt-1 animate-pulse" />
            <div className="flex-1">
              <div className="h-20 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-0"
    >
      {displayActivities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 text-slate-500"
        >
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activities yet</p>
        </motion.div>
      ) : (
        displayActivities.map((activity, index) => (
          <ActivityEvent
            key={`${activity.id}-${index}`}
            event={activity}
            index={index}
          />
        ))
      )}
    </motion.div>
  );
};
