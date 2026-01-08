import { X, Send, Link as LinkIcon, Building2, UserCircle, Briefcase, DollarSign, MapPin, Tag, FileText, AlertTriangle, Loader2, Sparkles, Bell } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { useApplicationStore } from '../../store';
import { STATUS_CONFIG, SOURCE_CONFIG, PRIORITY_CONFIG, API_ENDPOINTS } from '../../constants';
import { useMemo, useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import type { JobApplication, Resume, CVMatchResult } from '../../types';
import './ApplicationModal.css';

interface ApplicationModalProps {
  onClose: () => void;
}

type ApplicationFormValues = Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'fitScore'>;

const ApplicationModal = ({ onClose }: ApplicationModalProps) => {
  const { addApplication, applications } = useApplicationStore();
  
  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ApplicationFormValues>({
    defaultValues: {
      status: 'APPLIED',
      source: 'LINKEDIN',
      priority: 'MEDIUM',
      appliedDate: new Date().toISOString().split('T')[0],
      tags: []
    }
  });
  
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [matchResults, setMatchResults] = useState<CVMatchResult[]>([]);
  const [showMatchResults, setShowMatchResults] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const selectedCV = watch('cvVersion');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await axiosInstance.get<Resume[]>(API_ENDPOINTS.RESUMES);
        setResumes(data);
      } catch (error) {
        console.error('Failed to fetch resumes', error);
      }
    };
    fetchResumes();
  }, []);

  const handleMatchCVs = async () => {
    const jdText = watch('jdText');
    if (!jdText) return;

    setIsMatching(true);
    try {
        const { data } = await axiosInstance.post<CVMatchResult[]>(API_ENDPOINTS.RESUME_MATCH, { jobDescription: jdText });
        setMatchResults(Array.isArray(data) ? data : []);
        setShowMatchResults(true);
        // Automatically select the best match if available
        if (data.length > 0) {
            setValue('cvVersion', data[0].resumeName);
        }
    } catch (error) {
        console.error('Matching failed', error);
        alert('Failed to analyze CVs');
    } finally {
        setIsMatching(false);
    }
  };


  const companyName = useWatch({ control, name: 'companyName' });
  const position = useWatch({ control, name: 'position' });
  const jdText = useWatch({ control, name: 'jdText' });

  const duplicateWarning = useMemo(() => {
    if (!companyName || !position) return null;
    
    const duplicate = applications.find(app => 
      app.companyName.toLowerCase() === companyName.toLowerCase() && 
      app.position.toLowerCase() === position.toLowerCase()
    );

    if (duplicate) {
      // Format the date nicely
      const date = new Date(duplicate.appliedDate).toLocaleDateString('vi-VN');
      return `Bạn đã apply vị trí này rồi vào ngày ${date}`;
    }
    return null;
  }, [companyName, position, applications]);

  const onSubmit = async (data: ApplicationFormValues) => {
    // Check if we have match results for the selected CV
    const selectedMatchResult = matchResults.find(r => r.resumeName === data.cvVersion);

    const applicationRequest = {
      ...data,
      fitScore: selectedMatchResult ? selectedMatchResult.matchScore : (Math.floor(Math.random() * 40) + 60),
      missingSkills: selectedMatchResult ? selectedMatchResult.missingSkills : [],
      tags: typeof data.tags === 'string' ? (data.tags as string).split(',').map(t => t.trim()) : data.tags
    };
    
    try {
      await addApplication(applicationRequest as any);
      onClose();
    } catch (error) {
      alert('Failed to save application');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card active" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title">
            <div className="header-icon">
              <Briefcase size={20} />
            </div>
            <h2>New Application</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="form-grid">
            {/* Company & Position */}
            <div className="form-section full-width">
              {duplicateWarning && (
                <div className="warning-banner" style={{ 
                  backgroundColor: 'rgba(255, 171, 0, 0.1)', 
                  border: '1px solid rgba(255, 171, 0, 0.3)',
                  color: '#ffab00',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.9rem'
                }}>
                  <AlertTriangle size={18} />
                  <span>{duplicateWarning}</span>
                </div>
              )}
              
              <div className="form-group">
                <label><Building2 size={16} /> Company Name *</label>
                <input 
                  {...register('companyName', { required: 'Company name is required' })}
                  placeholder="e.g. Google, Meta, Stripe"
                  className={errors.companyName ? 'error' : ''}
                />
                {errors.companyName && <span className="error-text">{errors.companyName.message}</span>}
              </div>
              <div className="form-group">
                <label><UserCircle size={16} /> Job Position *</label>
                <input 
                  {...register('position', { required: 'Position is required' })}
                  placeholder="e.g. Senior Frontend Engineer"
                  className={errors.position ? 'error' : ''}
                />
                {errors.position && <span className="error-text">{errors.position.message}</span>}
              </div>
            </div>

            {/* Status & Priority */}
            <div className="form-group">
              <label>Status</label>
              <select {...register('status')}>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Priority</label>
              <select {...register('priority')}>
                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            {/* Date & Source */}
            <div className="form-group">
              <label><MapPin size={16} /> Date Applied</label>
              <input type="date" {...register('appliedDate')} />
            </div>

            <div className="form-group">
              <label>Source</label>
              <select {...register('source')}>
                {Object.entries(SOURCE_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            {/* Salary & Link */}
            <div className="form-group">
              <label><DollarSign size={16} /> Salary Expectation</label>
              <input 
                type="number" 
                {...register('salaryExpectation', { valueAsNumber: true })}
                placeholder="e.g. 150000"
              />
            </div>

            <div className="form-group">
              <label><LinkIcon size={16} /> Job Description Link</label>
              <input 
                {...register('jdLink')} 
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label><Bell size={16} /> Interview Reminder</label>
              <input 
                type="datetime-local" 
                {...register('interviewReminder')} 
              />
            </div>

            {/* Tags & CV */}
            <div className="form-group">
              <label><Tag size={16} /> Tags (comma separated)</label>
              <input 
                {...register('tags' as any)} 
                placeholder="Remote, React, High Salary"
              />
            </div>

            {/* JD Text & Smart Match */}
            <div className="form-group full-width">
              <label><FileText size={16} /> Job Description Text (for Smart Match)</label>
              <textarea 
                {...register('jdText')} 
                placeholder="Paste the Job Description here to find the best CV match..."
                rows={4}
                className="input-textarea"
              />
            </div>

            <div className="form-group full-width">
              <label><FileText size={16} /> CV Version Used</label>
              
              {!showMatchResults ? (
                <div className="cv-selection-simple">
                  <select {...register('cvVersion')} className="input">
                    <option value="">Select a CV Version...</option>
                    {resumes.map(resume => (
                      <option key={resume.id} value={resume.versionName || resume.fileName}>
                        {resume.versionName || resume.fileName} ({new Date(resume.createdAt).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={handleMatchCVs}
                    disabled={isMatching || !jdText}
                  >
                     {isMatching ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                     Find Best Match
                  </button>
                </div>
              ) : (
                <div className="cv-match-results">
                  <div className="match-header">
                    <h4>Recommended CVs</h4>
                    <button type="button" className="btn-link" onClick={() => setShowMatchResults(false)}>Show All</button>
                  </div>
                  <div className="match-list">
                    {matchResults.map((result) => (
                      <div 
                        key={result.resumeId} 
                        className={`match-item ${selectedCV === result.resumeName ? 'selected' : ''}`}
                        onClick={() => setValue('cvVersion', result.resumeName)}
                      >
                        <div className="match-info">
                          <div className="match-name-row">
                             <input 
                                type="radio" 
                                name="cv_match" 
                                checked={selectedCV === result.resumeName}
                                onChange={() => setValue('cvVersion', result.resumeName)}
                             />
                             <span className="match-name">{result.resumeName}</span>
                          </div>
                          <div className="match-skills">
                            {result.matchingSkills?.slice(0, 3).map(s => (
                              <span key={s} className="skill-tag match">✅ {s}</span>
                            ))}
                            {result.missingSkills?.slice(0, 2).map(s => (
                              <span key={s} className="skill-tag missing">❌ {s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="match-score-wrapper">
                          <span className="match-score-val">{result.matchScore}%</span>
                          <div className="match-progress-bar">
                            <div className="match-progress-fill" style={{ width: `${result.matchScore}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="form-group full-width">
              <label>Notes</label>
              <textarea 
                {...register('notes')} 
                placeholder="Key requirements, recruiter info, company culture notes..."
                rows={3}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={18} />
              Create Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
