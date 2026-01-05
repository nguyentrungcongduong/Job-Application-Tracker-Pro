import { useState } from 'react';
import { useApplicationStore } from '../../store';
import { KANBAN_COLUMNS, STATUS_CONFIG } from '../../constants';
import type { ApplicationStatus, JobApplication } from '../../types';
import ApplicationCard from './ApplicationCard.tsx';
import './KanbanBoard.css';

interface KanbanBoardProps {
  searchQuery: string;
}

const KanbanBoard = ({ searchQuery: _searchQuery }: KanbanBoardProps) => {
  const { filters: _filters, getFilteredApplications, updateApplication } = useApplicationStore();
  const [draggedItem, setDraggedItem] = useState<JobApplication | null>(null);

  // Use the centralized filtering logic from the store
  const filteredApplications = getFilteredApplications();

  // Group applications by status
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
    <div className="kanban-board">
      {KANBAN_COLUMNS.map((status) => {
        const apps = getApplicationsByStatus(status);
        const config = STATUS_CONFIG[status];

        return (
          <div
            key={status}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(status)}
          >
            <div className="column-header" style={{ borderColor: config.color }}>
              <div className="column-title">
                <span className="column-icon">{config.icon}</span>
                <span className="column-label">{config.label}</span>
              </div>
              <div className="column-count badge" style={{ 
                background: config.bgColor,
                color: config.color 
              }}>
                {apps.length}
              </div>
            </div>

            <div className="column-content">
              {apps.length === 0 ? (
                <div className="empty-column">
                  <p>No applications</p>
                </div>
              ) : (
                apps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onDragStart={() => handleDragStart(app)}
                    isDragging={draggedItem?.id === app.id}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
