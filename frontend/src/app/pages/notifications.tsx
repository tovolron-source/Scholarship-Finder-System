import { useState } from 'react';
import { Bell, CheckCheck, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { toast } from 'sonner';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new':
        return <Sparkles className="h-5 w-5 text-[#F5A623]" />;
      case 'deadline':
        return <Clock className="h-5 w-5 text-[#E67E22]" />;
      case 'status':
        return <AlertCircle className="h-5 w-5 text-[#2ECC71]" />;
      default:
        return <Bell className="h-5 w-5 text-[#64748B]" />;
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
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

  const unreadCount = notifications.filter(n => !n.read).length;

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
              {notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  onClick={() => dismissNotification(notification.id)}
                  className={`transition-all cursor-pointer hover:shadow-md ${
                    notification.read 
                      ? 'bg-white' 
                      : 'bg-blue-50 border-l-4 border-l-[#1A2E5A]'
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        notification.type === 'new' ? 'bg-[#F5A623]/10' :
                        notification.type === 'deadline' ? 'bg-[#E67E22]/10' :
                        'bg-[#2ECC71]/10'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-[#1A2E5A]">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <Badge className="bg-[#1A2E5A] text-white text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-[#64748B] mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#64748B]">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                          <span className="text-xs text-[#64748B] italic">
                            Click to dismiss
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Notification Settings */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-[#1A2E5A] mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1A2E5A]">Email Notifications</p>
                    <p className="text-sm text-[#64748B]">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1A2E5A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A2E5A]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1A2E5A]">Deadline Reminders</p>
                    <p className="text-sm text-[#64748B]">Get reminded about upcoming deadlines</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1A2E5A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A2E5A]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1A2E5A]">New Scholarship Matches</p>
                    <p className="text-sm text-[#64748B]">Notify when new scholarships match your profile</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1A2E5A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A2E5A]"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
