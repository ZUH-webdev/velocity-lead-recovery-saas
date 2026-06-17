export type LeadStatus = 'Qualified' | 'Contacted' | 'Booked' | 'Lost';
export type LeadSource = 'Missed Call' | 'Web Form' | 'Manual';
export type AppointmentStatus = 'Scheduled' | 'Confirmed' | 'Cancelled' | 'Completed';
export type ActivityType =
  | 'lead_recovered'
  | 'appointment_booked'
  | 'call_missed'
  | 'sms_sent'
  | 'lead_qualified';

export interface ConversationMessage {
  direction: 'inbound' | 'outbound';
  message: string;
  timestamp: string;
}

export interface ScoreBreakdown {
  factor: string;
  score: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  business: string;
  status: LeadStatus;
  leadScore: number;
  source: LeadSource;
  lastContact: string;
  createdAt: string;
  conversation: ConversationMessage[];
  scoreBreakdown: ScoreBreakdown[];
  appointmentId?: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  business: string;
  date: string;
  status: AppointmentStatus;
  reminderSent: boolean;
  leadId?: string;
}

export interface ActivityFeedItem {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
}

export interface DailyAnalytics {
  date: string;
  leads: number;
  appointments: number;
  conversionRate: number;
}

export interface AnalyticsData {
  daily: DailyAnalytics[];
  sources: { name: string; value: number }[];
  scoreDistribution: { bucket: string; count: number }[];
}

const businesses = [
  'Dr. Smith Dental',
  'Radiant Med Spa',
  'Bright Smile Orthodontics',
  'Luxe Aesthetics',
  'Harbor View Dental',
];

const firstNames = [
  'Emily', 'Michael', 'Sarah', 'James', 'Jessica', 'David', 'Ashley', 'Robert',
  'Amanda', 'Christopher', 'Jennifer', 'Daniel', 'Lauren', 'Matthew', 'Nicole',
  'Andrew', 'Stephanie', 'Ryan', 'Melissa', 'Brandon',
];

const lastNames = [
  'Chen', 'Rodriguez', 'Williams', 'Patel', 'Johnson', 'Martinez', 'Thompson',
  'Anderson', 'Garcia', 'Lee', 'Brown', 'Davis', 'Wilson', 'Taylor', 'Moore',
  'Jackson', 'White', 'Harris', 'Clark', 'Lewis',
];

const statuses: LeadStatus[] = ['Qualified', 'Contacted', 'Booked', 'Lost'];
const sources: LeadSource[] = ['Missed Call', 'Web Form', 'Manual'];

