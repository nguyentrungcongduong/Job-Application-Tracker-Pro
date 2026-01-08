import axiosInstance from './axios';

export interface StageConversion {
    stageName: string;
    count: number;
    conversionRate: number | null;
    nextStageCount: number | null;
}

export interface ConversionMetrics {
    stages: StageConversion[];
    overallConversionRate: number | null;
    totalApplications: number;
    totalOffers: number;
}

export interface SourcePerformance {
    source: string;
    totalApplications: number;
    offerCount: number;
    offerProbability: number;
}

export const metricsApi = {
    getConversionMetrics: async (): Promise<ConversionMetrics> => {
        const response = await axiosInstance.get<ConversionMetrics>('/metrics/conversion');
        return response.data;
    },
    getSourcePerformance: async (): Promise<SourcePerformance[]> => {
        const response = await axiosInstance.get<SourcePerformance[]>('/metrics/source-performance');
        return response.data;
    },
};
