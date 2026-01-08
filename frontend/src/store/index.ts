import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JobApplication, User, ApplicationFilters, SortOptions, AuthResponse, Interview } from '../types';
import { STORAGE_KEYS, API_ENDPOINTS } from '../constants';
import axiosInstance from '../api/axios';

// ========================================
// AUTH STORE
// ========================================

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
    completeOnboarding: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                try {
                    const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.LOGIN, {
                        email,
                        password
                    });

                    const { token, id, name, email: userEmail, onboarded } = response.data;

                    const user: User = {
                        id,
                        email: userEmail,
                        name,
                        role: 'BASIC',
                        onboarded,
                        emailNotificationsEnabled: response.data.emailNotificationsEnabled,
                        createdAt: new Date().toISOString(),
                    };

                    set({
                        user,
                        token,
                        isAuthenticated: true
                    });
                } catch (error) {
                    console.error('Login failed:', error);
                    throw error;
                }
            },

            register: async (email: string, password: string, name: string) => {
                try {
                    const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.REGISTER, {
                        email,
                        password,
                        name
                    });

                    const { token, id, name: userName, email: userEmail, onboarded } = response.data;

                    if (token) {
                        const user: User = {
                            id,
                            email: userEmail,
                            name: userName,
                            role: 'BASIC',
                            onboarded,
                            emailNotificationsEnabled: response.data.emailNotificationsEnabled,
                            createdAt: new Date().toISOString(),
                        };

                        set({
                            user,
                            token,
                            isAuthenticated: true
                        });
                    }
                } catch (error) {
                    console.error('Registration failed:', error);
                    throw error;
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                });
            },

            setUser: (user: User) => {
                set({ user });
            },

            completeOnboarding: async () => {
                const { user } = get() as AuthState;
                if (!user) return;

                try {
                    await axiosInstance.post(API_ENDPOINTS.COMPLETE_ONBOARDING);
                    set({ user: { ...user, onboarded: true } });
                } catch (error) {
                    console.error('Failed to complete onboarding:', error);
                    set({ user: { ...user, onboarded: true } });
                }
            }
        }),
        {
            name: STORAGE_KEYS.USER
        }
    )
);

// ========================================
// APPLICATION STORE
// ========================================

interface ApplicationState {
    applications: JobApplication[];
    interviews: Interview[];
    selectedApplication: JobApplication | null;
    filters: ApplicationFilters;
    sortOptions: SortOptions;
    viewMode: 'kanban' | 'table';

