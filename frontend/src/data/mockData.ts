import type { JobApplication, Interview, DashboardStats, FunnelData, SourcePerformance } from '../types';

// ========================================
// MOCK USER
// ========================================

export const mockUser = {
    id: 'user-1',
    email: 'demo@jobtracker.pro',
    name: 'Alex Johnson',
    role: 'PRO' as const,
    onboarded: true,
    createdAt: '2025-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
};

// ========================================
// MOCK APPLICATIONS
// ========================================

export const mockApplications: JobApplication[] = [
    {
        id: 'app-1',
        userId: 'user-1',
        companyName: 'Google',
        position: 'Senior Software Engineer',
        status: 'INTERVIEW_2',
        appliedDate: '2026-01-02',
        jdLink: 'https://careers.google.com/jobs/123',
        source: 'LINKEDIN',
        salaryExpectation: 180000,
        priority: 'HIGH',
        tags: ['Remote', 'Engineering', 'Dream Job'],
        cvVersion: 'CV_v3_Tech_Lead.pdf',
        recruiterContact: 'sarah.recruiter@google.com',
        notes: 'Great culture, innovative projects. Team seems very collaborative.',
        fitScore: 85,
        firstResponseDate: '2026-01-03T10:00:00Z',
        createdAt: '2026-01-02T10:00:00Z',
        updatedAt: '2026-01-04T15:30:00Z'
    },
    {
        id: 'app-2',
        userId: 'user-1',
        companyName: 'Meta',
        position: 'Full Stack Developer',
        status: 'FINAL_INTERVIEW',
        appliedDate: '2025-12-28',
        jdLink: 'https://www.metacareers.com/jobs/456',
        source: 'REFERRAL',
        salaryExpectation: 170000,
        priority: 'HIGH',
        tags: ['Hybrid', 'Product', 'High Salary'],
        cvVersion: 'CV_v3_Tech_Lead.pdf',
        recruiterContact: 'john.smith@meta.com',
        notes: 'Referred by college friend. Strong engineering culture.',
        fitScore: 92,
        firstResponseDate: '2025-12-30T09:00:00Z',
        createdAt: '2025-12-28T09:00:00Z',
        updatedAt: '2026-01-05T11:00:00Z'
    },
    {
        id: 'app-3',
        userId: 'user-1',
        companyName: 'Stripe',
        position: 'Backend Engineer',
        status: 'INTERVIEW_1',
        appliedDate: '2026-01-03',
        jdLink: 'https://stripe.com/jobs/789',
        source: 'COMPANY_WEBSITE',
        salaryExpectation: 165000,
        priority: 'HIGH',
        tags: ['Remote', 'Startup', 'Fast Growing'],
        cvVersion: 'CV_v3_Tech_Lead.pdf',
        fitScore: 78,
        firstResponseDate: '2026-01-04T12:00:00Z',
        createdAt: '2026-01-03T14:00:00Z',
        updatedAt: '2026-01-04T16:00:00Z'
    },
    {
        id: 'app-4',
        userId: 'user-1',
        companyName: 'Amazon',
        position: 'Software Development Engineer II',
        status: 'HR_SCREEN',
        appliedDate: '2026-01-04',
        jdLink: 'https://amazon.jobs/en/jobs/101',
        source: 'LINKEDIN',
        salaryExpectation: 155000,
        priority: 'MEDIUM',
        tags: ['On-site', 'Enterprise', 'Full-time'],
        cvVersion: 'CV_v2_General.pdf',
        fitScore: 72,
        createdAt: '2026-01-04T08:00:00Z',
        updatedAt: '2026-01-05T09:00:00Z'
    },
    {
        id: 'app-5',
        userId: 'user-1',
        companyName: 'Airbnb',
        position: 'Frontend Engineer',
        status: 'APPLIED',
        appliedDate: '2026-01-05',
        jdLink: 'https://careers.airbnb.com/positions/202',
        source: 'INDEED',
        salaryExpectation: 160000,
        priority: 'MEDIUM',
        tags: ['Hybrid', 'Product', 'Good Culture'],
        cvVersion: 'CV_v3_Tech_Lead.pdf',
        fitScore: 68,
        createdAt: '2026-01-05T10:00:00Z',
        updatedAt: '2026-01-05T10:00:00Z'
    },
    {
        id: 'app-6',
        userId: 'user-1',
        companyName: 'Netflix',
        position: 'Senior Backend Engineer',
        status: 'APPLIED',
        appliedDate: '2026-01-04',
        jdLink: 'https://jobs.netflix.com/jobs/303',
        source: 'RECRUITER',
        salaryExpectation: 190000,
        priority: 'HIGH',
        tags: ['Remote', 'Engineering', 'High Salary'],
        cvVersion: 'CV_v3_Tech_Lead.pdf',
        fitScore: 81,
        createdAt: '2026-01-04T13:00:00Z',
        updatedAt: '2026-01-04T13:00:00Z'
    },
    {
        id: 'app-7',
        userId: 'user-1',
        companyName: 'Shopify',
        position: 'Full Stack Engineer',
        status: 'WISHLIST',
        appliedDate: '2026-01-06',
        jdLink: 'https://www.shopify.com/careers/404',
        source: 'COMPANY_WEBSITE',
        salaryExpectation: 150000,
        priority: 'MEDIUM',
        tags: ['Remote', 'Startup', 'Good Culture'],
        cvVersion: '',
        fitScore: 0,
        createdAt: '2026-01-05T16:00:00Z',
        updatedAt: '2026-01-05T16:00:00Z'
    },
    {
        id: 'app-8',
        userId: 'user-1',
        companyName: 'Uber',
        position: 'Software Engineer',
        status: 'REJECTED',
        appliedDate: '2025-12-20',
        jdLink: 'https://www.uber.com/careers/505',
        source: 'LINKEDIN',
        salaryExpectation: 145000,
        priority: 'LOW',
        tags: ['On-site', 'Enterprise'],
        cvVersion: 'CV_v2_General.pdf',
        notes: 'Rejected after technical round. Need to improve system design skills.',
        fitScore: 55,
        createdAt: '2025-12-20T11:00:00Z',
        updatedAt: '2025-12-28T14:00:00Z'
    },
    {
        id: 'app-9',
        userId: 'user-1',
        companyName: 'Spotify',
        position: 'Backend Developer',
        status: 'OFFER_RECEIVED',
        appliedDate: '2025-12-15',
        jdLink: 'https://www.spotifyjobs.com/606',
        source: 'REFERRAL',
        salaryExpectation: 158000,
        priority: 'HIGH',
        tags: ['Hybrid', 'Product', 'Good Culture', 'Dream Job'],
        cvVersion: 'CV_v3_Tech_Lead.pdf',
        recruiterContact: 'emma.hr@spotify.com',
        notes: 'Excellent offer! Great team, interesting projects. Considering seriously.',
        fitScore: 88,
        createdAt: '2025-12-15T09:00:00Z',
        updatedAt: '2026-01-03T10:00:00Z'
    },
    {
        id: 'app-10',
        userId: 'user-1',
        companyName: 'Notion',
        position: 'Full Stack Engineer',
        status: 'INTERVIEW_1',
        appliedDate: '2026-01-01',
        jdLink: 'https://www.notion.so/careers/707',
        source: 'COMPANY_WEBSITE',
        salaryExpectation: 155000,
        priority: 'MEDIUM',
        tags: ['Remote', 'Startup', 'Product'],
        cvVersion: 'CV_v3_Tech_Lead.pdf',
        fitScore: 75,
        createdAt: '2026-01-01T12:00:00Z',
        updatedAt: '2026-01-03T15:00:00Z'
    }
];

