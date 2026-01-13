import { create } from 'zustand';
import { useApplicationStore } from './applicationStore';
import { useAuthStore } from '@/store/authStore';

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: UserNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<UserNotification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// Mock initial notifications
const mockNotifications: UserNotification[] = [
  {
    id: '1',
    title: 'New Job Match',
    message: 'Senior Frontend Engineer role matches your profile',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: '2',
    title: 'Application Accepted',
    message: 'Your application for Google has been accepted for interview',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    id: '3',
    title: 'Deadline Reminder',
    message: 'Only 2 days left to apply for Amazon SDE position',
    type: 'warning',
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  // Start with no demo notifications — show only realtime/backend notifications
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const newNotification: UserNotification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id);
      if (!notification || notification.read) return state;
      
      return {
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id);
      return {
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: notification && !notification.read ? state.unreadCount - 1 : state.unreadCount,
      };
    });
  },

  clearAll: () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
  },
}));

// Open SSE connection for realtime notifications (client-side only)
if (typeof window !== 'undefined' && (window as any).EventSource) {
  try {
    const es = new EventSource('/api/notifications/stream');
    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        const store = useNotificationStore.getState();
        // route application events to application store
        if (payload && payload.type && payload.type.startsWith('application_')) {
          const auth = useAuthStore.getState();
          const appStore = useApplicationStore.getState();
          // only update for current user
          if (payload.userId && auth.user && String(payload.userId) === String(auth.user.id)) {
            if (payload.type === 'application_created') {
              appStore.addOrUpdateApplication({ _id: payload.applicationId, jobId: payload.jobId, userId: payload.userId, createdAt: payload.createdAt });
            } else if (payload.type === 'application_deleted') {
              appStore.removeApplicationByJobId(payload.jobId);
            }
          }
          // also add a small notification
          store.addNotification({ title: payload.type, message: payload.body || payload.message || '', type: 'info' });
          return;
        }

        // if admin-managed skills or profile fields changed, emit a global event so pages can refresh
        if (payload && (payload.type === 'skills' || payload.type === 'profile_fields')) {
          try {
            window.dispatchEvent(new CustomEvent('realtime:update', { detail: payload }));
          } catch (e) {
            // ignore
          }
          store.addNotification({
            title: payload.type === 'skills' ? 'Skills Updated' : 'Profile Fields Updated',
            message: payload.action ? `${payload.action} performed` : (payload.message || ''),
            type: 'info',
          });
          return;
        }

        // convert payload to UserNotification shape for normal notifications
        store.addNotification({
          title: payload.title || 'Notification',
          message: payload.body || payload.message || '',
          type: 'info',
        });
      } catch (err) {
        // ignore parse errors
      }
    };
    es.onerror = () => {
      es.close();
    };
  } catch (err) {
    // ignore
  }
}
