import React, { useState } from 'react';
import {
    Target,
    ArrowRight,
    AlertCircle,
    ExternalLink,
    BookOpen,
    PieChart
} from 'lucide-react';
import {
    PieChart as RePie,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';

interface SkillsGapAnalyzerProps {
    cvSkills: string[];
}

const SkillsGapAnalyzer: React.FC<SkillsGapAnalyzerProps> = ({ cvSkills }) => {
    const [loading] = useState(false);
    const [marketRole, setMarketRole] = useState('Senior Frontend Engineer');

    const missingSkills = [
        { name: 'GraphQL', importance: 85, learnTime: '2 weeks', resource: 'https://graphql.org/learn' },
        { name: 'Terraform', importance: 60, learnTime: '3 weeks', resource: 'https://learn.hashicorp.com/terraform' },
    ];

    const chartData = [
        { name: 'Match', value: 75, color: '#1E40AF' },
        { name: 'Gap', value: 25, color: '#E1E7FF' },
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Target className="text-primary" size={20} />
                    Market Skills Gap Analysis
                </h3>
                <p className="text-xs text-gray-500">How your CV stacks up against current market demands.</p>
            </div>

            <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-6">
                <div className="w-24 h-24 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <RePie>
                            <Pie
                                data={chartData}
                                innerRadius={30}
                                outerRadius={45}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </RePie>
                    </ResponsiveContainer>
                </div>
                <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Match Percentage</div>
                    <div className="text-3xl font-black text-gray-900">75%</div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-primary">{marketRole}</span>
                        <button
                            onClick={() => setMarketRole('Lead Engineer')}
                            className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors"
                        >
                            <PieChart size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Skills Sections */}
            <div className="space-y-4">
                <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                        Matching Skills ({cvSkills.length})
                        <div className="h-[1px] flex-1 bg-gray-100" />
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                        {cvSkills.slice(0, 8).map((skill, i) => (
                            <span key={i} className="px-3 py-1.5 bg-success-light/30 text-success text-[11px] font-bold rounded-lg border border-success/10">
                                {skill}
                            </span>
                        ))}
                        {cvSkills.length > 8 && <span className="text-[11px] font-bold text-gray-400 self-center ml-2">+{cvSkills.length - 8} more</span>}
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-error uppercase tracking-widest px-1 flex items-center gap-2">
                        Missing Core Skills ({missingSkills.length})
                        <div className="h-[1px] flex-1 bg-error-light/50" />
                    </h4>
                    <div className="flex flex-col gap-2">
                        {missingSkills.map((skill, i) => (
                            <div key={i} className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between group">
                                <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-gray-900">{skill.name}</span>
                                        <AlertCircle size={14} className="text-error" />
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-medium">Market demand: {skill.importance}% • Est. {skill.learnTime} to master</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={skill.resource}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 bg-white rounded-lg border border-gray-100 text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm"
                                    >
                                        <BookOpen size={14} />
                                    </a>
                                    <button className="p-2 bg-white rounded-lg border border-gray-100 text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button className="btn btn-secondary w-full py-4 text-xs font-black uppercase flex items-center justify-center gap-2">
                Build Personalized Learning Path <ExternalLink size={14} />
            </button>
        </div>
    );
};

export default SkillsGapAnalyzer;
