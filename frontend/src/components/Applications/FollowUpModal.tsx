import { useState, useMemo } from 'react';
import { X, Copy, Check, Clock, Send } from 'lucide-react';
import type { JobApplication } from '../../types';
import { useApplicationStore } from '../../store';
import './FollowUpModal.css';

interface FollowUpModalProps {
    application: JobApplication;
    onClose: () => void;
}

const FollowUpModal = ({ application, onClose }: FollowUpModalProps) => {
    const { updateApplication } = useApplicationStore();
    const [copied, setCopied] = useState(false);

    const draft = useMemo(() => {
        if (application.status === 'APPLIED') {
            return `Subject: Following up on my application for ${application.position} - ${application.companyName}

Hi Hiring Team,

I hope this email finds you well.

I recently applied for the ${application.position} role at ${application.companyName} on ${new Date(application.appliedDate).toLocaleDateString()}. I am very interested in this opportunity and wanted to check if there are any updates regarding my application status.

I have attached my resume for your convenience. I firmly believe my skills in [Key Skills] would make me a great addition to your team.

Thank you for your time and consideration.

Best regards,
[Your Name]`;
        } else if (application.status.includes('INTERVIEW')) {
            return `Subject: Thank you / Follow-up - ${application.position} interview

Hi [Interviewer Name],

Thank you again for the opportunity to interview for the ${application.position} role earlier. I really enjoyed learning more about the team and the challenges you are solving at ${application.companyName}.

I just wanted to follow up to see if there are any updates on the next steps. I remain very enthusiastic about the possibility of joining your team.

Please let me know if you need any further information from me.

Best regards,
[Your Name]`;
        }
        return "No template available for this stage.";
    }, [application]);

    const [message, setMessage] = useState(draft);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            
            // Optional: Mark as "Interacted" so reminder snoozes?
            // updateApplication(application.id, { notes: (application.notes || '') + '\n[System]: Follow-up template copied on ' + new Date().toLocaleDateString() });
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleDismiss = () => {
        // Update timestamp to "snooze" the reminder
        updateApplication(application.id, { 
            // We just touch the update time. 
            // In a real app, we might want a specific 'lastFollowUpChecked' field.
            // But for MVP, touching updatedAt works with our ApplicationCard logic.
            updatedAt: new Date().toISOString()
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content card active follow-up-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-title">
                        <div className="header-icon" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
                            <Clock size={20} />
                        </div>
                        <div>
                            <h2>Follow-up Suggestion</h2>
                            <p className="modal-subtitle">It's been a while since your last interaction.</p>
                        </div>
                    </div>
                    <button className="btn-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="template-info">
                        <span className="info-label">Smart Template:</span>
                        <span className="info-value">{application.status === 'APPLIED' ? 'Post-Application Inquiry' : 'Post-Interview Check-in'}</span>
                    </div>

                    <textarea 
                        className="draft-editor"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={12}
                    />

                    <div className="action-buttons">
                        <button className="btn btn-secondary" onClick={handleDismiss}>Dismiss (Snooze)</button>
                        <button className={`btn ${copied ? 'btn-success' : 'btn-primary'}`} onClick={handleCopy}>
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                    </div>

                    <div className="gmail-link">
                        <a href={`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(message.split('\n')[0].replace('Subject: ', ''))}&body=${encodeURIComponent(message.split('\n').slice(2).join('\n'))}`} target="_blank" rel="noopener noreferrer" className="btn-link">
                            <Send size={14} /> Open in Gmail
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FollowUpModal;
