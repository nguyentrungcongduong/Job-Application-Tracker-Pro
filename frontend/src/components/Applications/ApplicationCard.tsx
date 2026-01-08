import { Calendar, DollarSign, MapPin, TrendingUp, Trash2, Bell } from 'lucide-react';
import type { JobApplication } from '../../types';
import { PRIORITY_CONFIG, SOURCE_CONFIG, getFitScoreLevel } from '../../constants';
import { useApplicationStore, useUIStore } from '../../store';
import { format } from 'date-fns';
import { useState, useRef, useMemo, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import FollowUpModal from './FollowUpModal';
import './ApplicationCard.css';

interface ApplicationCardProps {
  application: JobApplication;
  onDragStart: () => void;
  isDragging: boolean;
}

const QuickViewPanel = ({ 
    application, 
    rect,
    isVisible
}: { 
    application: JobApplication; 
    rect: DOMRect | null; 
    isVisible: boolean 
}) => {
    // Dynamic Positioning Logic
    const PANEL_WIDTH = 440;
    const VIEWPORT_PADDING = 20;
    const [position, setPosition] = useState({ top: 0, left: 0, maxHeight: 'none' });
    const panelRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (isVisible && rect && panelRef.current) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const panelHeight = panelRef.current.offsetHeight;
            
            // Calculate Left
            let l = rect.right + 12;
            if (l + PANEL_WIDTH + VIEWPORT_PADDING > viewportWidth) {
                l = rect.left - PANEL_WIDTH - 12;
            }

            // Calculate Top & Max Height
            let t = rect.top;
            let mh = viewportHeight - (VIEWPORT_PADDING * 2);

            // If panel goes below viewport
            if (t + panelHeight + VIEWPORT_PADDING > viewportHeight) {
                t = viewportHeight - panelHeight - VIEWPORT_PADDING;
            }

            // Ensure t is not above top padding
            if (t < VIEWPORT_PADDING) {
                t = VIEWPORT_PADDING;
            }

            setPosition({ 
                top: t, 
                left: l, 
                maxHeight: `${mh}px` 
            });
        }
    }, [isVisible, rect, application]);

    if (!isVisible || !rect) return null;

    const safeFormat = (dateInput: any, formatStr: string) => {
        if (!dateInput) return 'N/A';
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return 'N/A';
        return format(date, formatStr);
    };

    return createPortal(
        <div 
            ref={panelRef}
            className="quick-view-panel"
            style={{ 
                top: `${position.top}px`, 
                left: `${position.left}px`,
                maxHeight: position.maxHeight,
                overflowY: 'auto',
                position: 'fixed',
                margin: 0,
                transform: 'none',
                opacity: 1,
                visibility: 'visible',
                pointerEvents: 'auto', // Allow scrolling if content is long
                zIndex: 9999
            }}
        >
              <div className="panel-header">
                  <div>
                      <h5>{application.position}</h5>
                      <span className="panel-subtitle">at {application.companyName}</span>
                  </div>
                  <span className="panel-date">Updated {safeFormat(application.updatedAt || application.createdAt, 'MMM dd')}</span>
              </div>
              
              <div className="panel-body">
                  {/* Strategy & Meta */}
                  <div className="strategy-row">
                      <div style={{ flex: 1 }}>
                          <div className="section-title text-success" style={{ marginBottom: 4 }}>📎 CV Strategy</div>
                          <div className="cv-badge">{application.cvVersion || 'Default Profile'}</div>
                      </div>
                      {Number(application.salaryExpectation) > 0 && (
                          <div style={{ paddingLeft: 12, borderLeft: '1px solid rgba(16,185,129,0.3)' }}>
                              <div className="section-title text-success" style={{ marginBottom: 4 }}>💰 Target</div>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${(Number(application.salaryExpectation)/1000).toFixed(0)}k</div>
                          </div>
                      )}
                  </div>

                  {/* Interview Reminder */}
                  {application.interviewReminder && (
                      <div className="panel-section" style={{ background: 'rgba(234, 179, 8, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                          <h6 className="section-title" style={{ color: '#eab308', margin: 0 }}>
                              <Bell size={14} /> Interview Reminder
                          </h6>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '4px', fontWeight: 600 }}>
                              {safeFormat(application.interviewReminder, 'MMM dd, yyyy - HH:mm')}
                          </div>
                      </div>
                  )}

                  {/* Requirements & Gaps */}
                  <div className="panel-section">
                      <h6 className="section-title text-primary">
                          📌 Requirements & Gaps 
                          {application.fitScore && <span style={{ marginLeft: 'auto', color: getFitScoreLevel(application.fitScore).color }}>{application.fitScore}% Match</span>}
                      </h6>
                      <div className="panel-tags-grid">
                          {/* Missing Skills First (High Priority) */}
                          {application.missingSkills?.map(skill => (
                              <span key={`missing-${skill}`} className="panel-tag-chip missing" title="Missing Requirement">
                                  ⚠ {skill}
                              </span>
                          ))}
                          
                          {/* Matched/Existing Tags */}
                          {application.tags?.map(tag => (
                              <span key={tag} className="panel-tag-chip">
                                  {tag}
                              </span>
                          ))}

                          {(!application.tags?.length && !application.missingSkills?.length) && (
                              <span className="text-muted" style={{ fontSize: '0.85rem' }}>No specific requirements parsed.</span>
                          )}
                      </div>
                  </div>

                  {/* My Notes */}
                  {application.notes && (
                      <div className="panel-section">
                          <h6 className="section-title text-info">🧠 My Notes / Strategy</h6>
                          <div className="panel-text-block">
                            {application.notes}
                          </div>
                      </div>
                  )}
              </div>
        </div>,
        document.body
    );
};

