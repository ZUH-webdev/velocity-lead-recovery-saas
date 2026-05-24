import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
  Book,
  FileText,
  Clock,
  CheckCircle,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const HelpPage = ({ onNavigate }: Props) => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I add a new lead?',
      answer:
        'Navigate to the Live Leads section and click "Add New Lead". Fill in the lead details including name, contact information, and appointment status. You can also import leads via CSV file.',
    },
    {
      id: 2,
      question: 'How do I sync my Google Calendar?',
      answer:
        'Go to Settings > Integrations > Google Calendar and click "Connect". You\'ll be prompted to authorize Velocity to access your calendar. Once connected, all appointments will sync automatically.',
    },
    {
      id: 3,
      question: 'Can I set up automated SMS reminders?',
      answer:
        'Yes! In Settings > SMS Integration, enable automated reminders and set the frequency. You can customize reminder templates for different appointment types.',
    },
    {
      id: 4,
      question: 'How do I generate recovery reports?',
      answer:
        'Visit the Dashboard to see real-time recovery metrics. Use the Recovery Funnel chart to analyze lead stages. Download full reports from Settings > Reports.',
    },
    {
      id: 5,
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards, bank transfers, and PayPal. Annual subscriptions include a 20% discount. Contact our sales team for custom pricing.',
    },
    {
      id: 6,
      question: 'How do I reset my password?',
      answer:
        'Click "Forgot Password" on the login page. Enter your email address and check your inbox for a reset link. The link expires in 24 hours.',
    },
  ];

  const resources = [
    {
      id: 1,
      title: 'Getting Started Guide',
      description: 'Learn the basics of Velocity in 10 minutes',
      icon: Book,
      link: '#',
    },
    {
      id: 2,
      title: 'API Documentation',
      description: 'Integrate Velocity with your existing systems',
      icon: FileText,
      link: '#',
    },
    {
      id: 3,
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides for common tasks',
      icon: Clock,
      link: '#',
    },
    {
      id: 4,
      title: 'Best Practices',
      description: 'Tips to maximize your lead recovery rates',
      icon: CheckCircle,
      link: '#',
    },
  ];

  const supportChannels = [
    {
      id: 1,
      title: 'Email Support',
      description: 'support@velocity.com',
      detail: 'Response within 24 hours',
      icon: Mail,
    },
    {
      id: 2,
      title: 'Phone Support',
      description: '+1 (555) 123-4567',
      detail: 'Monday - Friday, 9 AM - 5 PM EST',
      icon: Phone,
    },
    {
      id: 3,
      title: 'Live Chat',
      description: 'Available in Settings',
      detail: 'Average response time: 5 minutes',
      icon: MessageSquare,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="w-8 h-8" style={{ color: 'var(--neu-text-dark)' }} />
          <h1 className="text-3xl font-bold" style={{ color: 'var(--neu-text-dark)' }}>
            Help & Support
          </h1>
        </div>
        <p style={{ color: 'var(--neu-text-light)' }}>
          Get answers to common questions and find the support you need.
        </p>
      </motion.div>

      {/* Support Channels */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--neu-text-dark)' }}>
          Contact Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <motion.div
                key={channel.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl border p-6"
                style={{
                  background: 'var(--neu-bg)',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  boxShadow: 'inset 6px 6px 12px var(--neu-dark), inset -6px -6px 12px var(--neu-light)',
                }}
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#6366f1' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--neu-text-dark)' }}>
                      {channel.title}
                    </h3>
                    <p className="text-sm font-mono mt-1" style={{ color: '#6366f1' }}>
                      {channel.description}
                    </p>
                    <p className="text-xs mt-2" style={{ color: 'var(--neu-text-light)' }}>
                      {channel.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--neu-text-dark)' }}>
          Learning Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <motion.a
                key={resource.id}
                href={resource.link}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border p-6 cursor-pointer transition-all group"
                style={{
                  background: 'var(--neu-bg)',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  boxShadow: 'inset 6px 6px 12px var(--neu-dark), inset -6px -6px 12px var(--neu-light)',
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5" style={{ color: '#6366f1' }} />
                      <h3 className="font-semibold" style={{ color: 'var(--neu-text-dark)' }}>
                        {resource.title}
                      </h3>
                    </div>
                    <p className="text-sm mt-2" style={{ color: 'var(--neu-text-light)' }}>
                      {resource.description}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#6366f1' }} />
                </div>
              </motion.a>
            );
          })}
        </div>
      </motion.div>

      {/* FAQs */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--neu-text-dark)' }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border overflow-hidden transition-all"
              style={{
                background: 'var(--neu-bg)',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                boxShadow: expandedFaq === faq.id
                  ? 'inset 6px 6px 12px var(--neu-dark), inset -6px -6px 12px var(--neu-light)'
                  : 'inset 2px 2px 4px rgba(190, 195, 207, 0.1)',
              }}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors hover:bg-white/20"
              >
                <h3 className="font-semibold pr-4" style={{ color: 'var(--neu-text-dark)' }}>
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: expandedFaq === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: '#6366f1' }} />
                </motion.div>
              </button>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: expandedFaq === faq.id ? 'auto' : 0,
                  opacity: expandedFaq === faq.id ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className="px-6 pb-4 border-t"
                  style={{ borderTopColor: 'rgba(255, 255, 255, 0.3)' }}
                >
                  <p style={{ color: 'var(--neu-text-light)' }}>{faq.answer}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border p-8"
        style={{
          background: 'var(--neu-bg)',
          borderColor: 'rgba(255, 255, 255, 0.4)',
          boxShadow: '12px 12px 24px var(--neu-dark), -12px -12px 24px var(--neu-light)',
        }}
      >
        <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--neu-text-dark)' }}>
          Can't find what you're looking for?
        </h2>
        <p className="mb-4" style={{ color: 'var(--neu-text-light)' }}>
          Our support team is here to help. Reach out via email, phone, or live chat and we'll get back to you within 24 hours.
        </p>
        <button
          className="px-6 py-3 rounded-xl font-medium transition-all"
          style={{
            background: '#6366f1',
            color: '#ffffff',
            boxShadow: '6px 6px 12px rgba(99, 102, 241, 0.2)',
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.boxShadow = '8px 8px 16px rgba(99, 102, 241, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.boxShadow = '6px 6px 12px rgba(99, 102, 241, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Contact Support
        </button>
      </motion.div>
    </motion.div>
  );
};

export default HelpPage;
