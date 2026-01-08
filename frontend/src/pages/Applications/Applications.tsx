import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Filter, LayoutGrid, List, X, Briefcase } from 'lucide-react';
import { useApplicationStore } from '../../store';
import KanbanBoard from '../../components/Applications/KanbanBoard.tsx';
import ApplicationTable from '../../components/Applications/ApplicationTable.tsx';
import ApplicationModal from '../../components/Applications/ApplicationModal.tsx';
import type { ApplicationStatus, Priority } from '../../types';
import './Applications.css';

const STATUS_OPTIONS: ApplicationStatus[] = [
  'WISHLIST', 'CV_IN_PROGRESS', 'APPLIED', 'HR_SCREEN', 'INTERVIEW_1',
  'INTERVIEW_2', 'FINAL_INTERVIEW', 'OFFER_RECEIVED', 'OFFER_ACCEPTED', 'REJECTED'
];

const PRIORITY_OPTIONS: Priority[] = ['HIGH', 'MEDIUM', 'LOW'];

const Applications = () => {
  const {
    viewMode,
    setViewMode,
    applications,
    filters,
    setFilters,
    fetchApplications
  } = useApplicationStore();

  useEffect(() => {
    fetchApplications();
  }, []);

  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Sync search query to store with a slight delay or on change
  useEffect(() => {
    setFilters({ ...filters, search: searchQuery });
  }, [searchQuery]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    applications.forEach(app => app.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [applications]);

  const toggleFilter = <T extends keyof typeof filters>(key: T, value: any) => {
    const current = (filters[key] as any[]) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];

    setFilters({ ...filters, [key]: updated });
  };

  const clearFilters = () => {
    setFilters({ search: searchQuery });
  };

  const activeFiltersCount = (filters.status?.length || 0) + (filters.priority?.length || 0) + (filters.tags?.length || 0);

  return (
    <div className="applications-page">
      <div className="page-header">
        <div className="page-title-row">
          <div className="header-title-section">
            <div className="header-icon-wrapper">
              <Briefcase size={28} />
            </div>
            <div>
              <h1 className="page-title">Applications</h1>
              <p className="page-subtitle">
                Manage and track all your job applications
              </p>
            </div>
          </div>
          <div className="page-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <Plus size={20} />
              New Application
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="applications-toolbar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search companies, positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
            {searchQuery && (
              <button
                className="btn-icon-sm"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="toolbar-actions">
            <button
              className={`btn btn-secondary ${showFilters ? 'active' : ''} ${activeFiltersCount > 0 ? 'has-filters' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              Filters
              {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
            </button>

            <div className="view-toggle">
              <button
                className={`btn btn-ghost ${viewMode === 'kanban' ? 'active' : ''}`}
                onClick={() => setViewMode('kanban')}
                title="Kanban View"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                className={`btn btn-ghost ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel card glass animate-fade-in">
            <div className="filter-header">
              <span className="text-sm font-bold">Active Filters</span>
              <button className="btn-text-sm" onClick={clearFilters}>Clear All</button>
            </div>

            <div className="filter-grid">
              <div className="filter-section">
                <label className="filter-label">Status</label>
                <div className="filter-chips">
                  {STATUS_OPTIONS.map(status => (
                    <button
                      key={status}
                      className={`filter-chip ${filters.status?.includes(status) ? 'active' : ''}`}
                      onClick={() => toggleFilter('status', status)}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <label className="filter-label">Priority</label>
                <div className="filter-chips">
                  {PRIORITY_OPTIONS.map(priority => (
                    <button
                      key={priority}
                      className={`filter-chip ${filters.priority?.includes(priority) ? 'active' : ''}`}
                      onClick={() => toggleFilter('priority', priority)}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              {allTags.length > 0 && (
                <div className="filter-section">
                  <label className="filter-label">Tags</label>
                  <div className="filter-chips">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        className={`filter-chip ${filters.tags?.includes(tag) ? 'active' : ''}`}
                        onClick={() => toggleFilter('tags', tag)}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="applications-content">
        {viewMode === 'kanban' ? (
          <KanbanBoard searchQuery={searchQuery} />
        ) : (
          <ApplicationTable searchQuery={searchQuery} />
        )}
      </div>

      {/* Application Modal */}
      {showModal && (
        <ApplicationModal
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Applications;
