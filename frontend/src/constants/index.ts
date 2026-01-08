import type { ApplicationStatus, ApplicationSource, Priority, InterviewType } from '../types';

// ========================================
// APPLICATION STATUS CONFIGURATION
// ========================================

export const STATUS_CONFIG: Record<ApplicationStatus, {
    label: string;
    color: string;
    bgColor: string;
    icon: string;
    description: string;
}> = {
    WISHLIST: {
        label: 'Wishlist',
        color: 'var(--gray-400)',
        bgColor: 'var(--gray-800)',
        icon: '⭐',
        description: 'Companies you want to apply to'
    },
    CV_IN_PROGRESS: {
        label: 'CV in Progress',
        color: 'var(--warning)',
        bgColor: 'var(--warning-light)',
        icon: '📝',
        description: 'Preparing application materials'
    },
    APPLIED: {
        label: 'Applied',
        color: 'var(--info)',
        bgColor: 'var(--info-light)',
        icon: '📤',
        description: 'Application submitted'
    },
    HR_SCREEN: {
        label: 'HR Screen',
        color: 'var(--accent-500)',
        bgColor: 'var(--accent-50)',
        icon: '📞',
        description: 'Initial HR contact'
    },
    INTERVIEW_1: {
        label: 'Interview Round 1',
        color: 'var(--primary-500)',
        bgColor: 'var(--primary-50)',
        icon: '👥',
        description: 'First interview round'
    },
    INTERVIEW_2: {
        label: 'Interview Round 2',
        color: 'var(--primary-600)',
        bgColor: 'var(--primary-100)',
        icon: '💼',
        description: 'Technical/Second round'
    },
    FINAL_INTERVIEW: {
        label: 'Final Interview',
        color: 'var(--primary-700)',
        bgColor: 'var(--primary-200)',
        icon: '🎯',
        description: 'Final round with leadership'
    },
    OFFER_RECEIVED: {
        label: 'Offer Received',
        color: 'var(--success)',
        bgColor: 'var(--success-light)',
        icon: '🎉',
        description: 'Job offer received'
    },
    OFFER_ACCEPTED: {
        label: 'Offer Accepted',
        color: 'var(--success-dark)',
        bgColor: 'var(--success-light)',
        icon: '✅',
        description: 'Offer accepted - Success!'
    },
    REJECTED: {
        label: 'Rejected',
        color: 'var(--error)',
        bgColor: 'var(--error-light)',
        icon: '❌',
        description: 'Application rejected'
    },
    WITHDRAWN: {
        label: 'Withdrawn',
        color: 'var(--gray-500)',
        bgColor: 'var(--gray-200)',
        icon: '🚫',
        description: 'Application withdrawn'
    }
};

// Kanban board columns
export const KANBAN_COLUMNS: ApplicationStatus[] = [
    'WISHLIST',
    'CV_IN_PROGRESS',
    'APPLIED',
    'HR_SCREEN',
    'INTERVIEW_1',
    'INTERVIEW_2',
    'FINAL_INTERVIEW',
    'OFFER_RECEIVED',
    'OFFER_ACCEPTED',
    'REJECTED',
    'WITHDRAWN'
];

// ========================================
// PRIORITY CONFIGURATION
// ========================================

export const PRIORITY_CONFIG: Record<Priority, {
    label: string;
    color: string;
    icon: string;
}> = {
    HIGH: {
        label: 'High Priority',
        color: 'var(--error)',
        icon: '🔴'
    },
    MEDIUM: {
        label: 'Medium Priority',
        color: 'var(--warning)',
        icon: '🟡'
    },
    LOW: {
        label: 'Low Priority',
        color: 'var(--info)',
        icon: '🔵'
    }
};

// ========================================
// SOURCE CONFIGURATION
// ========================================

export const SOURCE_CONFIG: Record<ApplicationSource, {
    label: string;
    icon: string;
    color: string;
}> = {
    LINKEDIN: {
        label: 'LinkedIn',
        icon: '💼',
        color: '#0A66C2'
    },
    INDEED: {
        label: 'Indeed',
        icon: '🔍',
        color: '#2164F3'
    },
    GLASSDOOR: {
        label: 'Glassdoor',
        icon: '🏢',
        color: '#0CAA41'
    },
    COMPANY_WEBSITE: {
        label: 'Company Website',
        icon: '🌐',
        color: 'var(--primary-500)'
    },
    REFERRAL: {
        label: 'Referral',
        icon: '🤝',
        color: 'var(--success)'
    },
    RECRUITER: {
        label: 'Recruiter',
        icon: '👔',
        color: 'var(--accent-500)'
    },
    OTHER: {
        label: 'Other',
        icon: '📌',
        color: 'var(--gray-500)'
    }
};