    // Actions
    fetchApplications: () => Promise<void>;
    fetchAllInterviews: () => Promise<void>;
    fetchInterviews: (applicationId: string) => Promise<void>;
    setApplications: (applications: JobApplication[]) => void;
    addApplication: (application: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateApplication: (id: string, updates: Partial<JobApplication>) => Promise<void>;
    deleteApplication: (id: string) => Promise<void>;
    selectApplication: (id: string | null) => void;

    // Interview Actions
    setInterviews: (interviews: Interview[]) => void;
    addInterview: (interview: Omit<Interview, 'id' | 'createdAt'>) => Promise<void>;
    updateInterview: (id: string, updates: Partial<Interview>) => Promise<void>;
    deleteInterview: (id: string) => Promise<void>;

    setFilters: (filters: ApplicationFilters) => void;
    setSortOptions: (options: SortOptions) => void;
    setViewMode: (mode: 'kanban' | 'table') => void;
    reorderApplications: (startIndex: number, endIndex: number) => void;
    getFilteredApplications: () => JobApplication[];
}

export const useApplicationStore = create<ApplicationState>()(
    persist(
        (set, get) => ({
            applications: [],
            interviews: [],
            selectedApplication: null,
            filters: {},
            sortOptions: {
                field: 'updatedAt',
                order: 'desc'
            },
            viewMode: 'kanban',

            fetchApplications: async () => {
                try {
                    const response = await axiosInstance.get<JobApplication[]>(API_ENDPOINTS.APPLICATIONS);
                    set({ applications: response.data });
                } catch (error) {
                    console.error('Failed to fetch applications:', error);
                }
            },

            fetchInterviews: async (applicationId) => {
                try {
                    const response = await axiosInstance.get<Interview[]>(API_ENDPOINTS.INTERVIEWS(applicationId));
                    set({ interviews: response.data });
                } catch (error) {
                    console.error('Failed to fetch interviews:', error);
                }
            },

            fetchAllInterviews: async () => {
                try {
                    const response = await axiosInstance.get<Interview[]>('/interviews');
                    set({ interviews: response.data });
                } catch (error) {
                    console.error('Failed to fetch all interviews:', error);
                }
            },

            setApplications: (applications) => set({ applications }),
            setInterviews: (interviews) => set({ interviews }),

            addApplication: async (application) => {
                try {
                    const response = await axiosInstance.post<JobApplication>(API_ENDPOINTS.APPLICATIONS, application);
                    set((state) => ({
                        applications: [response.data, ...state.applications]
                    }));
                } catch (error) {
                    console.error('Failed to add application:', error);
                    throw error;
                }
            },

            addInterview: async (interview) => {
                try {
                    const response = await axiosInstance.post<Interview>('/interviews', interview);
                    set((state) => ({
                        interviews: [response.data, ...state.interviews]
                    }));
                } catch (error) {
                    console.error('Failed to add interview:', error);
                    throw error;
                }
            },

            updateApplication: async (id, updates) => {
                try {
                    const response = await axiosInstance.put<JobApplication>(API_ENDPOINTS.APPLICATION_BY_ID(id), updates);
                    set((state) => ({
                        applications: state.applications.map(app =>
                            app.id === id ? response.data : app
                        ),
                        selectedApplication: state.selectedApplication?.id === id
                            ? response.data
                            : state.selectedApplication
                    }));
                } catch (error) {
                    console.error('Failed to update application:', error);
                    throw error;
                }
            },

            updateInterview: async (id, updates) => {
                try {
                    const response = await axiosInstance.put<Interview>(`/interviews/${id}`, updates);
                    set((state) => ({
                        interviews: state.interviews.map(int =>
                            int.id === id ? response.data : int
                        )
                    }));
                } catch (error) {
                    console.error('Failed to update interview:', error);
                    throw error;
                }
            },

            deleteApplication: async (id) => {
                try {
                    await axiosInstance.delete(API_ENDPOINTS.APPLICATION_BY_ID(id));
                    set((state) => ({
                        applications: state.applications.filter(app => app.id !== id),
                        interviews: state.interviews.filter(int => int.applicationId !== id),
                        selectedApplication: state.selectedApplication?.id === id ? null : state.selectedApplication
                    }));
                } catch (error) {
                    console.error('Failed to delete application:', error);
                    throw error;
                }
            },

            deleteInterview: async (id) => {
                try {
                    await axiosInstance.delete(`/interviews/${id}`);
                    set((state) => ({
                        interviews: state.interviews.filter(int => int.id !== id)
                    }));
                } catch (error) {
                    console.error('Failed to delete interview:', error);
                    throw error;
                }
            },

            selectApplication: (id) => set((state) => ({
                selectedApplication: id ? state.applications.find(app => app.id === id) || null : null
            })),

            setFilters: (filters) => set({ filters }),
            setSortOptions: (options) => set({ sortOptions: options }),
            setViewMode: (mode) => set({ viewMode: mode }),

            reorderApplications: (startIndex, endIndex) => set((state) => {
                const result = Array.from(state.applications);
                const [removed] = result.splice(startIndex, 1);
                result.splice(endIndex, 0, removed);
                return { applications: result };
            }),

            getFilteredApplications: () => {
                const { applications, filters, sortOptions } = get();
                let filtered = [...applications];

                if (filters.status && filters.status.length > 0) {
                    filtered = filtered.filter(app => filters.status!.includes(app.status));
                }

                if (filters.priority && filters.priority.length > 0) {
                    filtered = filtered.filter(app => filters.priority!.includes(app.priority));
                }

                if (filters.source && filters.source.length > 0) {
                    filtered = filtered.filter(app => filters.source!.includes(app.source));
                }

                if (filters.tags && filters.tags.length > 0) {
                    filtered = filtered.filter(app =>
                        filters.tags!.some(tag => app.tags.includes(tag))
                    );
                }

                if (filters.minFitScore !== undefined) {
                    filtered = filtered.filter(app => (app.fitScore || 0) >= filters.minFitScore!);
                }

                if (filters.search) {
                    const search = filters.search.toLowerCase();
                    filtered = filtered.filter(app =>
                        app.companyName.toLowerCase().includes(search) ||
                        app.position.toLowerCase().includes(search) ||
                        app.notes?.toLowerCase().includes(search)
                    );
                }

                if (filters.dateFrom) {
                    filtered = filtered.filter(app => app.appliedDate >= filters.dateFrom!);
                }

                if (filters.dateTo) {
                    filtered = filtered.filter(app => app.appliedDate <= filters.dateTo!);
                }

                filtered.sort((a, b) => {
                    const aValue = a[sortOptions.field];
                    const bValue = b[sortOptions.field];

                    if (aValue === undefined || aValue === null) return 1;
                    if (bValue === undefined || bValue === null) return -1;

                    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                    return sortOptions.order === 'asc' ? comparison : -comparison;
                });

                return filtered;
            }
        }),
        {
            name: STORAGE_KEYS.FILTERS,
            partialize: (state) => ({
                filters: state.filters,
                sortOptions: state.sortOptions,
                viewMode: state.viewMode
            })
        }
    )
);

// ========================================
// UI STORE
// ========================================

interface NotificationSettings {
    followUpEnabled: boolean;
    afterApplyingDays: number;
    afterInterviewDays: number;
}

interface UIState {
    sidebarOpen: boolean;
    theme: 'dark' | 'light';
    primaryHue: number;
    notificationSettings: NotificationSettings;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setTheme: (theme: 'dark' | 'light') => void;
    setPrimaryHue: (hue: number) => void;
    setNotificationSettings: (settings: Partial<NotificationSettings>) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            sidebarOpen: true,
            theme: 'dark',
            primaryHue: 250,
            notificationSettings: {
                followUpEnabled: true,
                afterApplyingDays: 3,
                afterInterviewDays: 1
            },

            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            setTheme: (theme) => set({ theme }),
            setPrimaryHue: (hue) => set({ primaryHue: hue }),
            setNotificationSettings: (newSettings) => set((state) => ({
                notificationSettings: { ...state.notificationSettings, ...newSettings }
            }))
        }),
        {
            name: STORAGE_KEYS.THEME
        }
    )
);
