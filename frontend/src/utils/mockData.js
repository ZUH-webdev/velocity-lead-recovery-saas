// Mock data generator for development
export const generateMockLeads = (count = 12) => {
  const conversationStates = ['Greeting', 'Qualification', 'Booking', 'Confirmed'];
  const firstNames = ['Sarah', 'John', 'Emma', 'Michael', 'Jessica', 'David', 'Lisa', 'Robert', 'Jennifer', 'James', 'Mary', 'William'];

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = `Patient ${Math.floor(i / firstNames.length) + 1}`;
    
    return {
      id: `lead-${i + 1}`,
      name: `${firstName} ${lastName}`,
      phone: `(${Math.floor(Math.random() * 900 + 100)}) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      score: Math.floor(Math.random() * 100),
      state: conversationStates[Math.floor(Math.random() * conversationStates.length)],
      pattern: ['High Intent', 'Medium Intent', 'Follow-up', 'Cancelled'][Math.floor(Math.random() * 4)],
      lastInteraction: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      appointmentScheduled: Math.random() > 0.5,
      source: Math.random() > 0.5 ? 'Missed Call' : 'Web Form',
    };
  });
};

export const generateMockRecoveryMetrics = () => ({
  revenueRecovered: 125680,
  revenueTrend: 12,
  recoveryRate: 73.2,
  rateTrend: 5,
  aiHandled: 1089,
  aiTrend: 8,
  totalMissedCalls: 1247,
  leadsQualified: 893,
  appointmentsBooked: 456,
  weeklyConversionRate: 73.2,
  averageLeadScore: 68,
  funnelData: [
    { stage: 'Missed Calls', value: 1247, fill: '#8b5cf6' },
    { stage: 'AI Engaged', value: 1089, fill: '#f97316' },
    { stage: 'Qualified', value: 893, fill: '#0ea5e9' },
    { stage: 'Booked', value: 456, fill: '#06b6d4' },
  ],
});

export const generateMockActivities = (count = 5) => {
  const types = ['message', 'call', 'booking', 'alert', 'scheduling'];
  const titles = [
    'New SMS conversation started',
    'Lead qualified automatically',
    'Appointment booked successfully',
    'Manual intervention required',
    'Calendar sync completed',
    'High-priority lead detected',
    'Follow-up scheduled',
    'Email reminder sent',
  ];

  const descriptions = [
    'Sarah Johnson responded to AI inquiry',
    'Lead score improved to 85%',
    'Appointment confirmed for Monday 2 PM',
    'Lead requires manual follow-up',
    'Synced 12 new appointments from Google Calendar',
    'Potential high-value lead in queue',
    'Automated follow-up scheduled for tomorrow',
    'Reminder email sent to lead',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `activity-${i + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    title: titles[Math.floor(Math.random() * titles.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    timestamp: new Date(Date.now() - (i * 600000)).toISOString(),
    metadata: `Lead #${Math.floor(Math.random() * 100) + 1}`,
  }));
};

export const generateMockConversation = () => [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'Hi! I noticed you missed your appointment with us. Would you like to reschedule?',
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'msg-2',
    sender: 'lead',
    text: 'Oh yes! I had an emergency that day. Can I book for next week?',
    timestamp: new Date(Date.now() - 240000).toISOString(),
  },
  {
    id: 'msg-3',
    sender: 'ai',
    text: 'Absolutely! We have availability Monday 2 PM or Tuesday 10 AM. Which works best?',
    timestamp: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: 'msg-4',
    sender: 'lead',
    text: 'Monday at 2 PM looks great. Let\'s do that!',
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: 'msg-5',
    sender: 'ai',
    text: 'Perfect! I\'ve confirmed your appointment for Monday at 2 PM. See you then!',
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
];

export const generateMockCalendarStatus = () => ({
  isConnected: true,
  lastSync: new Date(Date.now() - 300000).toISOString(),
  timezone: 'America/Denver',
  businessName: 'Mountain Peak Clinic',
  upcomingAppointments: 23,
  syncStatus: 'healthy',
});

export const generateMockEvents = (count = 8) => {
  const eventTypes = ['Checkup', 'Cleaning', 'Consultation', 'Follow-up', 'Root Canal', 'Crown'];
  const today = new Date();

  return Array.from({ length: count }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + Math.floor(i / 2));
    date.setHours(9 + (i % 2) * 2, 0, 0, 0);

    return {
      id: `event-${i + 1}`,
      title: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      startTime: date.toISOString(),
      endTime: new Date(date.getTime() + 3600000).toISOString(),
      patientName: `Patient ${i + 1}`,
      patientPhone: `(${Math.floor(Math.random() * 900 + 100)}) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      location: 'Main Office',
      description: 'Regular appointment',
      status: 'confirmed',
    };
  });
};