function daysAgo(days: number, hour = 10, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function formatPhone(i: number): string {
  const area = 200 + (i % 800);
  const mid = 100 + ((i * 7) % 900);
  const last = 1000 + ((i * 13) % 9000);
  return `(${area}) ${mid}-${last}`;
}

function buildConversation(name: string, status: LeadStatus): ConversationMessage[] {
  const first = name.split(' ')[0];
  const msgs: ConversationMessage[] = [
    {
      direction: 'outbound',
      message: `Hi ${first}, this is Velocity following up on your missed call to our clinic. Would you like to schedule a consultation?`,
      timestamp: daysAgo(2, 14, 30),
    },
    {
      direction: 'inbound',
      message: 'Yes, I was trying to book a teeth whitening appointment.',
      timestamp: daysAgo(2, 14, 45),
    },
    {
      direction: 'outbound',
      message: 'Great! We have openings Thursday at 2 PM or Friday at 10 AM. Which works better?',
      timestamp: daysAgo(2, 14, 48),
    },
  ];

  if (status === 'Booked') {
    msgs.push({
      direction: 'inbound',
      message: 'Thursday at 2 PM works perfectly.',
      timestamp: daysAgo(2, 15, 2),
    });
    msgs.push({
      direction: 'outbound',
      message: "You're all set! We've sent a confirmation text. See you Thursday.",
      timestamp: daysAgo(2, 15, 5),
    });
  } else if (status === 'Qualified') {
    msgs.push({
      direction: 'inbound',
      message: "I'll check my schedule and get back to you tomorrow.",
      timestamp: daysAgo(1, 9, 15),
    });
  }

  return msgs;
}

function buildScoreBreakdown(score: number): ScoreBreakdown[] {
  const intent = Math.min(40, Math.round(score * 0.4));
  const engagement = Math.min(30, Math.round(score * 0.3));
  const timing = Math.min(20, Math.round(score * 0.15));
  const source = score - intent - engagement - timing;

  return [
    { factor: 'Intent signals', score: intent },
    { factor: 'Engagement', score: engagement },
    { factor: 'Response timing', score: timing },
    { factor: 'Source quality', score: Math.max(0, source) },
  ];
}

export const leads: Lead[] = Array.from({ length: 20 }, (_, i) => {
  const name = `${firstNames[i]} ${lastNames[i]}`;
  const status = statuses[i % statuses.length];
  const leadScore = 25 + ((i * 17) % 76);
  const business = businesses[i % businesses.length];
  const createdDays = 1 + (i % 28);

  return {
    id: `lead-${i + 1}`,
    name,
    phone: formatPhone(i),
    email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@email.com`,
    business,
    status,
    leadScore,
    source: sources[i % sources.length],
    lastContact: daysAgo(i % 7, 9 + (i % 8), (i * 5) % 60),
    createdAt: daysAgo(createdDays, 11, (i * 3) % 60),
    conversation: buildConversation(name, status),
    scoreBreakdown: buildScoreBreakdown(leadScore),
    appointmentId: status === 'Booked' ? `appt-${i + 1}` : undefined,
  };
});

export const appointments: Appointment[] = Array.from({ length: 15 }, (_, i) => {
  const lead = leads[i];
  const dayOffset = (i % 14) - 3;
  const hour = 8 + (i % 9);
  const apptStatuses: AppointmentStatus[] = ['Scheduled', 'Confirmed', 'Cancelled', 'Completed'];

  return {
    id: `appt-${i + 1}`,
    patientName: lead.name,
    business: lead.business,
    date: daysAgo(-dayOffset, hour, (i * 15) % 60),
    status: apptStatuses[i % apptStatuses.length],
    reminderSent: i % 3 !== 0,
    leadId: lead.id,
  };
});

export const activityFeed: ActivityFeedItem[] = [
  { id: 'act-1', type: 'lead_recovered', message: 'Lead recovered — Dr. Smith Dental', timestamp: daysAgo(0, 11, 58) },
  { id: 'act-2', type: 'appointment_booked', message: 'Appointment booked — Emily Chen (Teeth Whitening)', timestamp: daysAgo(0, 11, 42) },
  { id: 'act-3', type: 'call_missed', message: 'Missed call captured — Radiant Med Spa', timestamp: daysAgo(0, 10, 15) },
  { id: 'act-4', type: 'sms_sent', message: 'Follow-up SMS sent — Michael Rodriguez', timestamp: daysAgo(0, 9, 30) },
  { id: 'act-5', type: 'lead_qualified', message: 'Lead qualified — Sarah Williams (Score: 87)', timestamp: daysAgo(0, 8, 45) },
  { id: 'act-6', type: 'lead_recovered', message: 'Lead recovered — Bright Smile Orthodontics', timestamp: daysAgo(1, 16, 20) },
  { id: 'act-7', type: 'appointment_booked', message: 'Appointment booked — James Patel (Invisalign consult)', timestamp: daysAgo(1, 14, 10) },
  { id: 'act-8', type: 'sms_sent', message: 'Reminder SMS sent — Jessica Johnson', timestamp: daysAgo(1, 11, 0) },
  { id: 'act-9', type: 'call_missed', message: 'Missed call captured — Luxe Aesthetics', timestamp: daysAgo(2, 15, 30) },
  { id: 'act-10', type: 'lead_qualified', message: 'Lead qualified — David Martinez (Score: 72)', timestamp: daysAgo(2, 10, 5) },
];

function generateDailyAnalytics(): DailyAnalytics[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const leadsCount = 8 + Math.round(Math.sin(i / 3) * 4) + (i % 5);
    const appts = Math.max(2, Math.round(leadsCount * (0.35 + (i % 7) * 0.02)));

    return {
      date: d.toISOString().split('T')[0],
      leads: leadsCount,
      appointments: appts,
      conversionRate: Math.round((appts / leadsCount) * 1000) / 10,
    };
  });
}

export const analyticsData: AnalyticsData = {
  daily: generateDailyAnalytics(),
  sources: [
    { name: 'Missed Call', value: 142 },
    { name: 'Web Form', value: 68 },
    { name: 'Manual', value: 24 },
  ],
  scoreDistribution: [
    { bucket: '0-20', count: 12 },
    { bucket: '20-40', count: 28 },
    { bucket: '40-60', count: 45 },
    { bucket: '60-80', count: 62 },
    { bucket: '80-100', count: 37 },
  ],
};

export const overviewStats = {
  totalLeads: 184,
  totalLeadsChange: 12.4,
  appointmentsToday: 7,
  appointmentsTodayChange: 8.2,
  missedCallsRecovered: 34,
  missedCallsRecoveredChange: -3.1,
  revenueRecovered: 42850,
  revenueRecoveredChange: 15.7,
};

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export function getLeadById(id: string): Lead | undefined {
  return leads.find((l) => l.id === id);
}

export function getAppointmentByLeadId(leadId: string): Appointment | undefined {
  return appointments.find((a) => a.leadId === leadId);
}
