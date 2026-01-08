import React, { useState } from 'react';
import {
    ArrowLeftRight,
    ChevronDown,
    Zap,
    Trophy,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import type { Resume } from '../../types';

interface CVComparisonToolProps {
    resumes: Resume[];
}

const CVComparisonTool: React.FC<CVComparisonToolProps> = ({ resumes }) => {
    const [cvA, setCvA] = useState<string>(resumes[0]?.id || '');
    const [cvB, setCvB] = useState<string>(resumes[1]?.id || resumes[0]?.id || '');

    const metricFields = [
        { label: 'Skills Coverage', key: 'skills' },
        { label: 'Exp Years', key: 'exp' },
        { label: 'ATS Score', key: 'ats' },
        { label: 'Readability', key: 'readability' },
    ];

    const mockData: Record<string, any> = {
        [cvA]: { skills: 18, exp: 5.5, ats: 82, readability: 'High', name: resumes.find(r => r.id === cvA)?.versionName || 'Version A' },
        [cvB]: { skills: 24, exp: 5.5, ats: 94, readability: 'Good', name: resumes.find(r => r.id === cvB)?.versionName || 'Version B' },
    };

    const getWinner = (field: string) => {
        const valA = mockData[cvA][field];
        const valB = mockData[cvB][field];
        if (typeof valA === 'number') return valA > valB ? cvA : cvB;
        return valB; // Simplified
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <ArrowLeftRight className="text-primary" size={20} />
                    CV Version Comparison
                </h3>
                <p className="text-xs text-gray-500 italic">Side-by-side performance analysis.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {[{ val: cvA, set: setCvA }, { val: cvB, set: setCvB }].map((item, idx) => (
                    <div key={idx} className="relative">
                        <select
                            value={item.val}
                            onChange={e => item.set(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold appearance-none outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            {resumes.map(r => (
                                <option key={r.id} value={r.id}>{r.versionName || r.originalFileName}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                ))}
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Metric</th>
                            <th className="px-4 py-3 text-center font-black text-gray-900 border-b border-gray-100">{mockData[cvA].name}</th>
                            <th className="px-4 py-3 text-center font-black text-gray-900 border-b border-gray-100">{mockData[cvB].name}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metricFields.map((field, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3 font-bold text-gray-500 border-b border-gray-50">{field.label}</td>
                                <td className={`px-4 py-3 text-center border-b border-gray-50 ${getWinner(field.key) === cvA ? 'text-success font-black' : 'text-gray-900 font-medium'}`}>
                                    {mockData[cvA][field.key]}{typeof mockData[cvA][field.key] === 'number' && field.key === 'ats' ? '%' : ''}
                                </td>
                                <td className={`px-4 py-3 text-center border-b border-gray-50 ${getWinner(field.key) === cvB ? 'text-success font-black' : 'text-gray-900 font-medium'}`}>
                                    {mockData[cvB][field.key]}{typeof mockData[cvB][field.key] === 'number' && field.key === 'ats' ? '%' : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Strategic Recommendation */}
            <div className="p-5 bg-gradient-to-br from-primary/5 to-indigo-50/50 rounded-2xl border border-primary/10 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary">
                    <Sparkles size={16} fill="currentColor" />
                    <h4 className="text-xs font-black uppercase tracking-tight">AI Strategy Recommendation</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed italic">
                    "Use <span className="font-bold text-gray-900">{mockData[cvB].name}</span> for high-growth startups targeting <span className="font-bold">Next.js/TS</span>. Use <span className="font-bold text-gray-900">{mockData[cvA].name}</span> for larger enterprises where <span className="font-bold">experience longevity</span> is prioritized."
                </p>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase text-primary hover:gap-3 transition-all mt-1">
                    Apply Recommendation Strategy <ArrowRight size={14} />
                </button>
            </div>

            <div className="flex gap-3">
                <button className="flex-1 btn btn-secondary text-[10px] font-black uppercase py-3">
                    <Trophy size={14} className="text-warning" /> Mark as Winner
                </button>
                <button className="flex-1 btn btn-primary text-[10px] font-black uppercase py-3">
                    <Zap size={14} fill="currentColor" /> Auto-Merge Best
                </button>
            </div>
        </div>
    );
};

export default CVComparisonTool;
