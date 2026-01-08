import { useState, useRef } from 'react';
import { User, Bell, Palette, LogOut, Check, Settings as SettingsIcon } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';
import axiosInstance from '../../api/axios';
import { API_ENDPOINTS } from '../../constants';
import './Settings.css';

const Settings = () => {
  const { user, logout, setUser } = useAuthStore();
  const { theme, setTheme, primaryHue, setPrimaryHue, notificationSettings, setNotificationSettings } = useUIStore();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = { ...user, avatar: reader.result as string };
        setUser(updatedUser);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmailToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    try {
      await axiosInstance.post(API_ENDPOINTS.EMAIL_NOTIFICATIONS_SETTINGS, enabled);
      // Optimistic update
      if (user) {
        setUser({ ...user, emailNotificationsEnabled: enabled });
      }
    } catch (error) {
      console.error('Failed to update email settings', error);
      // Revert if needed? For MVP, just log.
    }
  };

  const themes = [
    { name: 'Purple', hue: 250, color: 'hsl(250, 75%, 58%)' },
    { name: 'Blue', hue: 210, color: 'hsl(210, 75%, 58%)' },
    { name: 'Cyan', hue: 190, color: 'hsl(190, 75%, 52%)' },
    { name: 'Green', hue: 142, color: 'hsl(142, 76%, 45%)' },
    { name: 'Orange', hue: 38, color: 'hsl(38, 92%, 50%)' },
    { name: 'Red', hue: 0, color: 'hsl(0, 84%, 60%)' },
    { name: 'Pink', hue: 320, color: 'hsl(320, 75%, 58%)' },
  ];

  const sections = [
    {
      id: 'profile',
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your personal information and preferences',
      content: (
        <div className="settings-profile">
          <div className="profile-upload">
            <div className="avatar-large">
              {user?.avatar ? <img src={user.avatar} alt={user.name} /> : user?.name.charAt(0)}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
            <button className="btn btn-secondary btn-sm" onClick={handlePhotoClick}>Change Photo</button>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" defaultValue={user?.name} className="input" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" defaultValue={user?.email} className="input" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'appearance',
      icon: Palette,
      title: 'Appearance',
      description: 'Customize theme & colors (Click icon to change color)',
      action: () => setShowColorPicker(!showColorPicker),
      content: (
        <div className="appearance-section-content">
          {showColorPicker && (
            <div className="color-picker-panel animate-fade-in">
              <p className="picker-label">Select Accent Color</p>
              <div className="color-grid">
                {themes.map((t) => (
                  <button
                    key={t.hue}
                    className={`color-btn ${primaryHue === t.hue ? 'active' : ''}`}
                    style={{ backgroundColor: t.color }}
                    onClick={() => setPrimaryHue(t.hue)}
                    title={t.name}
                  >
                    {primaryHue === t.hue && <Check size={14} color="white" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="theme-toggle-group">
            <div
              className={`theme-card ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <div className="theme-preview light"></div>
              <span>Light Mode</span>
            </div>
            <div
              className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <div className="theme-preview dark"></div>
              <span>Dark Mode</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notifications',
      description: 'Stay updated on your application progress',
      content: (
        <div className="settings-list">
          <div className="settings-item-row">
            <div>
              <div className="item-title">Interview Reminders</div>
              <div className="item-desc">Get notified 1 hour before scheduled interviews</div>
            </div>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="settings-item-row">
            <div>
              <div className="item-title">Email Notifications</div>
              <div className="item-desc">Receive updates via email</div>
            </div>
            <input
              type="checkbox"
              checked={user?.emailNotificationsEnabled || false}
              onChange={handleEmailToggle}
            />
          </div>

          {/* Follow-up Suggestions Section */}
          <div className="settings-group">
            <div className="settings-item-row">
              <div>
                <div className="item-title">Follow-up Suggestions</div>
                <div className="item-desc">Get smart reminders when it's time to follow up with recruiters</div>
              </div>
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  checked={notificationSettings.followUpEnabled}
                  onChange={(e) => setNotificationSettings({ followUpEnabled: e.target.checked })}
                />
              </div>
            </div>

            {notificationSettings.followUpEnabled && (
              <div className="sub-settings animate-fade-in" style={{
                marginTop: 12,
                padding: 16,
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', marginBottom: 6 }}>After applying (No response)</label>
                    <select
                      className="input"
                      value={notificationSettings.afterApplyingDays}
                      onChange={(e) => setNotificationSettings({ afterApplyingDays: parseInt(e.target.value) })}
                    >
                      <option value={3}>3 days</option>
                      <option value={5}>5 days</option>
                      <option value={7}>7 days</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', marginBottom: 6 }}>After interview (No feedback)</label>
                    <select
                      className="input"
                      value={notificationSettings.afterInterviewDays}
                      onChange={(e) => setNotificationSettings({ afterInterviewDays: parseInt(e.target.value) })}
                    >
                      <option value={1}>1 day</option>
                      <option value={2}>2 days</option>
                      <option value={3}>3 days</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }
  ];

  const handleSaveNotifications = async () => {
    try {
      await axiosInstance.post(API_ENDPOINTS.NOTIFICATION_SETTINGS, {
        emailNotificationsEnabled: user?.emailNotificationsEnabled || false,
        followUpApplyingDays: notificationSettings.afterApplyingDays,
        followUpInterviewDays: notificationSettings.afterInterviewDays
      });
      alert('Notification settings saved successfully!');
    } catch (error) {
      console.error('Failed to save notification settings', error);
      alert('Failed to save notification settings. Please try again.');
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="header-title-section">
          <div className="header-icon-wrapper">
            <SettingsIcon size={28} />
          </div>
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your account and app configurations</p>
          </div>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-nav card">
          {sections.map(section => (
            <a key={section.id} href={`#${section.id}`} className="settings-nav-item">
              <section.icon size={20} />
              <span>{section.title}</span>
            </a>
          ))}
          <div className="nav-divider"></div>
          <button className="settings-nav-item logout-red" onClick={logout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="settings-content">
          {sections.map(section => (
            <div key={section.id} id={section.id} className="settings-section card">
              <div className="section-header">
                <div
                  className={`header-icon-bg ${section.id === 'appearance' ? 'clickable' : ''}`}
                  onClick={section.action}
                  style={section.id === 'appearance' ? { cursor: 'pointer' } : {}}
                >
                  <section.icon size={20} />
                </div>
                <div>
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                </div>
              </div>
              <div className="section-body">
                {section.content}
              </div>
              <div className="section-footer">
                <button
                  className="btn btn-primary"
                  onClick={section.id === 'notifications' ? handleSaveNotifications : undefined}
                >
                  Save Changes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
