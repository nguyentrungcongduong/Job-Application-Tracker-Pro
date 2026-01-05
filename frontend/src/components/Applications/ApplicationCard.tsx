import { Calendar, DollarSign, MapPin, TrendingUp } from 'lucide-react';
import type { JobApplication } from '../../types';
import { PRIORITY_CONFIG, SOURCE_CONFIG, getFitScoreLevel } from '../../constants';
import { useApplicationStore } from '../../store';
import { format } from 'date-fns';
import './ApplicationCard.css';

interface ApplicationCardProps {
  application: JobApplication;
  onDragStart: () => void;
  isDragging: boolean;
}

const ApplicationCard = ({ application, onDragStart, isDragging }: ApplicationCardProps) => {
  const { selectApplication } = useApplicationStore();

  const handleClick = () => {
    selectApplication(application.id);
    // Navigate to detail page or open modal
  };

  const fitScoreLevel = application.fitScore 
    ? getFitScoreLevel(application.fitScore)
    : null;

  return (
    <div
      className={`application-card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={onDragStart}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="card-header">
        <div className="company-info">
          <div className="company-logo">
            {application.companyName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="company-name">{application.companyName}</h4>
            <p className="position-title">{application.position}</p>
          </div>
        </div>
        
        {application.priority && (
          <div 
            className="priority-indicator"
            style={{ color: PRIORITY_CONFIG[application.priority].color }}
            title={PRIORITY_CONFIG[application.priority].label}
          >
            {PRIORITY_CONFIG[application.priority].icon}
          </div>
        )}
      </div>

      {/* Meta Info */}
      <div className="card-meta">
        <div className="meta-item">
          <Calendar size={14} />
          <span>{format(new Date(application.appliedDate), 'MMM dd, yyyy')}</span>
        </div>
        
        {application.salaryExpectation && (
          <div className="meta-item">
            <DollarSign size={14} />
            <span>${(application.salaryExpectation / 1000).toFixed(0)}k</span>
          </div>
        )}

        <div className="meta-item">
          <MapPin size={14} />
          <span>{SOURCE_CONFIG[application.source].label}</span>
        </div>
      </div>

      {/* Tags */}
      {application.tags && application.tags.length > 0 && (
        <div className="card-tags">
          {application.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag badge badge-primary">
              {tag}
            </span>
          ))}
          {application.tags.length > 3 && (
            <span className="tag badge badge-primary">
              +{application.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Fit Score */}
      {application.fitScore && fitScoreLevel && (
        <div className="card-footer">
          <div className="fit-score">
            <TrendingUp size={14} />
            <span className="fit-score-label">Fit Score:</span>
            <span 
              className="fit-score-value"
              style={{ color: fitScoreLevel.color }}
            >
              {application.fitScore}%
            </span>
          </div>
          <div className="fit-score-bar">
            <div 
              className="fit-score-fill"
              style={{ 
                width: `${application.fitScore}%`,
                background: fitScoreLevel.color
              }}
            />
          </div>
        </div>
      )}

      {/* Notes Preview */}
      {application.notes && (
        <div className="card-notes">
          <p>{application.notes.substring(0, 80)}{application.notes.length > 80 ? '...' : ''}</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