// ========================================
// MOCK INTERVIEWS
// ========================================

export const mockInterviews: Interview[] = [
    {
        id: 'int-1',
        applicationId: 'app-1',
        round: 1,
        interviewDate: '2026-01-03T14:00:00Z',
        interviewerName: 'Sarah Chen',
        interviewerTitle: 'Engineering Manager',
        interviewType: 'ONLINE',
        questions: [
            'Tell me about your experience with distributed systems',
            'How do you handle technical debt in a fast-paced environment?',
            'Describe a challenging bug you solved recently'
        ],
        selfAnswers: [
            'Discussed microservices architecture at previous company',
            'Emphasized balance between delivery and code quality',
            'Explained race condition issue in payment system'
        ],
        feedback: 'Strong technical background. Good communication skills.',
        confidenceScore: 4,
        fitScore: 4,
        wantContinue: true,
        notes: 'Very positive interview. Team seems great. Next round is system design.',
        createdAt: '2026-01-03T15:00:00Z'
    },
    {
        id: 'int-2',
        applicationId: 'app-1',
        round: 2,
        interviewDate: '2026-01-04T15:00:00Z',
        interviewerName: 'Michael Park',
        interviewerTitle: 'Senior Staff Engineer',
        interviewType: 'ONLINE',
        questions: [
            'Design a URL shortener service',
            'How would you scale it to handle 1M requests/second?',
            'Discuss trade-offs between consistency and availability'
        ],
        confidenceScore: 4,
        fitScore: 5,
        wantContinue: true,
        feedback: 'Excellent system design skills. Asked great clarifying questions.',
        notes: 'Challenging but fair. Interviewer was very helpful and collaborative.',
        createdAt: '2026-01-04T16:30:00Z'
    },
    {
        id: 'int-3',
        applicationId: 'app-2',
        round: 1,
        interviewDate: '2025-12-30T10:00:00Z',
        interviewerName: 'David Liu',
        interviewerTitle: 'Tech Lead',
        interviewType: 'ONLINE',
        questions: [
            'Implement a LRU cache',
            'Optimize database queries for a social media feed',
            'Discuss React performance optimization techniques'
        ],
        confidenceScore: 5,
        fitScore: 5,
        wantContinue: true,
        feedback: 'Outstanding performance. Very impressed with full-stack knowledge.',
        salaryDiscussed: 170000,
        notes: 'Best interview so far! Great chemistry with the team.',
        createdAt: '2025-12-30T11:30:00Z'
    },
    {
        id: 'int-4',
        applicationId: 'app-2',
        round: 2,
        interviewDate: '2026-01-02T14:00:00Z',
        interviewerName: 'Jessica Wang',
        interviewerTitle: 'Product Manager',
        interviewType: 'ONLINE',
        questions: [
            'How do you prioritize features?',
            'Tell me about a time you disagreed with a product decision',
            'How do you handle ambiguous requirements?'
        ],
        confidenceScore: 4,
        fitScore: 5,
        wantContinue: true,
        feedback: 'Strong product sense. Good collaboration mindset.',
        notes: 'Behavioral round went well. Discussed team dynamics and culture.',
        createdAt: '2026-01-02T15:30:00Z'
    },
    {
        id: 'int-5',
        applicationId: 'app-3',
        round: 1,
        interviewDate: '2026-01-04T16:00:00Z',
        interviewerName: 'Alex Thompson',
        interviewerTitle: 'Senior Engineer',
        interviewType: 'ONLINE',
        questions: [
            'Design a payment processing system',
            'How do you ensure data consistency in distributed transactions?',
            'Discuss API design best practices'
        ],
        confidenceScore: 4,
        fitScore: 4,
        wantContinue: true,
        notes: 'Good technical discussion. Waiting for feedback.',
        createdAt: '2026-01-04T17:30:00Z'
    }
];

