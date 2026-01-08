import React, { useState } from 'react';
import {
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Zap,
    ChevronRight,
    Target,
    Sparkles
} from 'lucide-react';

interface ATSOptimizerProps {
    cvText: string;
}

const ATSOptimizer: React.FC<ATSOptimizerProps> = ({ cvText }) => {
    const [jdText, setJdText] = useState('');
    const [loading, setLoading] = useState(false);
    const [optimized, setOptimized] = useState(false);
    const [score, setScore] = useState(65);

    const keywords = [
        { name: 'GraphQL', status: 'missing', suggestion: 'Add to Skills section' },
        { name: 'Micro-frontends', status: 'missing', suggestion: 'Mention in Lead Developer role' },
        { name: 'React', status: 'matching' },
        { name: 'TypeScript', status: 'matching' },
        { name: 'Unit Testing', status: 'missing', suggestion: 'Include Jest/Enzyme details' },
    ];

    const runAnalysis = async () => {
        if (!jdText) return;
        setLoading(true);
        // Use cvText in real implementation
        console.log('Analyzing against CV text length:', cvText.length);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setOptimized(true);
        setScore(88);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <ShieldCheck className="text-primary" size={20} />
                    ATS Keyword Optimizer
                </h3>
                <p className="text-xs text-gray-500 italic">Scan and optimize your CV for applicant tracking systems.</p>
            </div>

            {!optimized ? (
                <div className="flex flex-col gap-4">
                    <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
                            <Target size={20} />
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                            Paste the Job Description below to compare keywords and calculate your ATS match score.
                        </p>
                    </div>
                    <textarea
                        className="input min-h-[150px] text-sm"
                        placeholder="Paste Job Description..."
                        value={jdText}
                        onChange={e => setJdText(e.target.value)}
                    />
                    <button
                        onClick={runAnalysis}
                        disabled={!jdText || loading}
                        className="btn btn-primary w-full"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
                        Scan Match Score
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-5 animate-scale-in">
                    {/* Score Viz */}
                    <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${score > 80 ? 'border-success' : 'border-warning'} relative`}>
                                <span className="text-sm font-black text-gray-900">{score}%</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">ATS Match Score</h4>
                                <p className="text-xs text-gray-500">Industry benchmark: 80%</p>
                            </div>
                        </div>
                        <button onClick={() => setOptimized(false)} className="text-xs font-bold text-primary hover:underline">Re-scan</button>
                    </div>

                    {/* Keywords List */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={14} /> Keyword Alignment
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {keywords.map((kw, i) => (
                                <div
                                    key={i}
                                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 text-xs font-bold ${kw.status === 'matching'
                                            ? 'bg-success-light/30 border-success/20 text-success'
                                            : 'bg-error-light/30 border-error/20 text-error'
                                        }`}
                                >
                                    {kw.status === 'matching' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                    {kw.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={14} /> Critical Optimizations
                        </h4>
                        <div className="flex flex-col gap-2">
                            {keywords.filter(k => k.status === 'missing').map((kw, i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-2 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-gray-900">{kw.name}</span>
                                        <span className="text-[10px] font-black text-error uppercase">Missing</span>
                                    </div>
                                    <p className="text-xs text-gray-600 italic">"{kw.suggestion}"</p>
                                    <button className="mt-2 text-[10px] font-black uppercase text-primary flex items-center gap-1 hover:gap-2 transition-all">
                                        Generate optimized sentence <ChevronRight size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="btn btn-primary w-full bg-gradient-to-r from-primary to-indigo-600 hover:shadow-lg hover:shadow-primary/20">
                        <Zap size={18} fill="currentColor" />
                        Auto-Optimize Entire CV
                    </button>
                </div>
            )}
        </div>
    );
};

export default ATSOptimizer;
