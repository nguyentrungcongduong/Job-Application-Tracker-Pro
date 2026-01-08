import { useState, useRef } from 'react';
import { useApplicationStore } from '../../store';
import { Calendar, GripVertical, ChevronRight, DollarSign, MapPin, TrendingUp } from 'lucide-react';
import { KANBAN_COLUMNS, STATUS_CONFIG, PRIORITY_CONFIG, SOURCE_CONFIG, getFitScoreLevel } from '../../constants';
import type { JobApplication, ApplicationStatus } from '../../types';
import { format } from 'date-fns';

interface ApplicationTableProps {
  searchQuery: string;
}

const HorizontalTableWrapper = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaX !== 0) return;
    
    // Check if we are over a vertically scrollable element
    const path = e.nativeEvent.composedPath() as HTMLElement[];
    for (const el of path) {
      if (el === scrollRef.current) break;
      if (el.scrollHeight > el.clientHeight) {
        const style = window.getComputedStyle(el);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          return; // Let vertical scroll happen
        }
      }
    }

    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div 
      className="table-wrapper" 
      ref={scrollRef} 
      onWheel={handleWheel}
      style={{ overflowX: 'auto' }}
    >
      {children}
    </div>
  );
};

const ApplicationTable = ({ searchQuery: _searchQuery }: ApplicationTableProps) => {
  const { filters: _filters, getFilteredApplications, selectApplication, updateApplication } = useApplicationStore();
  const filteredApplications = getFilteredApplications();
  const [draggedItem, setDraggedItem] = useState<JobApplication | null>(null);

  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return filteredApplications.filter(app => app.status === status);
  };

  const handleDragStart = (app: JobApplication) => {
    setDraggedItem(app);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: ApplicationStatus) => {
    if (draggedItem && draggedItem.status !== status) {
      updateApplication(draggedItem.id, { status });
    }
    setDraggedItem(null);
  };

  return (
    <div className="application-table-grouped">
      {KANBAN_COLUMNS.map((status) => {
        const apps = getApplicationsByStatus(status);
        const config = STATUS_CONFIG[status];
        
        return (
          <div 
            key={status} 
            className="status-swimlane animate-fade-in"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(status)}
          >
            {/* Status Sidebar */}
            <div className="status-sidebar" style={{ borderLeft: `4px solid ${config.color}` }}>
              <div className="status-label-vertical">
                <span className="status-icon">{config.icon}</span>
                <span className="status-text">{config.label}</span>
                <span className="status-line" style={{ background: config.color }}></span>
                <span className="status-count">{apps.length}</span>
              </div>
            </div>

            {/* Applications List */}
            <div className="status-content">
              {apps.length === 0 ? (
                <div className="empty-status-placeholder">
                  <p>Drop applications here to move to {config.label}</p>
                </div>
              ) : (
                <HorizontalTableWrapper>
                  <table className="w-full">
                    <tbody>
                      {apps.map((app) => {
                        const fitScoreLevel = app.fitScore ? getFitScoreLevel(app.fitScore) : null;
                        
                        return (
                          <tr 
                            key={app.id}
                            draggable
                            onDragStart={() => handleDragStart(app)}
                            className={`table-row ${draggedItem?.id === app.id ? 'opacity-50' : ''}`}
                            onClick={() => selectApplication(app.id)}
                          >
                            <td className="px-4 py-4 w-10 cursor-grab active:cursor-grabbing text-tertiary">
                              <GripVertical size={18} />
                            </td>
                            
                            {/* Company & Info (Matching Card Header) */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="company-logo-sm">
                                  {app.companyName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-primary">{app.companyName}</span>
                                  <span className="text-sm text-secondary">{app.position}</span>
                                </div>
                              </div>
                            </td>

                            {/* Meta Info (Matching Card Meta) */}
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-xs text-secondary">
                                  <Calendar size={12} />
                                <span>{(() => {
                                    const d = new Date(app.appliedDate);
                                    return isNaN(d.getTime()) ? 'Invalid Date' : format(d, 'MMM dd, yyyy');
                                })()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-secondary">
                                  <MapPin size={12} />
                                  <span>{SOURCE_CONFIG[app.source].label}</span>
                                </div>
                              </div>
                            </td>

                            {/* Salary & Priority */}
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                {app.salaryExpectation && (
                                  <div className="flex items-center gap-1 text-xs text-secondary">
                                    <DollarSign size={12} />
                                    <span>${(app.salaryExpectation / 1000).toFixed(0)}k</span>
                                  </div>
                                )}
                                {app.priority && (
                                  <div className="flex items-center gap-1 text-xs font-bold" style={{ color: PRIORITY_CONFIG[app.priority].color }}>
                                    {PRIORITY_CONFIG[app.priority].icon}
                                    <span>{app.priority}</span>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Tags (Matching Card Tags) */}
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {app.tags.slice(0, 2).map((tag, idx) => (
                                  <span key={idx} className="tag-sm badge badge-primary">{tag}</span>
                                ))}
                                {app.tags.length > 2 && (
                                  <span className="tag-sm badge badge-primary">+{app.tags.length - 2}</span>
                                )}
                              </div>
                            </td>

                            {/* Fit Score (Matching Card Footer) */}
                            <td className="px-6 py-4">
                              {app.fitScore && fitScoreLevel && (
                                <div className="flex flex-col gap-1 w-32">
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1">
                                      <TrendingUp size={12} />
                                      <span>Fit Score</span>
                                    </div>
                                    <span style={{ color: fitScoreLevel.color, fontWeight: 700 }}>{app.fitScore}%</span>
                                  </div>
                                  <div className="h-1 bg-tertiary rounded-full overflow-hidden">
                                    <div 
                                      className="h-full" 
                                      style={{ width: `${app.fitScore}%`, background: fitScoreLevel.color }}
                                    />
                                  </div>
                                </div>
                              )}
                            </td>

                            <td className="px-6 py-4 text-right">
                               <ChevronRight size={18} className="text-tertiary" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </HorizontalTableWrapper>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationTable;
