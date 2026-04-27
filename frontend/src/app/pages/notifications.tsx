import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL;

interface Notification {
  NotificationID?: string;
  id?: string;
  Type?: string;
  type?: 'new' | 'deadline' | 'status' | 'application' | string;
  Title?: string;
  title?: string;
  Message?: string;
  message?: string;
  CreatedAt?: string;
  timestamp?: string;
  IsRead?: boolean;
  read?: boolean;
  ScholarshipName?: string;
  scholarshipName?: string;
  ApplicationStatus?: string;
  status?: string;
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!user || !token) {
        setLoading(false);
        return;
      }

      const userData = JSON.parse(user);
      console.log(`📬 Fetching notifications for user: ${userData.id}`);

      // Fetch notifications from database
      const response = await fetch(`${API_URL}/api/notifications/student/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Notifications fetched:`, data.count || 0, 'notifications');
        const transformedNotifications = data.data?.map((notif: any) => ({
          id: String(notif.NotificationID),
          NotificationID: notif.NotificationID,
          type: notif.Type?.toLowerCase() || 'general',
          title: notif.Title,
          message: notif.Message,
          timestamp: notif.CreatedAt,
          read: notif.IsRead,
          IsRead: notif.IsRead,
          scholarshipName: notif.ScholarshipName,
          status: notif.ApplicationStatus
        })) || [];
        setNotifications(transformedNotifications);
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to load notifications:', response.status, errorData.message);
        toast.error(`Failed to load notifications: ${errorData.message}`);
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string | undefined) => {
    const typeStr = (type || 'general').toLowerCase();
    switch (typeStr) {
      case 'new':
      case 'new_scholarship':
        return <Sparkles className="h-5 w-5 text-[#F5A623]" />;
      case 'deadline':
        return <Clock className="h-5 w-5 text-[#E67E22]" />;
      case 'status':
      case 'application':
        return <AlertCircle className="h-5 w-5 text-[#2ECC71]" />;
      default:
        return <Bell className="h-5 w-5 text-[#64748B]" />;
    }
  };

  const markNotificationAsRead = async (id: string, notificationId: string | undefined) => {
    if (!notificationId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const dismissNotification = async (id: string, notificationId: string | undefined) => {
    try {
      const token = localStorage.getItem('token');
      if (notificationId) {
        await fetch(`${API_URL}/api/notifications/${notificationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      setNotifications(notifications.filter(n => n.id !== id));
      toast.success('Notification dismissed');
    } catch (error) {
      console.error('Error dismissing notification:', error);
      toast.error('Failed to dismiss notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!user || !token) return;
      
      const userData = JSON.parse(user);
      const response = await fetch('${API_URL}/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId: userData.id })
      });

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast.success('All notifications marked as read');
      } else {
        toast.error('Failed to mark all as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
        <Navbar />
        <main className="flex-1 container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2E5A]"></div>
            <p className="mt-4 text-[#64748B]">Loading notifications...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read && !n.IsRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-8 pb-24 md:pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl text-[#1A2E5A] mb-2">
                Notifications
              </h1>
              <p className="text-[#64748B]">
                {unreadCount > 0 ? (
                  <>
                    <span className="font-semibold text-[#1A2E5A]">{unreadCount}</span> unread notification{unreadCount !== 1 ? 's' : ''}
                  </>
                ) : (
                  "You're all caught up!"
                )}
              </p>
            </div>

            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#F8F9FC] rounded-full flex items-center justify-center mx-auto">
                  <Bell className="h-10 w-10 text-[#64748B]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1A2E5A]">No notifications</h3>
                <p className="text-[#64748B]">
                  When you have updates, they'll appear here
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => {
                const isRead = notification.read || notification.IsRead;
                return (
                  <Card 
                    key={notification.id}
                    className={`transition-all cursor-pointer hover:shadow-md ${
                      isRead ? 'bg-white' : 'bg-blue-50'
                    }`}
                    onClick={() => !isRead && markNotificationAsRead(notification.id || '', notification.NotificationID?.toString())}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-[#1A2E5A] text-sm">
                                {notification.title}
                              </h3>
                              <p className="text-sm text-[#64748B] mt-1">
                                {notification.message}
                              </p>
                            </div>
                            <div className="shrink-0 text-xs text-[#64748B] whitespace-nowrap ml-2">
                              {getTimeAgo(notification.timestamp || '')}
                            </div>
                          </div>
                          {(notification.status || notification.ApplicationStatus) && (
                            <div className="mt-2">
                              <Badge className={`${
                                (notification.status || notification.ApplicationStatus) === 'Approved' ? 'bg-[#2ECC71] text-white' :
                                (notification.status || notification.ApplicationStatus) === 'Rejected' ? 'bg-[#E74C3C] text-white' :
                                'bg-blue-500 text-white'
                              }`}>
                                {notification.status || notification.ApplicationStatus}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notification.id || '', notification.NotificationID?.toString());
                          }}
                          className="text-[#64748B] hover:text-[#1A2E5A]"
                        >
                          ×
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

