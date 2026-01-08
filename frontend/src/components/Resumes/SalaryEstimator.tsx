import React from 'react';
import {
    DollarSign,
    TrendingUp,
    ChevronRight,
    Target,
    Zap
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const SalaryEstimator: React.FC = () => {
    const data = [
        { range: 'Entry', min: 75, avg: 92, max: 110 },
        { range: 'Mid', min: 115, avg: 140, max: 165 },
        { range: 'Senior', min: 160, avg: 195, max: 240 },
        { range: 'Staff', min: 210, avg: 260, max: 350 },
    ];

    const factors = [
        { label: 'Core Tech Stack', impact: '+15%', description: 'React/Next.js and TypeScript are highly valued.' },
        { label: 'Years of Experience', impact: '+22%', description: 'Based on your 5.5 years of verifiable seniority.' },
        { label: 'Location (Remote)', impact: '-5%', description: 'Adjusted for global remote market rates.' },
        { label: 'Education', impact: '+8%', description: 'Masters degree premium applied.' },
    ];

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <DollarSign className="text-primary" size={20} />
                    Market Salary Estimator
                </h3>
                <p className="text-xs text-gray-500">Based on your CV's skill density and experience level.</p>
            </div>

            {/* Chart Viz */}
            <div className="h-[250px] w-full bg-white p-4 rounded-2xl border border-gray-50 shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="range" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                        <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}k`} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f3f4f6' }}
                        />
                        <Bar dataKey="avg" fill="#1E40AF" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Min</span>
                    <span className="text-lg font-black text-gray-900">$160k</span>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex flex-col items-center ring-2 ring-primary/20">
                    <span className="text-[10px] font-black text-primary uppercase">Average</span>
                    <span className="text-lg font-black text-primary">$195k</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Max</span>
                    <span className="text-lg font-black text-gray-900">$240k</span>
                </div>
            </div>

            {/* Factors */}
            <div className="flex flex-col gap-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={14} /> Salary Multipliers
                </h4>
                <div className="flex flex-col gap-2">
                    {factors.map((f, i) => (
                        <div key={i} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-start justify-between shadow-sm hover:border-primary/30 transition-colors">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-bold text-gray-900">{f.label}</span>
                                <p className="text-[11px] text-gray-500 leading-tight">{f.description}</p>
                            </div>
                            <span className={`text-xs font-black ${f.impact.startsWith('+') ? 'text-success' : 'text-error'}`}>
                                {f.impact}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <button className="btn btn-primary w-full shadow-lg shadow-primary/20">
                <Target size={18} fill="currentColor" />
                Negotiation Script Generator
                <ChevronRight size={16} className="ml-auto" />
            </button>

            <div className="p-4 bg-warning-light/20 rounded-xl border border-warning/10 flex items-start gap-3">
                <Zap className="text-warning mt-0.5" size={16} fill="currentColor" />
                <p className="text-[11px] text-warning-dark leading-relaxed font-medium">
                    Pro Tip: Mentioning "Scale" and "Architecture" in your intro can increase your offer by 12%.
                </p>
            </div>
        </div>
    );
};

export default SalaryEstimator;
