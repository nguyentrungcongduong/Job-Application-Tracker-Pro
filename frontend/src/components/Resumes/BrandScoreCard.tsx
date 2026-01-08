import React from 'react';
import {
    Award,
    Linkedin,
    Github,
    Lightbulb,
    Zap,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react';

const BrandScoreCard: React.FC = () => {
    const score = 78;

    const factors = [
        { label: 'Strategic Summary', score: 18, max: 20, status: 'good' },
        { label: 'Online Presence', score: 15, max: 20, status: 'medium', links: ['LinkedIn', 'GitHub'] },
        { label: 'Achievement Density', score: 22, max: 25, status: 'good' },
        { label: 'Brand Consistency', score: 10, max: 15, status: 'medium' },
        { label: 'Industry Keywords', score: 13, max: 20, status: 'medium' },
    ];

    const recommendations = [
        { text: 'Add your portfolio link (Globe) to the header.', type: 'urgent' },
        { text: 'Quantify 2 more achievements in your latest role.', type: 'medium' },
        { text: 'Sync LinkedIn summary with your CV objective.', type: 'low' },
    ];

    return (
        <div className="brand-score-container animate-fade-in">
            <div className="section-header">
                <h3 className="section-title">
                    <Award className="text-primary" size={20} />
                    Personal Brand Score
                </h3>
                <p className="section-subtitle">Measure your "Market Magnetic" strength.</p>
            </div>

            {/* Hero Score Viz - Horizontal for better balance */}
            <div className="brand-hero-card">
                <div className="brand-bg-icon">
                    <Award size={80} />
                </div>

                <div className="score-viz-wrapper">
                    <svg className="circular-progress-svg">
                        <circle
                            cx="48"
                            cy="48"
                            r="42"
                            className="circle-bg-track"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r="42"
                            strokeDasharray={264}
                            strokeDashoffset={264 - (264 * score) / 100}
                            className="circle-progress-bar"
                        />
                    </svg>
                    <div className="score-content-overlay">
                        <span className="score-number">{score}</span>
                        <span className="score-total">/ 100</span>
                    </div>
                </div>

                <div className="brand-summary-text">
                    <h4 className="summary-headline">Vibrant Brand Strength</h4>
                    <p className="summary-paragraph">
                        You rank in the <span className="highlight-primary">top 12%</span> of applicants in your field.
                        Your strategic summary and local impact are your key differentiators.
                    </p>
                </div>
            </div>

            {/* Breakdown */}
            <div className="brand-breakdown-section">
                <h4 className="subsection-title">
                    <TrendingUp size={14} /> Score Breakdown
                </h4>
                <div className="factor-list">
                    {factors.map((f, i) => (
                        <div key={i} className="factor-card">
                            <div className="factor-info">
                                <span className="factor-label">{f.label}</span>
                                <div className="factor-social-links">
                                    {f.links?.map(l => (
                                        l === 'LinkedIn' ? <Linkedin key={l} size={12} className="icon-linkedin" /> : <Github key={l} size={12} className="icon-github" />
                                    ))}
                                </div>
                            </div>
                            <div className="factor-score-display">
                                <span className="score-val">{f.score}</span>
                                <span className="score-max">/{f.max}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Items */}
            <div className="brand-actions-section">
                <h4 className="subsection-title">
                    <Lightbulb size={14} /> Build Your Influence
                </h4>
                <div className="recommendation-list">
                    {recommendations.map((rec, i) => (
                        <div key={i} className="recommendation-card-item">
                            <div className={`rec-icon-box ${rec.type === 'urgent' ? 'icon-urgent' : 'icon-active'}`}>
                                <Zap size={16} fill="currentColor" />
                            </div>
                            <div className="rec-content-box">
                                <p className="rec-text-desc">{rec.text}</p>
                                <div className="rec-action-hint">
                                    Fix Now <ArrowUpRight size={12} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandScoreCard;
