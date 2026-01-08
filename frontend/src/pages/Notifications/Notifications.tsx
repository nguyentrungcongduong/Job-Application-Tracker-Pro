import { useEffect } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, Clock, TrendingUp } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
    const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();
    }, []); // eslint-disable-line

    const getIcon = (type: string) => {
        switch (type) {
            case 'INTERVIEW_REMINDER': return <Clock size={20} color="#eab308" />;
            case 'FOLLOW_UP': return <TrendingUp size={20} color="#3b82f6" />;
            default: return <Bell size={20} />;
        }
    };

    return (
        <div className="notifications-page">
            <div className="page-header">
                <div className="header-title-section">
                    <div className="header-icon-wrapper">
                        <Bell size={28} />
                    </div>
                    <div>
                        <h1 className="page-title">Notifications</h1>
                        <p className="page-subtitle">Stay updated on your application process</p>
                    </div>
                </div>
                <button className="btn btn-secondary" onClick={() => markAllAsRead()}>
                    <Check size={16} /> Mark all as read
                </button>
            </div>

            <div className="notifications-list card">
                {loading && notifications.length === 0 ? (
                    <div className="p-4 text-center">Loading...</div>
                ) : notifications.length === 0 ? (
                    <div className="empty-state">
                        <Bell size={48} className="text-muted" style={{ opacity: 0.2, marginBottom: 16 }} />
                        <h3>No notifications yet</h3>
                        <p>We'll notify you when there's an update.</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                            onClick={() => !notification.isRead && markAsRead(notification.id)}
                        >
                            <div className="notification-icon">
                                {getIcon(notification.type)}
                            </div>
                            <div className="notification-content">
                                <div className="notification-header">
                                    <h4 className="notification-title">{notification.title}</h4>
                                    <span className="notification-time">
                                        {formatDistanceToNow(new Date(notification.sentAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="notification-text">{notification.content}</p>
                            </div>
                            {!notification.isRead && (
                                <div className="unread-dot"></div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
