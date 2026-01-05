import { X, Send, Link as LinkIcon, Building2, UserCircle, Briefcase, DollarSign, MapPin, Tag, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useApplicationStore } from '../../store';
import { STATUS_CONFIG, SOURCE_CONFIG, PRIORITY_CONFIG } from '../../constants';
import type { JobApplication } from '../../types';
import './ApplicationModal.css';

interface ApplicationModalProps {
  onClose: () => void;
}

type ApplicationFormValues = Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'fitScore'>;

const ApplicationModal = ({ onClose }: ApplicationModalProps) => {
  const { addApplication } = useApplicationStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormValues>({
    defaultValues: {
      status: 'APPLIED',
      source: 'LINKEDIN',
      priority: 'MEDIUM',
      appliedDate: new Date().toISOString().split('T')[0],
      tags: []
    }
  });

  const onSubmit = (data: ApplicationFormValues) => {
    const newApplication: JobApplication = {
      ...data,
      id: `app-${Date.now()}`,
      userId: 'user-1', // Mock user
      fitScore: Math.floor(Math.random() * 40) + 60, // Mock fit score
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: typeof data.tags === 'string' ? (data.tags as string).split(',').map(t => t.trim()) : data.tags
    };
    
    addApplication(newApplication);
    onClose();
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

            {/* Tags & CV */}
            <div className="form-group">
              <label><Tag size={16} /> Tags (comma separated)</label>
              <input 
                {...register('tags' as any)} 
                placeholder="Remote, React, High Salary"
              />
            </div>

            <div className="form-group">
              <label><FileText size={16} /> CV Version Used</label>
              <input 
                {...register('cvVersion')} 
                placeholder="e.g. CV_v3_Standard.pdf"
              />
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
