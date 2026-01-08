import React, { useState } from 'react';
import {
    CheckCircle,
    AlertCircle,
    HelpCircle,
    Zap,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Loader2,
    CheckCircle2
} from 'lucide-react';

interface Improvement {
    id: string;
    category: 'critical' | 'medium' | 'good';
    title: string;
    description: string;
    example: string;
}

interface CVImprovementPanelProps {
    cvText: string;
}

const CVImprovementPanel: React.FC<CVImprovementPanelProps> = ({ cvText }) => {
    const [loading, setLoading] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const improvements: Improvement[] = [
        {
            id: '1',
            category: 'critical',
            title: 'Quantify Achievements',
            description: 'Your bullet points focus on responsibilities rather than results. Adding metrics (%, $) can increase interview callbacks by 40%.',
            example: 'Before: "Responsible for team management." | After: "Managed a team of 15 devs, reducing sprint cycle time by 22% and improving deployment frequency by 3x."'
        },
        {
            id: '2',
            category: 'medium',
            title: 'Strategic Header',
            description: 'Your current header is generic. Include a target role title to pass ATS filters faster.',
            example: 'Senior React Developer | Specialized in Scalable SaaS Architectures'
        },
        {
            id: '3',
            category: 'good',
            title: 'Skill Hierarchy',
            description: 'Your tech stack is well-organized, making it easy for recruiters to scan.',
            example: 'Current layout is optimal.'
        }
    ];

    const runAnalysis = async () => {
        setLoading(true);
        // Use cvText in real implementation
        console.log('Analyzing CV text length:', cvText.length);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Zap className="text-warning" size={20} fill="currentColor" />
                    AI Improvement Panel
                </h3>
                <p className="text-xs text-gray-500 italic">Strategic suggestions to boost your CV's impact.</p>
            </div>

            <div className="flex flex-col gap-3">
                {improvements.map((item) => (
                    <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer group ${expandedId === item.id ? 'bg-white border-primary shadow-lg ring-1 ring-primary/10' : 'bg-gray-50 border-gray-100 hover:border-gray-300'
                            }`}
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg ${item.category === 'critical' ? 'bg-error-light text-error' :
                                        item.category === 'medium' ? 'bg-warning-light text-warning-dark' :
                                            'bg-success-light text-success'
                                    }`}>
                                    {item.category === 'critical' ? <AlertCircle size={16} /> :
                                        item.category === 'medium' ? <HelpCircle size={16} /> :
                                            <CheckCircle size={16} />}
                                </div>
                                <span className="text-sm font-bold text-gray-900">{item.title}</span>
                            </div>
                            <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                                {expandedId === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                        </div>

                        {expandedId === item.id && (
                            <div className="mt-4 flex flex-col gap-4 animate-scale-in">
                                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                    {item.description}
                                </p>
                                <div className="bg-gray-900 text-white p-4 rounded-xl relative overflow-hidden">
                                    <div className="text-[10px] font-black text-gray-500 uppercase mb-2 flex items-center gap-2">
                                        <Sparkles size={10} className="text-primary" /> Expert Example
                                    </div>
                                    <p className="text-[11px] font-medium leading-relaxed italic pr-8">
                                        "{item.example}"
                                    </p>
                                    <CheckCircle2 size={40} className="absolute -bottom-2 -right-2 text-white/5" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={runAnalysis}
                disabled={loading}
                className="btn btn-primary w-full shadow-lg shadow-primary/20 py-4"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                Generate Improved Content
            </button>
        </div>
    );
};

export default CVImprovementPanel;
