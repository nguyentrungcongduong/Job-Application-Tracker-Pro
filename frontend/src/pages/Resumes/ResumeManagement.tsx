import { useState, useEffect, useRef } from 'react';
import {
    Upload, FileText, Star, TrendingUp, Clock, Eye, MoreVertical, Plus, Sparkles,
    CheckCircle, Loader2, AlertCircle, Edit2, Trash2, Zap,
    Shield, LayoutGrid
} from 'lucide-react';
import axiosInstance from '../../api/axios';
import { API_ENDPOINTS } from '../../constants';
import type { Resume, ParsingStatus } from '../../types';
import './ResumeManagement.css';

// New Feature Components
import CVImprovementPanel from '../../components/Resumes/CVImprovementPanel';
import SkillsGapAnalyzer from '../../components/Resumes/SkillsGapAnalyzer';
import CVComparisonTool from '../../components/Resumes/CVComparisonTool';
import ATSOptimizer from '../../components/Resumes/ATSOptimizer';
import CareerTimelineViz from '../../components/Resumes/CareerTimelineViz';
import BrandScoreCard from '../../components/Resumes/BrandScoreCard';

const ResumeManagement = () => {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
    const [editingResume, setEditingResume] = useState<Resume | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ... rest of state ...
    const [versionName, setVersionName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [primaryResumeId, setPrimaryResumeId] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [activeInsightTab, setActiveInsightTab] = useState<'ANALYZE' | 'STRATEGY'>('ANALYZE');

    useEffect(() => {
        const loadPdf = async () => {
            if (selectedResume) {
                setLoadingPdf(true);
                try {
                    const pdfRes = await axiosInstance.get(`/resumes/${selectedResume.id}/file`, { responseType: 'blob' });

                    const url = URL.createObjectURL(pdfRes.data);
                    setPdfUrl(url);
                } catch (err) {
                    console.error('Error loading resume details:', err);
                } finally {
                    setLoadingPdf(false);
                }
            } else {
                if (pdfUrl) {
                    URL.revokeObjectURL(pdfUrl);
                    setPdfUrl(null);
                }
            }
        };

        loadPdf();
    }, [selectedResume]);

    useEffect(() => {
        fetchResumes();

        // Poll for updates if any resume is processing
        const interval = setInterval(() => {
            setResumes(current => {
                const hasProcessing = current.some(r => r.parsingStatus === 'ANALYZING' || r.parsingStatus === 'UPLOADED');
                if (hasProcessing) {
                    // Use a functional update or a ref to avoid stale closures if needed, 
                    // but calling fetchResumes directly is fine if it doesn't rely on stale local state.
                    fetchResumes(true);
                }
                return current;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [primaryResumeId]); // Re-subscribe if primary changes to keep fetchResumes fresh or use a ref

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchResumes = async (silent = false) => {
        if (!silent) setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.get<Resume[]>(API_ENDPOINTS.RESUMES);
            const data = Array.isArray(res.data) ? res.data : [];
            setResumes(data);

            // Sync primaryResumeId with backend state
            const primary = data.find(r => r.isPrimary);
            if (primary) {
                setPrimaryResumeId(primary.id);
            } else if (!primaryResumeId && data.length > 0) {
                // Fallback for legacy data or first load
                setPrimaryResumeId(data[0].id);
            }
        } catch (err: any) {
            console.error('Fetch resumes failed:', err);
            setError(err.response?.data?.message || 'Failed to fetch resumes. Please try again later.');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            if (!versionName) {
                const name = e.target.files[0].name.replace(/\.[^/.]+$/, "");
                setVersionName(name);
            }
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !versionName) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('versionName', versionName);

        try {
            await axiosInstance.post(API_ENDPOINTS.RESUMES, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShowUploadModal(false);
            setVersionName('');
            setSelectedFile(null);
            fetchResumes();
        } catch (err) {
            console.error('Upload failed', err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (resume: Resume) => {
        setEditingResume(resume);
        setVersionName(resume.versionName || resume.fileName);
        setOpenDropdown(null);
    };

    const handleUpdateResume = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingResume || !versionName) return;

        try {
            const formData = new FormData();
            formData.append('versionName', versionName);

            await axiosInstance.patch(`${API_ENDPOINTS.RESUMES}/${editingResume.id}?versionName=${encodeURIComponent(versionName)}`);

            // Update local state
            setResumes(prev => prev.map(r =>
                r.id === editingResume.id
                    ? { ...r, versionName }
                    : r
            ));
            setEditingResume(null);
            setVersionName('');
        } catch (err) {
            console.error('Update failed', err);
            alert('Update failed: ' + (err as any).message);
        }
    };

    const handleDownload = async (resume: Resume) => {
        try {
            const response = await axiosInstance.get(`/resumes/${resume.id}/file`, {
                responseType: 'blob'
            });
            const url = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', resume.originalFileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
            setError('Failed to download CV. Please try again later.');
        }
    };

    const handleDelete = async (resume: Resume) => {
        if (!confirm(`Are you sure you want to delete "${resume.versionName || resume.fileName}"?`)) {
            return;
        }

        try {
            await axiosInstance.delete(`${API_ENDPOINTS.RESUMES}/${resume.id}`);
            setResumes(prev => prev.filter(r => r.id !== resume.id));
            setOpenDropdown(null);
        } catch (err) {
            console.error('Delete failed', err);
            alert('Delete failed: ' + (err as any).message);
        }
    };

    const toggleDropdown = (e: React.MouseEvent, resumeId: string) => {
        e.stopPropagation();
        setOpenDropdown(openDropdown === resumeId ? null : resumeId);
    };

    const handleSetPrimary = async (resumeId: string) => {
        try {
            await axiosInstance.put(`${API_ENDPOINTS.RESUMES}/${resumeId}/primary`);
            setPrimaryResumeId(resumeId);
            setResumes(prev => prev.map(r => ({
                ...r,
                isPrimary: r.id === resumeId
            })));
            setOpenDropdown(null);
        } catch (err) {
            console.error('Failed to set primary CV:', err);
            alert('Failed to set primary CV');
        }
    };

    const getStatusIcon = (status: ParsingStatus) => {
        switch (status) {
            case 'READY': return <CheckCircle size={16} className="text-success" />;
            case 'NEEDS_REVIEW': return <AlertCircle size={16} className="text-warning" />;
            case 'ANALYZING': return <Loader2 size={16} className="animate-spin text-info" />;
            case 'UPLOADED': return <Clock size={16} className="text-warning" />;
            case 'FAILED': return <AlertCircle size={16} className="text-error" />;
        }
    };

    const getSkillBadges = (skills: string | undefined) => {
        if (!skills) return [];
        return skills.split(',').slice(0, 5).map(s => s.trim());
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="resume-page">
            {/* Header */}
            <div className="resume-header">
                <div className="header-content">
                    <div className="header-title-section">
                        <div className="header-icon-wrapper">
                            <FileText size={28} />
                        </div>
                        <div>
                            <h1 className="page-title">CV Management</h1>
                            <p className="page-subtitle">Manage your strategic career profiles</p>
                        </div>
                    </div>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => setShowUploadModal(true)}
                    >
                        <Plus size={20} />
                        Upload New CV
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="stats-bar">
                <div className="stat-card">
                    <FileText size={20} />
                    <div>
                        <div className="stat-value">{resumes.length}</div>
                        <div className="stat-label">Total CVs</div>
                    </div>
                </div>
                <div className="stat-card">
                    <Star size={20} />
                    <div>
                        <div className="stat-value">
                            {Array.isArray(resumes) ? resumes.filter(r => r.parsingStatus === 'READY' || r.parsingStatus === 'NEEDS_REVIEW').length : 0}
                        </div>
                        <div className="stat-label">Ready to Use</div>
                    </div>
                </div>
                <div className="stat-card">
                    <TrendingUp size={20} />
                    <div>
                        <div className="stat-value">-</div>
                        <div className="stat-label">Avg Match Rate</div>
                    </div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="error-alert animate-fade-in mb-6">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                    <button className="btn-text-sm ml-auto" onClick={() => fetchResumes()}>Retry</button>
                </div>
            )}

            {/* CV Grid */}
            {loading ? (
                <div className="loading-state">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p>Loading your CVs...</p>
                </div>
            ) : resumes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <FileText size={64} />
                    </div>
                    <h3>No CVs uploaded yet</h3>
                    <p>Upload your first CV to get started with strategic job applications</p>
                    <button
                        className="btn btn-primary mt-4"
                        onClick={() => setShowUploadModal(true)}
                    >
                        <Upload size={18} />
                        Upload Your First CV
                    </button>
                </div>
            ) : (
                <div className="cv-grid">
                    {resumes.map(resume => (
                        <div
                            key={resume.id}
                            className={`cv-card ${primaryResumeId === resume.id ? 'primary' : ''}`}
                        >
                            {/* Primary Badge */}
                            {primaryResumeId === resume.id && (
                                <div className="primary-badge">
                                    <Star size={14} fill="currentColor" />
                                    Primary CV
                                </div>
                            )}

                            {/* Card Header */}
                            <div className="cv-card-header">
                                <div className="cv-icon">
                                    <FileText size={32} />
                                </div>
                                <div className="cv-menu-wrapper">
                                    <button
                                        className="btn-menu"
                                        onClick={(e) => toggleDropdown(e, resume.id)}
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    {openDropdown === resume.id && (
                                        <div className="dropdown-menu show">
                                            <button className="dropdown-item" onClick={() => handleEdit(resume)}>
                                                <Edit2 size={14} /> Edit Name
                                            </button>
                                            <button
                                                className="dropdown-item"
                                                onClick={() => handleDownload(resume)}
                                            >
                                                <Upload size={14} className="rotate-180" />
                                                Download CV
                                            </button>
                                            <button
                                                className="dropdown-item"
                                                onClick={() => handleSetPrimary(resume.id)}
                                                disabled={resume.isPrimary}
                                            >
                                                <Star size={14} className={resume.isPrimary ? "text-primary" : ""} />
                                                {resume.isPrimary ? "Primary Profile" : "Set as Primary"}
                                            </button>
                                            <div className="dropdown-divider"></div>
                                            <button className="dropdown-item text-error" onClick={() => handleDelete(resume)}>
                                                <Trash2 size={14} /> Delete Version
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CV Info */}
                            <div className="cv-info">
                                <h3 className="cv-title">{resume.versionName || resume.fileName}</h3>
                                <p className="cv-filename">{resume.originalFileName}</p>
                            </div>

                            {/* Status */}
                            <div className="cv-status">
                                {getStatusIcon(resume.parsingStatus)}
                                <span className="status-text">{resume.parsingStatus}</span>
                            </div>

                            {/* Skills */}
                            {(resume.parsingStatus === 'READY' || resume.parsingStatus === 'NEEDS_REVIEW') && (
                                <div className="cv-skills">
                                    <div className="skills-label">
                                        <Sparkles size={14} />
                                        Top Skills
                                    </div>
                                    <div className="skill-badges">
                                        {getSkillBadges(resume.extractedSkills).length > 0 ? (
                                            getSkillBadges(resume.extractedSkills).map((skill, i) => (
                                                <span key={i} className="skill-badge">{skill}</span>
                                            ))
                                        ) : (
                                            <span className="text-muted">No skills detected</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Metrics */}
                            <div className="cv-metrics">
                                <div className="metric">
                                    <TrendingUp size={14} />
                                    <span>Used {(resume as any).usageCount || 0} times</span>
                                </div>
                                <div className="metric">
                                    <Clock size={14} />
                                    <span>Uploaded {formatDate(resume.createdAt)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="cv-actions">
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setSelectedResume(resume)}
                                >
                                    <Eye size={16} />
                                    View
                                </button>
                                {primaryResumeId !== resume.id && (
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => setPrimaryResumeId(resume.id)}
                                    >
                                        <Star size={16} />
                                        Set Primary
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* CV Viewer Modal */}
            {selectedResume && (
                <div className="modal-overlay" onClick={() => setSelectedResume(null)}>
                    <div className="modal-content cv-viewer-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2>{selectedResume.versionName || selectedResume.fileName}</h2>
                                <p className="cv-viewer-subtitle">{selectedResume.originalFileName}</p>
                            </div>
                            <div className="modal-header-actions">
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => handleDownload(selectedResume)}
                                    title="Download CV"
                                >
                                    <Upload size={18} className="rotate-180" />
                                    <span>Download</span>
                                </button>
                                <button className="btn-close" onClick={() => setSelectedResume(null)}>×</button>
                            </div>
                        </div>

                        <div className="cv-viewer-content">
                            {/* Left: PDF Preview */}
                            <div className="cv-preview-section">
                                {loadingPdf ? (
                                    <div className="pdf-loading">
                                        <Loader2 className="animate-spin" size={32} />
                                        <p>Loading CV Preview...</p>
                                    </div>
                                ) : pdfUrl ? (
                                    <iframe
                                        src={pdfUrl}
                                        title="CV Preview"
                                        className="pdf-frame"
                                    />
                                ) : (
                                    <div className="pdf-fallback">
                                        <FileText size={48} />
                                        <p>PDF Preview</p>
                                        <p className="text-muted">File: {selectedResume.originalFileName}</p>
                                        <button
                                            onClick={() => handleDownload(selectedResume)}
                                            className="btn btn-primary btn-sm mt-3"
                                        >
                                            Download CV
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Right: Insights */}
                            <div className="cv-insights-section">
                                {/* Insight Tabs */}
                                <div className="insight-tabs">
                                    <button
                                        className={`insight-tab ${activeInsightTab === 'ANALYZE' ? 'active' : ''}`}
                                        onClick={() => setActiveInsightTab('ANALYZE')}
                                    >
                                        <Sparkles size={16} /> Analyze
                                    </button>
                                    <button
                                        className={`insight-tab ${activeInsightTab === 'STRATEGY' ? 'active' : ''}`}
                                        onClick={() => setActiveInsightTab('STRATEGY')}
                                    >
                                        <LayoutGrid size={16} /> Strategy
                                    </button>
                                </div>

                                <div className="insight-tab-content">
                                    {activeInsightTab === 'ANALYZE' && (
                                        <div className="analysis-grid-container animate-fade-in">
                                            {/* Brand Score Card First */}
                                            <BrandScoreCard />

                                            <CVImprovementPanel cvText={selectedResume.parsedContent || ''} />

                                            <SkillsGapAnalyzer cvSkills={selectedResume.extractedSkills?.split(',') || []} />

                                            <div className="analysis-grid">
                                                {/* AI Quality Score (Existing) */}
                                                {(selectedResume.parsingStatus === 'READY' || selectedResume.parsingStatus === 'NEEDS_REVIEW') && (
                                                    <div className="insight-card smart-insights">
                                                        <div className="insight-header">
                                                            <Zap size={20} className="text-warning" />
                                                            <h3>Quality Score</h3>
                                                        </div>
                                                        <div className="quality-score-section-mini">
                                                            <div className="score-circle-wrapper-mini">
                                                                <div className={`score-circle score-${Math.floor((selectedResume.qualityScore || 0) / 10)}`}>
                                                                    <svg viewBox="0 0 36 36" className="circular-chart">
                                                                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                                        <path className="circle" strokeDasharray={`${selectedResume.qualityScore || 0}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                                        <text x="18" y="20.35" className="percentage">{selectedResume.qualityScore || 0}%</text>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="score-details-mini">
                                                                <div className="ats-compatibility-mini">
                                                                    <Shield size={16} />
                                                                    <strong className={`ats-status ${selectedResume.atsCompatibility?.toLowerCase()}`}>
                                                                        {selectedResume.atsCompatibility || 'MEDIUM'}
                                                                    </strong>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Skills Detected */}
                                                <div className="insight-card">
                                                    <div className="insight-header">
                                                        <Sparkles size={20} />
                                                        <h3>Key Skills</h3>
                                                    </div>
                                                    <div className="skills-scroll-area custom-scrollbar">
                                                        {!selectedResume.extractedSkills ? (
                                                            <p className="no-skills-text">No skills identified yet.</p>
                                                        ) : (
                                                            <div className="skill-badges">
                                                                {getSkillBadges(selectedResume.extractedSkills).map((skill, i) => (
                                                                    <span key={i} className="skill-badge">{skill}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeInsightTab === 'STRATEGY' && (
                                        <div className="strategy-tab-container animate-fade-in">
                                            <CVComparisonTool resumes={resumes} />
                                            <div className="divider"></div>
                                            <CareerTimelineViz />
                                            <div className="divider"></div>
                                            <ATSOptimizer cvText={selectedResume.parsedContent || ''} />
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
                    <div className="modal-content upload-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Upload New CV</h2>
                            <button className="btn-close" onClick={() => setShowUploadModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleUpload} className="upload-form">
                            {/* Drag & Drop Zone */}
                            <div
                                className={`upload-dropzone ${selectedFile ? 'has-file' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                />

                                {selectedFile ? (
                                    <div className="file-selected">
                                        <CheckCircle size={48} className="text-success" />
                                        <p className="file-name">{selectedFile.name}</p>
                                        <p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm mt-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFile(null);
                                            }}
                                        >
                                            Change File
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={48} className="upload-icon" />
                                        <p className="upload-text">Drag & Drop your PDF here</p>
                                        <p className="upload-subtext">or click to browse</p>
                                        <span className="upload-hint">PDF up to 10MB</span>
                                    </>
                                )}
                            </div>

                            {/* Version Name */}
                            <div className="form-group">
                                <label>CV Version Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g. Backend Specialist v2.0"
                                    value={versionName}
                                    onChange={e => setVersionName(e.target.value)}
                                    required
                                />
                                <p className="input-hint">Give this CV a meaningful name to identify its purpose</p>
                            </div>

                            {/* Actions */}
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setShowUploadModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={uploading || !selectedFile}
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} />
                                            Upload & Analyze
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit CV Modal */}
            {editingResume && (
                <div className="modal-overlay" onClick={() => setEditingResume(null)}>
                    <div className="modal-content upload-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit CV Name</h2>
                            <button className="btn-close" onClick={() => setEditingResume(null)}>×</button>
                        </div>

                        <form onSubmit={handleUpdateResume} className="upload-form">
                            <div className="form-group">
                                <label>CV Version Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g. Backend Specialist v2.0"
                                    value={versionName}
                                    onChange={e => setVersionName(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <p className="input-hint">Update the name to better identify this CV's purpose</p>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setEditingResume(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    <CheckCircle size={16} />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeManagement;
