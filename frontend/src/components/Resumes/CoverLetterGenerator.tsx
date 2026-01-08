import React, { useState } from 'react';
import {
    Wand2,
    Sparkles,
    Download,
    CheckCircle,
    Copy,
    ChevronRight,
    Loader2,
    Save,
    Rocket
} from 'lucide-react';

interface CoverLetterGeneratorProps {
    cvText: string;
}

const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ cvText }) => {
    const [jd, setJd] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [tone, setTone] = useState('Professional');

    const generateLetter = async () => {
        if (!jd) return;
        setLoading(true);
        // Use cvText in real implementation
        console.log('Generating letter from CV content length:', cvText.length);
        await new Promise(resolve => setTimeout(resolve, 2500));
        setGeneratedLetter(`Dear Hiring Manager,

I am writing to express my strong interest in the [Role] position at [Company]. With over 5 years of experience in frontend development and a proven track record of leading high-performance teams, I am confident that I can bring significant value to your organization.

In my previous role, I successfully implemented micro-frontend architectures that improved deployment speed by 40%. My expertise in React, TypeScript, and AWS aligns perfectly with your requirements for this position.

I look forward to discussing how my background can benefit your team.

Sincerely,
[Your Name]`);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Wand2 className="text-primary" size={20} />
                    AI Cover Letter Generator
                </h3>
                <p className="text-xs text-gray-500 italic">Generate a high-conversion letter in seconds.</p>
            </div>

            {!generatedLetter ? (
                <div className="flex flex-col gap-4">
                    <textarea
                        className="input min-h-[120px] text-sm"
                        placeholder="Paste Job Description here..."
                        value={jd}
                        onChange={e => setJd(e.target.value)}
                    />
                    <div className="flex gap-2">
                        {['Professional', 'Enthusiastic', 'Casual'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTone(t)}
                                className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase border transition-all ${tone === t ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-100 hover:border-primary/30'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={generateLetter}
                        disabled={!jd || loading}
                        className="btn btn-primary w-full"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} fill="currentColor" />}
                        Generate Magic Letter
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4 animate-scale-in">
                    <div className="relative group">
                        <textarea
                            className="input min-h-[300px] text-xs leading-relaxed bg-gray-50 p-6"
                            value={generatedLetter}
                            onChange={e => setGeneratedLetter(e.target.value)}
                        />
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:text-primary"><Copy size={14} /></button>
                            <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:text-primary"><Download size={14} /></button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 btn btn-secondary text-xs uppercase font-black py-4">
                            <Save size={16} /> Save to App
                        </button>
                        <button className="flex-1 btn btn-primary text-xs uppercase font-black py-4 bg-gradient-to-r from-primary to-indigo-600">
                            <Rocket size={16} fill="currentColor" /> Quick Apply Now
                        </button>
                    </div>

                    <button onClick={() => setGeneratedLetter('')} className="text-[10px] font-black text-gray-400 uppercase flex items-center justify-center gap-1 hover:text-primary">
                        <CheckCircle size={12} /> Start Over with different JD
                        <ChevronRight size={12} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CoverLetterGenerator;
