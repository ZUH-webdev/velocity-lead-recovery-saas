import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Business Settings
  businessSettings: {
    businessName: 'Mountain Peak Clinic',
    timezone: 'MST',
    googleCalendarConnected: true,
    smsEnabled: true,
  },

  // Active Lead Count
  activeLeadCount: 0,

  // Current Page/Route
  currentPage: 'dashboard', // dashboard, leads, calendar, settings

  // Real-time System Status
  systemPulse: true,
  connectionStatus: 'connected', // connected, connecting, disconnected

  // Selected Lead (for master-detail view)
  selectedLeadId: null,

  // Notification Badge
  unreadMessageCount: 0,

  // Actions
  setBusinessSettings: (settings) =>
    set((state) => ({
      businessSettings: {
        ...state.businessSettings,
        ...settings,
      },
    })),

  setActiveLeadCount: (count) => set({ activeLeadCount: count }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setSystemPulse: (pulse) => set({ systemPulse: pulse }),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setSelectedLeadId: (id) => set({ selectedLeadId: id }),

  setUnreadMessageCount: (count) => set({ unreadMessageCount: count }),

  incrementUnreadMessages: () =>
    set((state) => ({
      unreadMessageCount: state.unreadMessageCount + 1,
    })),

  clearUnreadMessages: () => set({ unreadMessageCount: 0 }),

  // System event handler
  updateSystemStatus: (data) =>
    set((state) => ({
      ...state,
      systemPulse: data.active || state.systemPulse,
      connectionStatus: data.status || state.connectionStatus,
      activeLeadCount: data.activeLeads || state.activeLeadCount,
    })),
}));
