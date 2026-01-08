import React from 'react';
import {
    Briefcase,
    TrendingUp,
    Clock,
    Star,
    ExternalLink,
    Award
} from 'lucide-react';

interface Experience {
    company: string;
    role: string;
    duration: string;
    logo: string;
    skills: string[];
    description: string;
    isGap?: boolean;
}

const CareerTimelineViz: React.FC = () => {
    const experiences: Experience[] = [
        {
            company: 'TechVibes Corp',
            role: 'Senior Frontend Engineer',
            duration: '2022 - Present',
            logo: '',
            skills: ['React', 'Next.js', 'System Design'],
            description: 'Led a team of 10+ devs in building a globally scalable SaaS platform.'
        },
        {
            company: 'Career Gap',
            role: 'Upskilling & Personal Projects',
            duration: '2021 - 2022 (6 months)',
            logo: '',
            skills: ['Docker', 'AWS', 'Python'],
            description: 'Focused on Cloud Architecture and backend fundamentals.',
            isGap: true
        },
        {
            company: 'InnoSystems',
            role: 'Web Developer',
            duration: '2019 - 2021',
            logo: '',
            skills: ['Vue.js', 'Node.js', 'SQL'],
            description: 'Developed and maintained 50+ client websites.'
        },
        {
            company: 'StartUp Hub',
            role: 'Junior Dev',
            duration: '2018 - 2019',
            logo: '',
            skills: ['JS', 'HTML', 'CSS'],
            description: 'Entry-level role focused on UI implementation.'
        }
    ];

    return (
        <div className="career-timeline-container animate-fade-in">
            <div className="section-header">
                <h3 className="section-title">
                    <TrendingUp className="text-primary" size={20} />
                    Strategic Career Timeline
                </h3>
                <p className="section-subtitle">Visualized growth trajectory and skill evolution.</p>
            </div>

            <div className="timeline-track">
                {experiences.map((exp, idx) => (
                    <div key={idx} className="timeline-item">
                        {/* Timeline Marker */}
                        <div className={`timeline-marker ${exp.isGap ? 'marker-gap' : 'marker-primary'}`} />

                        {/* Content Card */}
                        <div className={`timeline-card ${exp.isGap ? 'card-gap' : 'card-standard'}`}>
                            <div className="card-header-flex">
                                <div className="company-info-row">
                                    {exp.logo ? (
                                        <img src={exp.logo} alt={exp.company} className="company-logo" />
                                    ) : (
                                        <div className="company-logo-placeholder">
                                            {exp.isGap ? <Clock size={20} /> : <Briefcase size={20} />}
                                        </div>
                                    )}
                                    <div className="company-details">
                                        <h4 className="company-name">{exp.company}</h4>
                                        <p className="role-name">{exp.role}</p>
                                    </div>
                                </div>
                                <span className="duration-badge">
                                    {exp.duration}
                                </span>
                            </div>

                            <p className="experience-desc">
                                "{exp.description}"
                            </p>

                            <div className="skill-tag-list">
                                {exp.skills.map((skill, sIdx) => (
                                    <span key={sIdx} className="skill-tag-mini">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {!exp.isGap && idx === 0 && (
                                <div className="achievement-star">
                                    <div className="star-badge">
                                        <Star size={12} fill="currentColor" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Trajectory Summary */}
            <div className="trajectory-summary-card">
                <div className="summary-header">
                    <div className="header-label-group">
                        <Award className="text-primary-light" size={24} />
                        <h4 className="summary-title">Growth Trajectory</h4>
                    </div>
                    <span className="growth-percent">+150% Responsibility</span>
                </div>
                <p className="summary-text">
                    You've transitioned from <span className="highlight-white">Junior Implementation</span> to <span className="highlight-white">Strategic Technical Leadership</span> over {experiences.length + 1} years.
                </p>
                <button className="export-infographic-btn">
                    Export Infographic <ExternalLink size={14} />
                </button>
            </div>
        </div>
    );
};

export default CareerTimelineViz;
