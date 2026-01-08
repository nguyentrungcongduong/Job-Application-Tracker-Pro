import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Award, Clock, Target, Calendar, BarChart3 } from 'lucide-react';
import ConversionFunnel from '../../components/Metrics/ConversionFunnel';
import OfferProbabilityChart from '../../components/Metrics/OfferProbabilityChart';
import './Analytics.css';
const Analytics = () => {

  const stats = [
    { label: 'Avg. Response Time', value: '4 days', icon: Clock, color: 'var(--primary-500)' },
    { label: 'Interview Success', value: '65%', icon: Target, color: 'var(--accent-500)' },
    { label: 'Offers / Applications', value: '1 / 10', icon: Award, color: 'var(--success)' },
    { label: 'Next Interview', value: 'In 2 days', icon: Calendar, color: 'var(--warning)' }
  ];

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div className="header-title-section">
          <div className="header-icon-wrapper">
            <BarChart3 size={28} />
          </div>
          <div>
            <h1 className="page-title">Analytics & Insights</h1>
            <p className="page-subtitle">Deep dive into your job search performance</p>
          </div>
        </div>
      </div>

      <div className="analytics-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card card">
            <div className="stat-icon" style={{ background: stat.color }}>
              <stat.icon size={20} />
            </div>
            <div className="stat-info">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-grid">
        {/* Performance Over Time */}
        <div className="chart-card card full-width">
          <div className="chart-header">
            <h3>Application Velocity</h3>
            <p>New applications vs. Interviews over the last 30 days</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={[
                { date: 'Week 1', apps: 4, interviews: 1 },
                { date: 'Week 2', apps: 7, interviews: 2 },
                { date: 'Week 3', apps: 5, interviews: 4 },
                { date: 'Week 4', apps: 8, interviews: 3 },
              ]}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                <XAxis dataKey="date" stroke="var(--text-tertiary)" />
                <YAxis stroke="var(--text-tertiary)" />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)' }}
                />
                <Area type="monotone" dataKey="apps" stroke="var(--primary-500)" fillOpacity={1} fill="url(#colorApps)" strokeWidth={3} />
                <Area type="monotone" dataKey="interviews" stroke="var(--accent-500)" fillOpacity={0} strokeWidth={3} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel Efficiency */}
        <div className="full-width">
          <ConversionFunnel />
        </div>

        {/* Success by Source */}
        <div className="chart-card card" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '500px',
          padding: '20px'
        }}>
          <div style={{ width: '100%' }}>

            <div className="chart-header" >
              <h3>Offer Probability by Source</h3>
              <p>Which sources yield the best results?</p>
            </div>
            <div className="chart-container">
              <OfferProbabilityChart />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
