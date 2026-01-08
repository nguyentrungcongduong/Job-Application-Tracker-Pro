import React, { useState } from 'react';
import {
    X,
    Zap,
    Briefcase,
    Globe,
    CheckCircle2,
    Loader2,
    Sparkles,
    Link as LinkIcon,
    Search,
    Check,
    Target
} from 'lucide-react';
import type { Resume } from '../../types';

interface QuickApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedResume: Resume | null;
    onApply: (data: any) => void;
}

const QuickApplyModal: React.FC<QuickApplyModalProps> = ({
    isOpen,
    onClose,
    selectedResume,
    onApply
}) => {
    const [jdUrl, setJdUrl] = useState('');
    const [fetching, setFetching] = useState(false);
    const [applying, setApplying] = useState(false);
    const [matchScore, setMatchScore] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        company: '',
        position: '',
        location: '',
        salary: '',
    });

    const handleFetch = async () => {
        if (!jdUrl) return;
        setFetching(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setFormData({
            company: 'InnovateTech Solutions',
            position: 'Senior React Developer',
            location: 'New York, NY (Remote)',
            salary: '$160k - $200k',
        });
        setMatchScore(92);
        setFetching(false);
    };

    const handleApply = async () => {
        setApplying(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        onApply({ ...formData, resumeId: selectedResume?.id });
        setApplying(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-8 pb-4 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Quick Apply</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Optimized for {selectedResume?.versionName || 'Current CV'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                    {/* Smart Link Input */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <LinkIcon size={12} /> Job URL / Posting Link
                        </label>
                        <div className="relative flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="https://linkedin.com/jobs/..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                    value={jdUrl}
                                    onChange={e => setJdUrl(e.target.value)}
                                />
                                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                            <button
                                onClick={handleFetch}
                                disabled={!jdUrl || fetching}
                                className="px-6 bg-gray-900 text-white font-black uppercase text-[10px] rounded-xl hover:bg-black transition-all disabled:opacity-50"
                            >
                                {fetching ? <Loader2 size={16} className="animate-spin" /> : 'Fetch Details'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Briefcase size={12} /> Company
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-bold"
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Search size={12} /> Position
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-bold"
                                value={formData.position}
                                onChange={e => setFormData({ ...formData, position: e.target.value })}
                            />
                        </div>
                    </div>

                    {matchScore && (
                        <div className="p-6 bg-success-light/10 border border-success/10 rounded-3xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-success/20 flex items-center justify-center">
                                    <Target className="text-success" size={28} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-900 uppercase">Strategic Match</h4>
                                    <p className="text-xs text-success font-bold">Your CV is {matchScore}% compatible</p>
                                </div>
                            </div>
                            <div className="px-4 py-1 bg-success text-white text-[10px] font-black uppercase rounded-full">
                                High Fit
                            </div>
                        </div>
                    )}

                    <div className="p-6 bg-primary-50 rounded-3xl border border-primary-100/50">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="text-primary" size={18} />
                            <h4 className="text-xs font-black text-gray-900 uppercase">AI Quick Prep</h4>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                <div className="p-1 bg-white rounded-full shadow-sm text-primary"><Check size={10} strokeWidth={4} /></div>
                                Syncing Experience: Lead Developer Role
                            </li>
                            <li className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                <div className="p-1 bg-white rounded-full shadow-sm text-primary"><Check size={10} strokeWidth={4} /></div>
                                Highlighting Skills: React, TypeScript, GraphQL
                            </li>
                            <li className="flex items-center gap-3 text-xs text-gray-600 font-medium opacity-50">
                                <div className="p-1 bg-white rounded-full shadow-sm text-primary"><Check size={10} strokeWidth={4} /></div>
                                Optimizing Header for Hiring Managers
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="p-8 pt-4">
                    <button
                        onClick={handleApply}
                        disabled={!formData.company || applying}
                        className="w-full h-16 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-primary/20 transition-all disabled:opacity-50"
                    >
                        {applying ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                <CheckCircle2 size={24} fill="currentColor" />
                                Complete Application
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickApplyModal;
