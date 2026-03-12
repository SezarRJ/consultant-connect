import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // Page
  pageTitle: 'Dashboard',
  setPageTitle: (title) => set({ pageTitle: title }),

  // Client context
  selectedClientId: null,
  setSelectedClientId: (id) => set({ selectedClientId: id }),

  // Notifications — full notifications array
  notificationCount: 0,
  notifications: [], // Full notification objects (max 50)
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications].slice(0, 50),
    notificationCount: state.notificationCount + 1,
  })),
  markAllRead: () => set({ notificationCount: 0 }),
  dismissNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id),
    notificationCount: Math.max(0, state.notificationCount - 1),
  })),

  // Auth
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  clearUser: () => set({ currentUser: null, selectedClientId: null }),
}));
