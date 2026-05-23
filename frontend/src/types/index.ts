export type ConversationState = 'Greeting' | 'Qualification' | 'Booking' | 'Confirmed' | string;

export type ActivityType = 'message' | 'call' | 'booking' | 'alert' | 'scheduling' | string;

export type LeadSender = 'ai' | 'lead' | string;

export * from './auth';

export interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  score: number;
  leadScore?: number;
  state: ConversationState;
  pattern?: string;
  lastInteraction?: string;
  appointmentScheduled?: boolean;
  source?: string;
  phoneNumber?: string;
  conversationState?: ConversationState;
  [key: string]: unknown;
}

export interface ConversationMessage {
  id: string;
  sender: LeadSender;
  text: string;
  timestamp: string;
  message?: string;
}

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: string;
}

export interface FunnelDatum {
  stage: string;
  value: number;
  fill?: string;
  percentage?: number;
}

export interface RecoveryMetrics {
  revenueRecovered?: number;
  revenueTrend?: number;
  recoveryRate?: number;
  rateTrend?: number;
  aiHandled?: number;
  aiTrend?: number;
  totalMissedCalls?: number;
  leadsQualified?: number;
  appointmentsBooked?: number;
  weeklyConversionRate?: number;
  averageLeadScore?: number;
  totalRecoveryValue?: number;
  funnelData: FunnelDatum[];
}

export interface CalendarStatus {
  isConnected?: boolean;
  lastSync?: string;
  timezone?: string;
  businessName?: string;
  upcomingAppointments?: number;
  syncStatus?: 'healthy' | 'warning' | 'error' | string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  patientName?: string;
  patientPhone?: string;
  location?: string;
  description?: string;
  status?: string;
}

export interface BusinessSettings {
  businessName: string;
  timezone: string;
  googleCalendarConnected: boolean;
  smsEnabled: boolean;
}

export interface SystemStatusUpdate {
  active?: boolean;
  status?: 'connected' | 'connecting' | 'disconnected' | string;
  activeLeads?: number;
}

export interface AppStoreState {
  businessSettings: BusinessSettings;
  activeLeadCount: number;
  currentPage: string;
  systemPulse: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | string;
  selectedLeadId: string | null;
  unreadMessageCount: number;
  setBusinessSettings: (settings: Partial<BusinessSettings>) => void;
  setActiveLeadCount: (count: number) => void;
  setCurrentPage: (page: string) => void;
  setSystemPulse: (pulse: boolean) => void;
  setConnectionStatus: (status: AppStoreState['connectionStatus']) => void;
  setSelectedLeadId: (id: string | null) => void;
  setUnreadMessageCount: (count: number) => void;
  incrementUnreadMessages: () => void;
  clearUnreadMessages: () => void;
  updateSystemStatus: (data: SystemStatusUpdate) => void;
}