// ========================================
// MOCK DASHBOARD STATS
// ========================================

export const mockDashboardStats: DashboardStats = {
    totalApplications: 10,
    activeApplications: 7,
    interviewsScheduled: 4,
    offersReceived: 1,
    responseRate: 70,
    averageFitScore: 75.4
};

// ========================================
// MOCK FUNNEL DATA
// ========================================

export const mockFunnelData: FunnelData[] = [
    { stage: 'APPLIED', count: 10, percentage: 100 },
    { stage: 'HR_SCREEN', count: 7, percentage: 70 },
    { stage: 'INTERVIEW_1', count: 5, percentage: 50 },
    { stage: 'INTERVIEW_2', count: 3, percentage: 30 },
    { stage: 'FINAL_INTERVIEW', count: 2, percentage: 20 },
    { stage: 'OFFER_RECEIVED', count: 1, percentage: 10 }
];

// ========================================
// MOCK SOURCE PERFORMANCE
// ========================================

export const mockSourcePerformance: SourcePerformance[] = [
    {
        source: 'REFERRAL',
        applications: 2,
        interviews: 2,
        offers: 1,
        conversionRate: 50
    },
    {
        source: 'LINKEDIN',
        applications: 4,
        interviews: 2,
        offers: 0,
        conversionRate: 0
    },
    {
        source: 'COMPANY_WEBSITE',
        applications: 2,
        interviews: 1,
        offers: 0,
        conversionRate: 0
    },
    {
        source: 'RECRUITER',
        applications: 1,
        interviews: 0,
        offers: 0,
        conversionRate: 0
    },
    {
        source: 'INDEED',
        applications: 1,
        interviews: 0,
        offers: 0,
        conversionRate: 0
    }
];
