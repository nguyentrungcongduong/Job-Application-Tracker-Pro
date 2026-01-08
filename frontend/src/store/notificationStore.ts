import { create } from 'zustand';
import axiosInstance from '../api/axios';
import { API_ENDPOINTS } from '../constants';
import type { Notification } from '../types';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;

    fetchNotifications: () => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,

    fetchNotifications: async () => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get<{ content: Notification[] }>(API_ENDPOINTS.NOTIFICATIONS);
            // Handling Page response, extracting content
            const notifications = response.data.content || [];
            set({ notifications, loading: false });

            // Also update count
            get().fetchUnreadCount();
        } catch (error) {
            console.error('Failed to fetch notifications', error);
            set({ loading: false });
        }
    },

    fetchUnreadCount: async () => {
        try {
            const response = await axiosInstance.get<number>(API_ENDPOINTS.NOTIFICATIONS_UNREAD);
            set({ unreadCount: response.data });
        } catch (error) {
            console.error('Failed to fetch unread count', error);
        }
    },

    markAsRead: async (id: string) => {
        try {
            await axiosInstance.put(API_ENDPOINTS.NOTIFICATIONS_READ(id));
            set((state) => ({
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, isRead: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }));
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    },

    markAllAsRead: async () => {
        try {
            await axiosInstance.put(API_ENDPOINTS.NOTIFICATIONS_READ_ALL);
            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0
            }));
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    }
}));
