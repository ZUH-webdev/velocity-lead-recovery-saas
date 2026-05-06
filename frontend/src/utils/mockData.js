// Mock data generator for development
export const generateMockLeads = (count = 12) => {
  const conversationStates = ['Greeting', 'Qualification', 'Booking', 'Confirmed'];
  const patterns = ['High Intent', 'Medium Intent', 'Follow-up Needed', 'Cancelled'];

  return Array.from({ length: count }, (_, i) => ({
    id: `lead-${i + 1}`,
    name: `Patient ${i + 1}`,
    phoneNumber: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    leadScore: Math.floor(Math.random() * 100),
    conversationState: conversationStates[Math.floor(Math.random() * conversationStates.length)],
    pattern: patterns[Math.floor(Math.random() * patterns.length)],
    lastInteraction: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    appointmentScheduled: Math.random() > 0.5,
    source: Math.random() > 0.5 ? 'Missed Call' : 'Web Form',
  }));
};

export const generateMockRecoveryMetrics = () => ({
  totalMissedCalls: 1247,
  leadsQualified: 893,
  appointmentsBooked: 456,
  totalRecoveryValue: '$125,680',
  weeklyConversionRate: 73.2,
  averageLeadScore: 68,
  funnelData: [
    { stage: 'Missed Calls', value: 1247, fill: '#6b7280' },
    { stage: 'AI Engaged', value: 1089, fill: '#8b5cf6' },
    { stage: 'Qualified', value: 893, fill: '#6366f1' },
    { stage: 'Booked', value: 456, fill: '#10b981' },
  ],
});

export const generateMockConversation = () => [
  {
    id: 'msg-1',
    sender: 'Velocity',
    message: 'Hi! I noticed you missed your appointment with us. Would you like to reschedule?',
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'msg-2',
    sender: 'Patient',
    message: 'Oh yes! I had an emergency that day. Can I book for next week?',
    timestamp: new Date(Date.now() - 240000).toISOString(),
  },
  {
    id: 'msg-3',
    sender: 'Velocity',
    message: 'Absolutely! We have availability Monday 2 PM or Tuesday 10 AM. Which works best?',
    timestamp: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: 'msg-4',
    sender: 'Patient',
    message: 'Monday at 2 PM looks great. Let\'s do that!',
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: 'msg-5',
    sender: 'Velocity',
    message: 'Perfect! I\'ve confirmed your appointment for Monday at 2 PM. See you then!',
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
];

export const generateMockCalendarStatus = () => ({
  isConnected: true,
  lastSync: new Date(Date.now() - 300000).toISOString(),
  timezone: 'America/Los_Angeles',
  businessName: 'Elite Dental Spa',
  upcomingAppointments: 23,
  syncStatus: 'healthy',
});