const ApplicationCard = ({ application, onDragStart, isDragging }: ApplicationCardProps) => {
  const { selectApplication, deleteApplication } = useApplicationStore();
  const { notificationSettings } = useUIStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  const handleClick = () => {
    selectApplication(application.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the application for ${application.companyName}?`)) {
      deleteApplication(application.id);
    }
  };
  
  const handleMouseEnter = () => {
      if (cardRef.current) {
          setCardRect(cardRef.current.getBoundingClientRect());
      }
      setIsHovered(true);
  };

  const handleMouseLeave = () => {
      setIsHovered(false);
  };

  const fitScoreLevel = application.fitScore 
    ? getFitScoreLevel(application.fitScore)
    : null;

    const isFollowUpDue = useMemo(() => {
    if (!notificationSettings?.followUpEnabled) return false;
    
    // Safety check for dates
    const appliedDate = new Date(application.appliedDate);
    if (isNaN(appliedDate.getTime())) return false;

    const now = new Date();
    // const daysSinceApplied = (now.getTime() - appliedDate.getTime()) / (1000 * 3600 * 24);
    
    // We check updatedAt (Last Activity) for ALL reminders. 
    // This allows "Dismissing" to work by updating the application (touching updatedAt).
    const updatedDate = application.updatedAt ? new Date(application.updatedAt) : new Date(application.createdAt);
    const validUpdatedDate = isNaN(updatedDate.getTime()) ? now : updatedDate;
    const daysSinceUpdated = (now.getTime() - validUpdatedDate.getTime()) / (1000 * 3600 * 24);

    if (application.status === 'APPLIED') {
        // For Applied, we want to ensure it's been at least X days since applying AND X days since last update
        const daysSinceApplied = (now.getTime() - appliedDate.getTime()) / (1000 * 3600 * 24);
        const threshold = notificationSettings.afterApplyingDays || 3;
        
        // Only show if applied long enough ago AND no recent updates
        if (daysSinceApplied >= threshold && daysSinceUpdated >= threshold) {
            return true;
        }
    }
    
    if (['INTERVIEW_1', 'INTERVIEW_2', 'FINAL_INTERVIEW', 'HR_SCREEN'].includes(application.status)) {
        if (daysSinceUpdated >= (notificationSettings.afterInterviewDays || 1)) {
            return true;
        }
    }
    
    return false;
  }, [application, notificationSettings]);

  const isInterviewSoon = useMemo(() => {
    if (!application.interviewReminder) return false;
    const reminderDate = new Date(application.interviewReminder);
    if (isNaN(reminderDate.getTime())) return false;
    
    const now = new Date();
    const diffMs = reminderDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // Highlight if interview is in the next 1 hour but hasn't passed yet
    return diffHours > 0 && diffHours <= 1;
  }, [application.interviewReminder]);

  return (
    <>
    <div
      ref={cardRef}
      className={`application-card ${isDragging ? 'dragging' : ''} ${isInterviewSoon ? 'interview-soon' : ''}`}
      draggable
      onDragStart={onDragStart}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        
        <div className="card-actions">
           {isFollowUpDue && (
              <div 
                  className="action-btn animate-pulse" 
                  onClick={(e) => { e.stopPropagation(); setShowFollowUpModal(true); }}
                  title="Follow-up Suggested"
                  style={{ 
                      background: 'rgba(234, 179, 8, 0.15)', 
                      border: '1px solid rgba(234, 179, 8, 0.3)',
                      marginRight: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      cursor: 'pointer'
                  }}
              >
                  <Bell size={14} color="#eab308" />
              </div>
            )}

           {application.priority && (
            <div 
                className="priority-indicator"
                style={{ color: PRIORITY_CONFIG[application.priority].color }}
                title={PRIORITY_CONFIG[application.priority].label}
            >
                {PRIORITY_CONFIG[application.priority].icon}
            </div>
            )}
            <button 
                className="btn-delete"
                onClick={handleDelete}
                title="Delete Application"
            >
                <Trash2 size={16} />
            </button>
        </div>
      </div>

      {/* Meta Info */}
      <div className="card-meta">
        <div className="meta-item">
          <Calendar size={14} />
          <span>{(() => {
              const d = new Date(application.appliedDate);
              return isNaN(d.getTime()) ? 'Invalid Date' : format(d, 'MMM dd, yyyy');
          })()}</span>
        </div>
        
        {Number(application.salaryExpectation) > 0 && (
          <div className="meta-item">
            <DollarSign size={14} />
            <span>${(Number(application.salaryExpectation) / 1000).toFixed(0)}k</span>
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
    </div>
    
    {/* Render Portal outside the scrollable area */}
    <QuickViewPanel 
        application={application} 
        rect={cardRect} 
        isVisible={isHovered && !isDragging} 
    />

    {showFollowUpModal && (
        <FollowUpModal 
            application={application} 
            onClose={() => setShowFollowUpModal(false)} 
        />
    )}
    </>
  );
};

export default ApplicationCard;
