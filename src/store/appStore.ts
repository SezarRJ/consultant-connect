/**
 * appStore.ts  (updated)
 * ─────────────────────────────────────────────────────────────────
 * General app state: page title, notifications, current user.
 * Engagement state lives in engagementStore.ts.
 * This store imports the engagement store so components that used
 * selectedClientId can migrate to activeEngagementId gracefully.
 * ─────────────────────────────────────────────────────────────────
 */
import { create } from "zustand";

interface Notification {
  id: string;
  text: string;
  time: string;
  read: boolean;
}

interface AppStore {
  // Page
  pageTitle: string;
  setPageTitle: (title: string) => void;

  // Legacy client context — kept for backward compat
  // Prefer useEngagementStore().activeEngagementId going forward
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;

  // Notifications
  notificationCount: number;
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "read">) => void;
  markAllRead: () => void;
  dismissNotification: (id: string) => void;

  // Auth
  currentUser: null | { id: string; email: string; name?: string };
  setCurrentUser: (user: AppStore["currentUser"]) => void;
  clearUser: () => void;
}

export const useAppStore = create<AppStore>()((set) => ({
  // Page
  pageTitle: "Dashboard",
  setPageTitle: (title) => set({ pageTitle: title }),

  // Legacy
  selectedClientId: null,
  setSelectedClientId: (id) => set({ selectedClientId: id }),

  // Notifications
  notificationCount: 0,
  notifications: [],
  addNotification: (n) =>
    set((state) => ({
      notifications: [
        { ...n, id: `notif_${Date.now()}`, read: false },
        ...state.notifications,
      ].slice(0, 50),
      notificationCount: state.notificationCount + 1,
    })),
  markAllRead: () =>
    set((state) => ({
      notificationCount: 0,
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      notificationCount: Math.max(0, state.notificationCount - 1),
    })),

  // Auth
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  clearUser: () => set({ currentUser: null, selectedClientId: null }),
}));