// ========================================
// INTERVIEW TYPE CONFIGURATION
// ========================================

export const INTERVIEW_TYPE_CONFIG: Record<InterviewType, {
    label: string;
    icon: string;
}> = {
    ONLINE: {
        label: 'Online',
        icon: '💻'
    },
    ONSITE: {
        label: 'On-site',
        icon: '🏢'
    },
    PHONE: {
        label: 'Phone',
        icon: '📱'
    }
};

// ========================================
// COMMON TAGS
// ========================================

export const COMMON_TAGS = [
    'Remote',
    'Hybrid',
    'On-site',
    'Startup',
    'Enterprise',
    'Product',
    'Engineering',
    'Design',
    'Management',
    'Full-time',
    'Contract',
    'Urgent',
    'Dream Job',
    'High Salary',
    'Good Culture',
    'Fast Growing'
];

// ========================================
// FIT SCORE THRESHOLDS
// ========================================

export const FIT_SCORE_LEVELS = {
    EXCELLENT: { min: 80, label: 'Excellent Match', color: 'var(--success)' },
    GOOD: { min: 60, label: 'Good Match', color: 'var(--primary-500)' },
    FAIR: { min: 40, label: 'Fair Match', color: 'var(--warning)' },
    POOR: { min: 0, label: 'Poor Match', color: 'var(--error)' }
};

export const getFitScoreLevel = (score: number) => {
    if (score >= FIT_SCORE_LEVELS.EXCELLENT.min) return FIT_SCORE_LEVELS.EXCELLENT;
    if (score >= FIT_SCORE_LEVELS.GOOD.min) return FIT_SCORE_LEVELS.GOOD;
    if (score >= FIT_SCORE_LEVELS.FAIR.min) return FIT_SCORE_LEVELS.FAIR;
    return FIT_SCORE_LEVELS.POOR;
};

// ========================================
// DATE FORMATS
// ========================================

export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    DISPLAY_LONG: 'MMMM dd, yyyy',
    DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
    INPUT: 'yyyy-MM-dd',
    ISO: "yyyy-MM-dd'T'HH:mm:ss"
};

// ========================================
// PAGINATION
// ========================================

export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ========================================
// LOCAL STORAGE KEYS
// ========================================

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'job_tracker_token',
    USER: 'job_tracker_user',
    THEME: 'job_tracker_theme',
    FILTERS: 'job_tracker_filters',
    VIEW_MODE: 'job_tracker_view_mode'
};

// ========================================
// API ENDPOINTS
// ========================================

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',

    // Applications
    APPLICATIONS: '/applications',
    APPLICATION_BY_ID: (id: string) => `/applications/${id}`,

    // Interviews
    INTERVIEWS: (appId: string) => `/applications/${appId}/interviews`,
    INTERVIEW_BY_ID: (appId: string, id: string) => `/applications/${appId}/interviews/${id}`,

    // Analytics
    DASHBOARD: '/analytics/dashboard',
    FUNNEL: '/analytics/funnel',
    SOURCE_PERFORMANCE: '/analytics/source-performance',
    FIT_SCORE: (appId: string) => `/analytics/fit-score/${appId}`,

    // Resumes
    RESUMES: '/resumes',
    RESUME_MATCH: '/resumes/match',

    // Notifications
    NOTIFICATIONS: '/notifications',
    NOTIFICATIONS_UNREAD: '/notifications/unread-count',
    NOTIFICATIONS_READ: (id: string) => `/notifications/${id}/read`,
    NOTIFICATIONS_READ_ALL: '/notifications/read-all',

    // Follow-ups
    FOLLOW_UPS: '/follow-ups',
    FOLLOW_UP_BY_ID: (id: string) => `/follow-ups/${id}`,

    // Users
    COMPLETE_ONBOARDING: '/users/onboarding/complete',
    EMAIL_NOTIFICATIONS_SETTINGS: '/users/settings/email-notifications',
    NOTIFICATION_SETTINGS: '/users/settings/notifications'
};
