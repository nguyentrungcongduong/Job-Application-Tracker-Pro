import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JobApplication, User, ApplicationFilters, SortOptions, AuthResponse, Interview } from '../types';
import { mockApplications, mockInterviews } from '../data/mockData';
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

                    const { token, name, email: userEmail, onboarded } = response.data;

                    const user: User = {
                        id: 'temp-id', // Backend should ideally return ID
                        email: userEmail,
                        name,
                        role: 'BASIC',
                        onboarded,
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

                    const { token, name: userName, email: userEmail, onboarded } = response.data;

                    // If backend returns a token (auto-login), set state
                    if (token) {
                        const user: User = {
                            id: 'temp-id',
                            email: userEmail,
                            name: userName,
                            role: 'BASIC',
                            onboarded,
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
                    // Still set locally to allow the user to proceed if the API fails but we want to be resilient
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
    setApplications: (applications: JobApplication[]) => void;
    addApplication: (application: JobApplication) => void;
    updateApplication: (id: string, updates: Partial<JobApplication>) => void;
    deleteApplication: (id: string) => void;
    selectApplication: (id: string | null) => void;

    // Interview Actions
    setInterviews: (interviews: Interview[]) => void;
    addInterview: (interview: Interview) => void;
    updateInterview: (id: string, updates: Partial<Interview>) => void;
    deleteInterview: (id: string) => void;

    setFilters: (filters: ApplicationFilters) => void;
    setSortOptions: (options: SortOptions) => void;
    setViewMode: (mode: 'kanban' | 'table') => void;
    reorderApplications: (startIndex: number, endIndex: number) => void;
    getFilteredApplications: () => JobApplication[];
}

export const useApplicationStore = create<ApplicationState>()(
    persist(
        (set, get) => ({
            applications: mockApplications,
            interviews: mockInterviews,
            selectedApplication: null,
            filters: {},
            sortOptions: {
                field: 'updatedAt',
                order: 'desc'
            },
            viewMode: 'kanban',

            setApplications: (applications) => set({ applications }),
            setInterviews: (interviews) => set({ interviews }),

            addApplication: (application) => set((state) => ({
                applications: [application, ...state.applications]
            })),

            addInterview: (interview) => set((state) => ({
                interviews: [interview, ...state.interviews]
            })),

            updateApplication: (id, updates) => set((state) => ({
                applications: state.applications.map(app =>
                    app.id === id ? { ...app, ...updates, updatedAt: new Date().toISOString() } : app
                ),
                selectedApplication: state.selectedApplication?.id === id
                    ? { ...state.selectedApplication, ...updates }
                    : state.selectedApplication
            })),

            updateInterview: (id, updates) => set((state) => ({
                interviews: state.interviews.map(int =>
                    int.id === id ? { ...int, ...updates } : int
                )
            })),

            deleteApplication: (id) => set((state) => ({
                applications: state.applications.filter(app => app.id !== id),
                interviews: state.interviews.filter(int => int.applicationId !== id),
                selectedApplication: state.selectedApplication?.id === id ? null : state.selectedApplication
            })),

            deleteInterview: (id) => set((state) => ({
                interviews: state.interviews.filter(int => int.id !== id)
            })),

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

                // Apply filters
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

                // Apply sorting
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

interface UIState {
    sidebarOpen: boolean;
    theme: 'dark' | 'light';
    primaryHue: number;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setTheme: (theme: 'dark' | 'light') => void;
    setPrimaryHue: (hue: number) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            sidebarOpen: true,
            theme: 'dark',
            primaryHue: 250,

            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            setTheme: (theme) => set({ theme }),
            setPrimaryHue: (hue) => set({ primaryHue: hue })
        }),
        {
            name: STORAGE_KEYS.THEME
        }
    )
);
