import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'new' | 'deadline' | 'status' | 'application';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  scholarshipName?: string;
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

      // Fetch applications
      const appResponse = await fetch(`http://localhost:5000/api/applications/student/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch scholarships to check deadlines
      const schResponse = await fetch('http://localhost:5000/api/scholarships');

      if (appResponse.ok && schResponse.ok) {
        const appData = await appResponse.json();
        const schData = await schResponse.json();

        const generatedNotifications: Notification[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Generate notifications from applications
        if (appData.data) {
          appData.data.forEach((app: any) => {
            const deadlineDate = new Date(app.Deadline);
            const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            // Deadline approaching notification
            if (daysUntilDeadline > 0 && daysUntilDeadline <= 7) {
              generatedNotifications.push({
                id: `deadline-${app.ScholarshipID}`,
                type: 'deadline',
                title: 'Deadline Approaching',
                message: `${app.ScholarshipName} deadline is ${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} away`,
                timestamp: new Date().toISOString(),
                read: false,
                scholarshipName: app.ScholarshipName
              });
            }

            // Application status notifications
            if (app.Status !== 'Pending') {
              const statusType = app.Status === 'Approved' ? 'Approved' : app.Status === 'Rejected' ? 'Rejected' : 'Under Review';
              generatedNotifications.push({
                id: `status-${app.ApplicationID}`,
                type: 'status',
                title: `Application ${statusType}`,
                message: `Your application for ${app.ScholarshipName} has been ${app.Status.toLowerCase()}`,
                timestamp: app.LastUpdated || app.DateApplied,
                read: false,
                scholarshipName: app.ScholarshipName,
                status: app.Status
              });
            }

            // Recent application notification
            const appliedDate = new Date(app.DateApplied);
            const daysAgo = Math.floor((today.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysAgo === 0) {
              generatedNotifications.push({
                id: `applied-${app.ScholarshipID}`,
                type: 'application',
                title: 'Application Submitted',
                message: `You have successfully applied for ${app.ScholarshipName}`,
                timestamp: app.DateApplied,
                read: false,
                scholarshipName: app.ScholarshipName
              });
            }
          });
        }

        // Generate notifications for new scholarships matching student profile
        if (schData.data) {
          const newScholarships = schData.data.slice(0, 3); // Show top 3 new scholarships
          newScholarships.forEach((sch: any) => {
            generatedNotifications.push({
              id: `new-${sch.ScholarshipID}`,
              type: 'new',
              title: 'New Scholarship Available',
              message: `Check out ${sch.ScholarshipName} from ${sch.Provider}`,
              timestamp: new Date().toISOString(),
              read: false,
              scholarshipName: sch.ScholarshipName
            });
          });
        }

        setNotifications(generatedNotifications.reverse());
      } else {
        toast.error('Failed to load notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new':
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
                  className={`transition-all cursor-pointer hover:shadow-md ${
                    notification.read ? 'bg-white' : 'bg-blue-50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
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
                          <div className="flex-shrink-0 text-xs text-[#64748B] whitespace-nowrap ml-2">
                            {getTimeAgo(notification.timestamp)}
                          </div>
                        </div>
                        {notification.status && (
                          <div className="mt-2">
                            <Badge className={
                              notification.status === 'Approved' ? 'bg-[#2ECC71] text-white' :
                              notification.status === 'Rejected' ? 'bg-[#E74C3C] text-white' :
                              'bg-blue-500 text-white'
                            }>
                              {notification.status}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissNotification(notification.id)}
                        className="text-[#64748B] hover:text-[#1A2E5A]"
                      >
                        ×
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

