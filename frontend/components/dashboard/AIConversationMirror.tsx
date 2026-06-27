import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  AlertCircle,
  TrendingUp,
  Clock,
  Phone,
  Maximize2,
} from 'lucide-react';
import type { ConversationMessage, Lead } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  conversation?: ConversationMessage[];
}

const AIConversationMirror = ({ isOpen, onClose, lead, conversation = [] }: Props) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const panelVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Side Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">Live Conversation</h2>
                <p className="text-sm text-slate-500 mt-1">{lead?.name || 'No lead selected'}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </motion.button>
            </div>

            {/* Lead Info */}
            {lead && (
              <div className="p-4 space-y-3 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Lead Score</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-indigo-600">{lead.leadScore}/100</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">State</span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-50 text-indigo-700">
                    {lead.conversationState}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Phone</span>
                  <span className="font-mono text-slate-700 text-xs">{lead.phoneNumber}</span>
                </div>
              </div>
            )}

            {/* Conversation Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversation.length > 0 ? (
                conversation.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'Patient' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === 'Patient'
                          ? 'bg-indigo-50 text-indigo-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <p className="text-sm">{msg.message || msg.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <p className="text-center">No conversation yet</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-slate-200 p-4 space-y-3 bg-slate-50">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                Escalate to Human
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </motion.button>

              {lead?.appointmentScheduled && (
                <div className="px-3 py-2 rounded-lg bg-teal-50 border border-teal-200 flex items-center gap-2 text-teal-700 text-xs">
                  <Clock className="w-4 h-4" />
                  Appointment confirmed
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIConversationMirror;
