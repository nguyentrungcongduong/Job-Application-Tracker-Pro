import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useApplicationStore } from '../../store';
import { 
  Sparkles, 
  Target, 
  FileUp, 
  PlusCircle, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  Briefcase,
  FileCheck
} from 'lucide-react';
import './Onboarding.css';

const STEPS = [
  { id: 'role', title: 'Target Role', icon: Target },
  { id: 'cv', title: 'Resume', icon: FileUp },
  { id: 'first-app', title: 'First Entry', icon: PlusCircle }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, completeOnboarding } = useAuthStore();
  const { addApplication } = useApplicationStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  // First App state
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    // 1. Create first application if data provided
    if (company && position) {
      addApplication({
        id: crypto.randomUUID(),
        userId: user.id,
        companyName: company,
        position: position,
        status: 'APPLIED',
        appliedDate: new Date().toISOString().split('T')[0],
        source: 'OTHER',
        priority: 'MEDIUM',
        tags: [industry || 'Job Search'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 2. Mark user as onboarded (API call + Store update)
    await completeOnboarding();
    
    // 3. To "Aha Moment" (Dashboard)
    navigate('/dashboard');
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="onboarding-container">
      <div className="onboarding-card glass animate-fade-in">
        {/* Header with Progress */}
        <div className="onboarding-header">
          <div className="logo small">
            <Sparkles size={24} />
            <h1 className="gradient-text">Onboarding</h1>
          </div>
          <div className="progress-stepper">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`step-item ${index <= currentStep ? 'active' : ''}`}>
                  <div className="step-icon">
                    <step.icon size={18} />
                  </div>
                  <span>{step.title}</span>
                </div>
                {index < STEPS.length - 1 && <div className={`step-line ${index < currentStep ? 'active' : ''}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="step-content">
          {currentStep === 0 && (
            <div className="animate-slide-in">
              <h2>What's your dream role?</h2>
              <p>Tailor your dashboard to your career path.</p>
              <div className="form-group mt-6">
                <label>Job Title / Role</label>
                <input 
                  className="input" 
                  placeholder="e.g. Senior Software Engineer" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div className="form-group mt-4">
                <label>Industry</label>
                <select 
                  className="input" 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="">Select an industry</option>
                  <option value="Tech">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Health">Healthcare</option>
                  <option value="Design">Design / Creative</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="animate-slide-in">
              <h2>Upload Your Resume</h2>
              <p>We'll use this to analyze your fit score (Optional MVP).</p>
              
              <div 
                className={`upload-zone ${resumeFile ? 'file-selected' : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                  className="hidden-input"
                  style={{ display: 'none' }}
                />
                
                {resumeFile ? (
                  <div className="selected-file-ui text-center animate-scale-up">
                    <div className="file-icon-wrapper mb-2">
                      <FileCheck size={48} className="text-success" />
                    </div>
                    <p className="font-bold text-lg text-primary">{resumeFile.name}</p>
                    <p className="text-secondary text-sm">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button 
                      className="btn btn-ghost btn-sm mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setResumeFile(null);
                      }}
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <>
                    <FileUp size={48} className="upload-icon" />
                    <p>Drag and drop your PDF here</p>
                    <button className="btn btn-secondary mt-2">Browse Files</button>
                    <span className="text-xs mt-2 text-tertiary">PDF, DOCX up to 5MB</span>
                  </>
                )}
              </div>
              <p className="skip-hint mt-4 text-center">You can also skip this and upload later in Settings.</p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-slide-in">
              <h2>Log Your First Application</h2>
              <p>Start your tracker with a real application you're working on.</p>
              <div className="first-app-form card mt-4 border-dashed">
                <div className="form-group">
                  <label>Company</label>
                  <input 
                    className="input" 
                    placeholder="e.g. Google, Apple" 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Position</label>
                  <input 
                    className="input" 
                    placeholder="Software Engineer" 
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>
              </div>
              <p className="mt-4 text-sm italic text-secondary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success" />
                This will show up on your dashboard immediately!
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="onboarding-footer">
          <button 
            className="btn btn-ghost" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft size={18} />
            Back
          </button>
          
          {currentStep === STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={handleComplete}>
              Go to Dashboard
              <ArrowRight size={18} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={nextStep}>
              Next Step
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
