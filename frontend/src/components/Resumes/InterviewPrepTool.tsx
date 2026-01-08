import React, { useState } from 'react';
import {
    BrainCircuit,
    Sparkles,
    CheckCircle2,
    Download,
    Loader2,
    Zap,
    Star,
    Zap as Flash
} from 'lucide-react';

const InterviewPrepTool: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [prepData, setPrepData] = useState<any | null>(null);

    const generatePrep = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        setPrepData({
            behavioral: [
                { q: "Tell me about a time you solved a complex technical bug.", tip: "Use the STAR method, focusing on your specific debug process." },
                { q: "How do you handle conflict in a dev team?", tip: "Highlight your communication and empathy skills." }
            ],
            technical: ["Explain Event Loop in JS", "React Server Components vs SSR", "How do you optimize Web Vitals?"],
            company: ["Recent Series C funding: Mention scalability", "Expansion to AI: Show your interest in ML/AI integration"]
        });
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <BrainCircuit className="text-primary" size={20} />
                    AI Interview Preparation
                </h3>
                <p className="text-xs text-gray-500 italic">Generate a custom prep kit for your target role.</p>
            </div>

            {!prepData ? (
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg shadow-primary/10">
                        <Flash className="text-primary animate-pulse" size={32} fill="currentColor" />
                    </div>
                    <div>
                        <h4 className="font-black text-sm text-gray-900 uppercase tracking-tight">Ready to Ace the Interview?</h4>
                        <p className="text-xs text-gray-500 mt-1 max-w-[240px]">We'll analyze your CV and the target company to build your study guide.</p>
                    </div>
                    <button
                        onClick={generatePrep}
                        disabled={loading}
                        className="btn btn-primary w-full mt-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
                        Generate Preparation Kit
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-6 animate-scale-in">
                    {/* Behavioral */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <Star size={14} fill="currentColor" /> Behavioral Drill
                        </h4>
                        <div className="flex flex-col gap-2">
                            {prepData.behavioral.map((b: any, i: number) => (
                                <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col gap-2">
                                    <p className="text-xs font-bold text-gray-900 leading-relaxed">"{b.q}"</p>
                                    <div className="p-2 bg-success-light/30 rounded-lg text-[10px] text-success font-medium italic">
                                        Expert Tip: {b.tip}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Technical */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={14} fill="currentColor" /> Technical Focus
                        </h4>
                        <div className="flex flex-col gap-2">
                            {prepData.technical.map((t: string, i: number) => (
                                <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between group cursor-pointer hover:bg-white transition-colors">
                                    <span className="text-xs font-bold text-gray-700">{t}</span>
                                    <CheckCircle2 size={14} className="text-gray-300 group-hover:text-success" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="btn btn-secondary w-full py-4 text-xs font-black uppercase">
                        <Download size={18} /> Download Full Prep Guide
                    </button>
                </div>
            )}
        </div>
    );
};

export default InterviewPrepTool;
