import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'job_match' | 'application' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

const NotificationsPage = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const notificationIcons: Record<string, { icon: React.ReactNode; color: string }> = {
    job_match: { icon: '💼', color: 'bg-blue-100 text-blue-700' },
    application: { icon: '📝', color: 'bg-purple-100 text-purple-700' },
    message: { icon: '💬', color: 'bg-green-100 text-green-700' },
    system: { icon: '⚙️', color: 'bg-gray-100 text-gray-700' },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Bell className="h-8 w-8" />
            Notifications
          </h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            Mark all as read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border/40">
          <p className="text-sm text-muted-foreground mb-2">Total</p>
          <p className="text-3xl font-bold">{notifications.length}</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border/40">
          <p className="text-sm text-muted-foreground mb-2">Unread</p>
          <p className="text-3xl font-bold text-red-600">{unreadCount}</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border/40">
          <p className="text-sm text-muted-foreground mb-2">Job Matches</p>
          <p className="text-3xl font-bold">
            {notifications.filter((n) => n.type === 'job_match').length}
          </p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border/40">
          <p className="text-sm text-muted-foreground mb-2">Applications</p>
          <p className="text-3xl font-bold">
            {notifications.filter((n) => n.type === 'application').length}
          </p>
        </div>
      </div>

      {/* Notifications List with Tabs */}
      <div className="bg-card rounded-xl border border-border/40 overflow-hidden">
        <Tabs value={filter} onValueChange={setFilter} className="w-full">
          <TabsList className="w-full bg-muted p-4 border-b border-border/40 rounded-none">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
            <TabsTrigger value="job_match" className="flex-1">Job Matches</TabsTrigger>
            <TabsTrigger value="application" className="flex-1">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="m-0">
            <div className="divide-y divide-border/40">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="h-4 bg-muted rounded-full w-1/3 mx-auto mb-4 animate-pulse" />
                  <p className="text-muted-foreground">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground mb-2">No notifications</p>
                  <p className="text-sm text-muted-foreground">
                    {filter === 'unread' ? 'You\'re all caught up!' : 'Check back later'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const iconConfig = notificationIcons[notification.type];
                  return (
                    <div
                      key={notification.id}
                      className={`p-5 hover:bg-muted/30 transition-colors border-l-4 ${
                        notification.read ? 'border-l-border/40 bg-muted/20' : 'border-l-primary bg-primary/5'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`text-2xl p-2 rounded-lg ${iconConfig.color}`}>
                          {iconConfig.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{notification.title}</h3>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-red-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toRelativeTime?.() ||
                              new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-muted-foreground"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a href={notification.actionUrl} target="_blank" rel="noopener noreferrer">
                                View
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card rounded-xl p-8 border border-border/40">
        <h3 className="text-lg font-semibold mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { type: 'job_match', label: 'New Job Matches', description: 'Get notified when jobs match your profile' },
            { type: 'application', label: 'Application Updates', description: 'Receive updates on your applications' },
            { type: 'message', label: 'Messages', description: 'Get notified of new messages' },
            { type: 'system', label: 'System Updates', description: 'Important platform updates' },
          ].map((pref) => (
            <label key={pref.type} className="p-4 rounded-lg border border-border/40 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <input type="checkbox" defaultChecked className="h-4 w-4" />
              <div>
                <p className="font-medium">{pref.label}</p>
                <p className="text-sm text-muted-foreground">{pref.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
