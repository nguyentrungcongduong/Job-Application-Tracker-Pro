import { useState, useMemo, useEffect } from 'react';
import {
  Briefcase,
  TrendingUp,
  Calendar,
  Award,
  ArrowUp,
  ArrowDown,
  Target,
  X,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  ChevronRight,
  Zap,
  CheckCircle2,
  LayoutDashboard
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Cell as ReBarCell,
  AreaChart,
  Area
} from 'recharts';
import { useApplicationStore } from '../../store';
import { mockSourcePerformance } from '../../data/mockData';
import { STATUS_CONFIG, SOURCE_CONFIG } from '../../constants';
import type { ApplicationStatus, JobApplication } from '../../types';
import './Dashboard.css';

const Dashboard = () => {
  const { applications, interviews, fetchApplications, fetchAllInterviews } = useApplicationStore();
  const [selectedStage, setSelectedStage] = useState<ApplicationStatus | null>(null);

  useEffect(() => {
    fetchApplications();
    fetchAllInterviews();
  }, []);

  // ========================================
  // CORE DYNAMIC STATS
  // ========================================
  const dynamicStats = useMemo(() => {
    // 1. Active Applications
    const activeStatuses: ApplicationStatus[] = [
      'CV_IN_PROGRESS', 'APPLIED', 'HR_SCREEN', 'INTERVIEW_1', 'INTERVIEW_2', 'FINAL_INTERVIEW', 'OFFER_RECEIVED'
    ];
    const activeApps = applications.filter(app => activeStatuses.includes(app.status));

    // 2. Interviews Scheduled (using actual Interviews entity)
    const now = new Date();
    const futureInterviews = interviews.filter(int => new Date(int.interviewDate) > now);
    const completedInterviews = interviews.filter(int => new Date(int.interviewDate) <= now);

    // 3. Response Rate
    const responseStatuses: ApplicationStatus[] = ['HR_SCREEN', 'INTERVIEW_1', 'INTERVIEW_2', 'FINAL_INTERVIEW', 'OFFER_RECEIVED', 'OFFER_ACCEPTED'];
    const totalAppliedStatuses: ApplicationStatus[] = [...responseStatuses, 'APPLIED', 'REJECTED'];
    const totalAppliedApps = applications.filter(app => totalAppliedStatuses.includes(app.status));
    const respondedCount = totalAppliedApps.filter(app => responseStatuses.includes(app.status)).length;
    const responseRate = totalAppliedApps.length > 0 ? (respondedCount / totalAppliedApps.length) * 100 : 0;

    // 4. Offer Rate (Offers / Total Submitted)
    const offersCount = applications.filter(app => ['OFFER_RECEIVED', 'OFFER_ACCEPTED'].includes(app.status)).length;
    const offerRate = totalAppliedApps.length > 0 ? (offersCount / totalAppliedApps.length) * 100 : 0;

    // 5. Avg Response Time
    const appsWithFirstResponse = applications.filter(app => app.appliedDate && app.firstResponseDate);
    const totalResponseTimeDays = appsWithFirstResponse.reduce((sum, app) => {
      const start = new Date(app.appliedDate);
      const end = new Date(app.firstResponseDate!);
      return sum + Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }, 0);
    const avgResponseTime = appsWithFirstResponse.length > 0 ? Math.round(totalResponseTimeDays / appsWithFirstResponse.length) : 0;

    // 6. Interview Success Rate
    const successRate = completedInterviews.length > 0 ? (offersCount / completedInterviews.length) * 100 : 0;

    return {
      total: applications.length,
      active: activeApps.length,
      interviewsCount: interviews.length,
      upcomingInterviewsCount: futureInterviews.length,
      offers: offersCount,
      responseRate,
      offerRate,
      avgResponseTime,
      interviewSuccessRate: Math.min(100, successRate),
      avgFitScore: activeApps.length > 0 ? activeApps.reduce((sum, a) => sum + (a.fitScore || 0), 0) / activeApps.length : 0
    };
  }, [applications, interviews]);

  // ========================================
  // NEXT INTERVIEW SMART CARD
  // ========================================
  const nextInterviewData = useMemo(() => {
    const now = new Date();
    const sortedUpcoming = [...interviews]
      .filter(int => new Date(int.interviewDate) > now)
      .sort((a, b) => new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime());

    if (sortedUpcoming.length === 0) return null;

    const nextInt = sortedUpcoming[0];
    const app = applications.find(a => a.id === nextInt.applicationId);

    if (!app) return null;

    const date = new Date(nextInt.interviewDate);
    const diffMs = date.getTime() - now.getTime();
    const diffInHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    let countdownText = '';
    let countdownColor = '';

    if (diffInHours < 2) {
      countdownText = `TODAY @ ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      countdownColor = 'countdown-urgent';
    } else if (diffInDays === 0) {
      countdownText = `${diffInHours}h remaining`;
      countdownColor = 'countdown-urgent';
    } else if (diffInDays === 1) {
      countdownText = `Tomorrow`;
      countdownColor = 'countdown-warning';
    } else {
      countdownText = `${diffInDays} days to go`;
      countdownColor = 'countdown-safe';
    }

    return {
      id: nextInt.id,
      company: app.companyName,
      position: app.position,
      round: nextInt.round,
      interviewer: nextInt.interviewerName || 'To be assigned',
      type: nextInt.interviewType,
      countdownText,
      countdownColor,
      readinessScore: app.fitScore || 70
    };
  }, [interviews, applications]);

  // ========================================
  // APPLICATION VELOCITY DATA
  // ========================================
  const velocityData = useMemo(() => {
    const now = new Date();
    const data = [];

    for (let i = 28; i >= 0; i -= 7) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i - 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - i);

      const weekApps = applications.filter(app => {
        const d = new Date(app.appliedDate);
        return d >= weekStart && d <= weekEnd;
      });

      const weekInterviews = interviews.filter(int => {
        const d = new Date(int.interviewDate);
        return d >= weekStart && d <= weekEnd;
      });

      data.push({
        week: `W${4 - Math.floor(i / 7)}`,
        applied: weekApps.length,
        interviews: weekInterviews.length
      });
    }
    return data;
  }, [applications, interviews]);

  const dynamicFunnelData = useMemo(() => {
    const stages: ApplicationStatus[] = ['APPLIED', 'HR_SCREEN', 'INTERVIEW_1', 'INTERVIEW_2', 'FINAL_INTERVIEW', 'OFFER_RECEIVED'];
    return stages.map(stage => ({
      stage,
      count: applications.filter(app => app.status === stage).length
    }));
  }, [applications]);

  const topSourceInsight = useMemo(() => {
    const sources = [...new Set(applications.map(app => app.source))];
    const sourceStats = sources.map(source => {
      const sourceApps = applications.filter(app => app.source === source);
      const totalCount = sourceApps.length;
      const responses = sourceApps.filter(app =>
        ['HR_SCREEN', 'INTERVIEW_1', 'INTERVIEW_2', 'FINAL_INTERVIEW', 'OFFER_RECEIVED', 'OFFER_ACCEPTED'].includes(app.status)
      ).length;
      const rate = totalCount > 0 ? (responses / totalCount) * 100 : 0;
      return { source, rate, count: totalCount };
    });

    const best = sourceStats.sort((a, b) => b.rate - a.rate)[0];
    if (!best || best.count === 0) return null;

    const label = SOURCE_CONFIG[best.source]?.label || best.source;
    return `${label} is your top source with a ${best.rate.toFixed(0)}% response rate.`;
  }, [applications]);

  const drillDownApps = useMemo(() => {
    if (!selectedStage) return [];
    return applications.filter(app => app.status === selectedStage);
  }, [applications, selectedStage]);

  const getAppHealth = (app: JobApplication) => {
    const updatedAt = new Date(app.updatedAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return { label: 'On track', class: 'status-on-track', icon: '🟢', days: diffDays };
    if (diffDays < 15) return { label: 'Slow', class: 'status-slow', icon: '🟡', days: diffDays };
    return { label: 'Ghosted?', class: 'status-ghosted', icon: '🔴', days: diffDays };
  };

  const COLORS = ['var(--primary-500)', 'var(--accent-500)', 'var(--success)', 'var(--warning)', 'var(--error)', 'var(--info)'];

  const StatCard = ({ icon: Icon, title, value, change, trend, color }: any) => (
    <div className="stat-card card">
      <div className="stat-icon" style={{ background: color }}>
        <Icon size={20} />
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
        {change && (
          <div className={`stat-change ${trend}`}>
            {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-page content-section">
      <div className="page-header">
        <div className="header-title-section">
          <div className="header-icon-wrapper">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Personal job application analytics and insights</p>
          </div>
        </div>
      </div>

      {/* Row 1: Primary Stats */}
      <div className="stats-grid">
        <StatCard
          icon={Briefcase}
          title="Total Apps"
          value={dynamicStats.total}
          change="+3"
          trend="up"
          color="linear-gradient(135deg, var(--primary-600), var(--primary-400))"
        />
        <StatCard
          icon={TrendingUp}
          title="Active"
          value={dynamicStats.active}
          change="+2"
          trend="up"
          color="linear-gradient(135deg, var(--accent-600), var(--accent-400))"
        />
        <StatCard
          icon={Calendar}
          title="Upcoming"
          value={dynamicStats.upcomingInterviewsCount}
          color="linear-gradient(135deg, var(--success-dark), var(--success))"
        />
        <StatCard
          icon={Award}
          title="Offers"
          value={dynamicStats.offers}
          color="linear-gradient(135deg, var(--warning-dark), var(--warning))"
        />
        <StatCard
          icon={Target}
          title="Response"
          value={`${dynamicStats.responseRate.toFixed(0)}%`}
          color="linear-gradient(135deg, var(--info-dark), var(--info))"
        />
      </div>

      {/* Row 2: Secondary Performance Stats */}
      <div className="secondary-stats-row">
        <div className="mini-stat-card card">
          <div className="mini-stat-header"><Clock size={14} /> Response Time</div>
          <div className="mini-stat-value">{dynamicStats.avgResponseTime}d</div>
          <div className="mini-stat-footer text-success"><ArrowDown size={12} /> 2d faster</div>
        </div>
        <div className="mini-stat-card card">
          <div className="mini-stat-header"><Award size={14} /> Interview Success</div>
          <div className="mini-stat-value">{dynamicStats.interviewSuccessRate.toFixed(0)}%</div>
          <div className="mini-stat-footer text-success">Good job!</div>
        </div>
        <div className="mini-stat-card card">
          <div className="mini-stat-header"><Target size={14} /> Offer Rate</div>
          <div className="mini-stat-value">{dynamicStats.offerRate.toFixed(1)}%</div>
          <div className="mini-stat-footer text-primary">{dynamicStats.offers} of {dynamicStats.total}</div>
        </div>
        <div className="mini-stat-card card">
          <div className="mini-stat-header"><Zap size={14} /> Avg Fit Score</div>
          <div className="mini-stat-value">{dynamicStats.avgFitScore.toFixed(0)}%</div>
          <div className="mini-stat-footer text-accent">+3.2 pts</div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-column">
          {/* Pipeline Funnel */}
          <div className="chart-card card clickable-chart">
            <div className="chart-header">
              <h3 className="chart-title">Pipeline Funnel</h3>
              <p className="chart-subtitle">Distribution of applications across stages</p>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dynamicFunnelData} onClick={(data: any) => data?.activePayload && setSelectedStage(data.activePayload[0].payload.stage)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                  <XAxis dataKey="stage" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} tickFormatter={(v) => STATUS_CONFIG[v as keyof typeof STATUS_CONFIG]?.label.split(' ')[0]} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--primary-500)', borderRadius: '8px', color: 'var(--text-primary)' }} itemStyle={{ color: 'var(--text-primary)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {dynamicFunnelData.map((_entry, index) => <ReBarCell key={`cell-${index}`} fill={`hsl(250, 75%, ${65 - index * 8}%)`} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Velocity Chart */}
          <div className="chart-card card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Activity Momentum</h3>
                <p className="chart-subtitle">Applications & Interviews (Last 30 days)</p>
              </div>
              <div className="chart-legend-custom">
                <div className="legend-item"><span className="dot applied"></span> Applied</div>
                <div className="legend-item"><span className="dot interview"></span> Interviews</div>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData}>
                  <defs>
                    <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-500)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--accent-500)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                  <XAxis dataKey="week" stroke="var(--text-tertiary)" tick={{ fontSize: 10 }} />
                  <YAxis stroke="var(--text-tertiary)" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)' }} itemStyle={{ color: 'var(--text-primary)' }} />
                  <Area type="monotone" dataKey="applied" stroke="var(--primary-500)" strokeWidth={2} fill="url(#colorApplied)" />
                  <Area type="monotone" dataKey="interviews" stroke="var(--accent-500)" strokeWidth={2} fill="url(#colorInterviews)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="dashboard-column">
          {/* Next Interview Smart Card */}
          {nextInterviewData && (
            <div className="next-interview-card card">
              <div className="card-header-fancy">
                <div className="header-status">
                  <Calendar size={14} /> <span>UPCOMING INTERVIEW</span>
                </div>
                <div className={`countdown-badge ${nextInterviewData.countdownColor}`}>
                  {nextInterviewData.countdownText}
                </div>
              </div>

              <div className="interview-main-info">
                <div className="interview-company-info">
                  <h3>{nextInterviewData.position}</h3>
                  <p className="company-name">{nextInterviewData.company}</p>
                </div>
                <div className="readiness-meter">
                  <div className="meter-label">Fit Score: {nextInterviewData.readinessScore}%</div>
                  <div className="meter-bar">
                    <div className="meter-fill" style={{ width: `${nextInterviewData.readinessScore}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="interview-details-grid">
                <div className="detail-item">
                  <span className="label">Round</span>
                  <span className="value">{nextInterviewData.round} - Technical</span>
                </div>
                <div className="detail-item">
                  <span className="label">Medium</span>
                  <span className="value">{nextInterviewData.type === 'ONLINE' ? <Video size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> : <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />} {nextInterviewData.type}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Interviewer</span>
                  <span className="value">{nextInterviewData.interviewer}</span>
                </div>
              </div>

              <div className="interview-actions">
                <button className="btn btn-primary btn-sm"><CheckCircle2 size={16} /> Prep Notes</button>
                <button className="btn btn-outline btn-sm">Practice</button>
                <button className="btn btn-ghost btn-sm"><ExternalLink size={16} /> Call Link</button>
              </div>
            </div>
          )}

          {topSourceInsight && (
            <div className="insight-banner card">
              <div className="insight-icon">💡</div>
              <div className="insight-text">
                <strong>Insight:</strong> {topSourceInsight}
              </div>
            </div>
          )}

          <div className="chart-card card">
            <div className="chart-header">
              <h3 className="chart-title">Source Mix</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mockSourcePerformance as any} dataKey="applications" nameKey="source" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                    {mockSourcePerformance.map((_entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)' }} itemStyle={{ color: 'var(--text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-activity card mt-4">
        <div className="section-header">
          <h3 className="section-title">Recent Updates</h3>
          <button className="btn btn-ghost btn-sm">View All <ChevronRight size={14} /></button>
        </div>
        <div className="activity-list">
          {applications.slice(0, 3).map((app) => (
            <div key={app.id} className="activity-item">
              <div className="activity-icon" style={{ background: STATUS_CONFIG[app.status].bgColor, color: STATUS_CONFIG[app.status].color }}>
                {STATUS_CONFIG[app.status].icon}
              </div>
              <div className="activity-content">
                <div className="activity-title"><strong>{app.position}</strong> • {app.companyName}</div>
                <div className="activity-meta">
                  <span className="activity-date">{new Date(app.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="activity-score"><div className="score-value">{app.fitScore}%</div></div>
            </div>
          ))}
        </div>
      </div>

      {selectedStage && (
        <div className="drill-down-overlay" onClick={() => setSelectedStage(null)}>
          <div className="drill-down-sidebar" onClick={e => e.stopPropagation()}>
            <div className="drill-down-header">
              <h2>{STATUS_CONFIG[selectedStage].label}</h2>
              <button className="close-btn" onClick={() => setSelectedStage(null)}><X size={20} /></button>
            </div>
            <div className="drill-down-content">
              {drillDownApps.map(app => (
                <div key={app.id} className="drill-down-item">
                  <div className="item-main">
                    <div className="item-company">{app.companyName}</div>
                    <div className="item-meta">{app.position} • Day {getAppHealth(app).days}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
