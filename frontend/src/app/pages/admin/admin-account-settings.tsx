import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Save, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';

export function AdminAccountSettingsPage() {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!user || !token) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      navigate('/profile');
      return;
    }

    setUserData(userData);
    setEmailData({ newEmail: userData.Email || '', password: '' });
  }, [navigate]);

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailData.newEmail || !emailData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.newEmail)) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/change-email/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          newEmail: emailData.newEmail,
          password: emailData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Email updated successfully');
        const updatedUser = { ...userData, Email: emailData.newEmail };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setEmailData({ newEmail: emailData.newEmail, password: '' });
      } else {
        toast.error(data.message || 'Failed to change email');
      }
    } catch (error) {
      console.error('Error changing email:', error);
      toast.error('Failed to change email');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/change-password/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/admin/dashboard')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-[#1A2E5A]">Account Settings</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Account Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Admin Account Information</CardTitle>
            <CardDescription>Your current account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-[#64748B]">Name</Label>
              <p className="text-lg font-semibold text-[#1A2E5A]">{userData.Name || userData.fullName}</p>
            </div>
            <div>
              <Label className="text-[#64748B]">Current Email</Label>
              <p className="text-lg font-semibold text-[#1A2E5A]">{userData.Email}</p>
            </div>
            <div>
              <Label className="text-[#64748B]">Role</Label>
              <p className="text-lg font-semibold text-blue-600 capitalize">{userData.role}</p>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Change Email</TabsTrigger>
                <TabsTrigger value="password">Change Password</TabsTrigger>
              </TabsList>

              {/* Change Email Tab */}
              <TabsContent value="email" className="space-y-6 mt-6">
                <form onSubmit={handleChangeEmail} className="space-y-4">
                  <div>
                    <Label htmlFor="new-email">New Email Address</Label>
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="Enter new email address"
                      value={emailData.newEmail}
                      onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email-password">Current Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="email-password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Enter your current password"
                        value={emailData.password}
                        onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Email Changes'}
                  </Button>
                </form>
              </TabsContent>

              {/* Change Password Tab */}
              <TabsContent value="password" className="space-y-6 mt-6">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Enter your current password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Password Changes'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
