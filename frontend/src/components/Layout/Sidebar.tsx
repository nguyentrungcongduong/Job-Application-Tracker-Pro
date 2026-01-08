import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  Bell
} from 'lucide-react';
import { useUIStore } from '../../store';
import { useAuthStore } from '../../store';
import { useNotificationStore } from '../../store/notificationStore';
import { useEffect } from 'react';
import Logo from './Logo';
import './Sidebar.css';

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const { unreadCount, fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/applications', icon: Briefcase, label: 'Applications' },
    { to: '/resumes', icon: FileText, label: 'Resumes' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: unreadCount > 0 ? unreadCount : null },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        {sidebarOpen && (
          <div className="sidebar-logo">
            <div className="logo-icon">
              <Logo size={44} />
            </div>
            <div className="logo-text">
              <h1 className="gradient-text">JobTracker</h1>
              <span className="logo-subtitle">Pro</span>
            </div>
          </div>
        )}
        <button
          className="sidebar-toggle btn-ghost"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {sidebarOpen && user && (
          <div className="user-profile">
            <div className="user-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role badge badge-primary">{user.role}</div>
            </div>
          </div>
        )}

        <button
          className="btn-ghost logout-btn"
          onClick={logout}
          title="Logout"
        >
          <LogOut size={20} />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
