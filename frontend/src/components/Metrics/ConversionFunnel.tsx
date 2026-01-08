import React, { useEffect, useState } from 'react';
import { metricsApi, type ConversionMetrics } from '../../api/metrics';
import './ConversionFunnel.css';

const ConversionFunnel: React.FC = () => {
    const [metrics, setMetrics] = useState<ConversionMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            const data = await metricsApi.getConversionMetrics();
            setMetrics(data);
            setError(null);
        } catch (err) {
            setError('Failed to load conversion metrics');
            console.error('Error fetching metrics:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatPercentage = (value: number | null): string => {
        if (value === null || value === undefined) return 'N/A';
        return `${value.toFixed(1)}%`;
    };

    const getBarWidth = (count: number, maxCount: number): number => {
        if (maxCount === 0) return 0;
        return (count / maxCount) * 100;
    };

    if (loading) {
        return (
            <div className="conversion-funnel">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading conversion metrics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="conversion-funnel">
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={fetchMetrics} className="retry-button">Retry</button>
                </div>
            </div>
        );
    }

    if (!metrics || metrics.stages.length === 0) {
        return (
            <div className="conversion-funnel">
                <div className="empty-state">
                    <p>No data available yet. Start applying to jobs to see your conversion metrics!</p>
                </div>
            </div>
        );
    }

    const maxCount = Math.max(...metrics.stages.map(s => s.count));

    return (
        <div className="conversion-metrics-card card shadow-lg">
            <div className="metrics-header">
                <div className="header-info">
                    <h3 className="metrics-title">Stage Conversion Efficiency</h3>
                    <p className="metrics-description">Track how effectively you move through the hiring funnel</p>
                </div>
                <div className="overall-badge highlight">
                    <span className="badge-label">Overall Success Rate</span>
                    <span className="badge-value">{formatPercentage(metrics.overallConversionRate)}</span>
                </div>
            </div>

            <div className="metrics-summary">
                <div className="summary-item">
                    <span className="summary-label">Applications</span>
                    <span className="summary-value">{metrics.totalApplications}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-item">
                    <span className="summary-label">Total Offers</span>
                    <span className="summary-value">{metrics.totalOffers}</span>
                </div>
            </div>

            <div className="funnel-container">
                {metrics.stages.map((stage) => (
                    <div key={stage.stageName} className="funnel-row">
                        <div className="stage-content">
                            <div className="stage-meta">
                                <span className="stage-label">{stage.stageName}</span>
                                <span className="stage-quantity">{stage.count}</span>
                            </div>
                            
                            <div className="progress-track">
                                <div 
                                    className="progress-fill"
                                    style={{ 
                                        width: `${getBarWidth(stage.count, maxCount)}%`
                                    }}
                                ></div>
                            </div>
                        </div>

                        {stage.conversionRate !== null && (
                            <div className="conversion-link">
                                <div className="link-line"></div>
                                <div className="conversion-tag">
                                    <span className="tag-icon">↓</span>
                                    <span className="tag-text">{formatPercentage(stage.conversionRate)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="metrics-footer">
                <h4 className="footer-title">Success Insights</h4>
                <ul className="insights-list">
                    {generateInsights(metrics)}
                </ul>
            </div>
        </div>
    );
};



const generateInsights = (metrics: ConversionMetrics): React.ReactElement[] => {
    const insights: React.ReactElement[] = [];

    // Find the weakest conversion stage
    const stagesWithConversion = metrics.stages.filter(s => s.conversionRate !== null);
    if (stagesWithConversion.length > 0) {
        const weakestStage = stagesWithConversion.reduce((min, stage) => 
            (stage.conversionRate || 0) < (min.conversionRate || 0) ? stage : min
        );
        
        insights.push(
            <li key="weakest">
                <strong>Weakest Stage:</strong> {weakestStage.stageName} with {formatPercentage(weakestStage.conversionRate)} conversion rate
            </li>
        );
    }

    // Find the strongest conversion stage
    if (stagesWithConversion.length > 0) {
        const strongestStage = stagesWithConversion.reduce((max, stage) => 
            (stage.conversionRate || 0) > (max.conversionRate || 0) ? stage : max
        );
        
        insights.push(
            <li key="strongest">
                <strong>Strongest Stage:</strong> {strongestStage.stageName} with {formatPercentage(strongestStage.conversionRate)} conversion rate
            </li>
        );
    }

    // Overall performance insight
    if (metrics.overallConversionRate !== null) {
        const performance = metrics.overallConversionRate > 5 ? 'excellent' : 
                          metrics.overallConversionRate > 2 ? 'good' : 'needs improvement';
        insights.push(
            <li key="overall">
                <strong>Overall Performance:</strong> Your {formatPercentage(metrics.overallConversionRate)} offer rate is {performance}
            </li>
        );
    }

    return insights;
};

const formatPercentage = (value: number | null): string => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(1)}%`;
};

export default ConversionFunnel;
