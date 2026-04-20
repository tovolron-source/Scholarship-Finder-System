import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Camera, Save, LogOut, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { toast } from 'sonner';

export function ProfilePage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const savingRef = useRef(false);
  
  const [userData, setUserData] = useState<any>({
    id: '1',
    fullName: 'Your Name',
    email: 'your.email@example.com',
    profilePhoto: undefined,
    gender: '',
    address: '',
    contactNumber: '',
    school: '',
    course: '',
    yearLevel: '',
    gpa: 0,
    financialStatus: 'Middle Income',
    profileCompletion: 20
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(storedUser);
        
        // Redirect admins to their account settings page
        if (user.role === 'admin') {
          navigate('/admin/account-settings');
          return;
        }
        
        const userId = user.id;

        const response = await fetch(`http://localhost:5000/api/auth/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUserData({
              id: data.user.id?.toString() || user.id?.toString() || '1',
              fullName: data.user.FullName || data.user.Name || user.FullName || user.Name || 'Your Name',
              email: data.user.Email || user.Email || 'your.email@example.com',
              profilePhoto: data.user.profilePhoto ? `http://localhost:5000${data.user.profilePhoto}` : user.ProfilePhoto || undefined,
              gender: data.user.gender ?? user.gender ?? user.Gender ?? '',
              address: data.user.address ?? user.address ?? user.Address ?? '',
              contactNumber: data.user.contactNumber ?? user.contactNumber ?? user.ContactNumber ?? '',
              school: data.user.school ?? user.school ?? user.School ?? '',
              course: data.user.course ?? user.course ?? user.Course ?? '',
              yearLevel: data.user.yearLevel ?? user.yearLevel ?? user.YearLevel ?? '',
              gpa: data.user.gpa ?? user.gpa ?? user.GPA ?? 0,
              financialStatus: (data.user.financialStatus ?? user.financialStatus ?? user.FinancialStatus ?? 'Middle Income') as any,
              profileCompletion: data.user.profileCompletion ?? user.profileCompletion ?? user.ProfileCompletion ?? 20
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handlePhotoUpload = async () => {
    if (!selectedFile || uploadingPhoto) return;

    setUploadingPhoto(true);
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!storedUser || !token) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user.id;

      const formData = new FormData();
      formData.append('profilePhoto', selectedFile);

      const response = await fetch(`http://localhost:5000/api/auth/upload-profile-photo/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserData((prev: any) => ({
            ...prev,
            profilePhoto: `http://localhost:5000${data.profilePhoto}`
          }));

          const updatedUser = {
            ...user,
            ProfilePhoto: `http://localhost:5000${data.profilePhoto}`,
            profilePhoto: `http://localhost:5000${data.profilePhoto}`
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));

          toast.success('Profile photo uploaded successfully!');
          setSelectedFile(null);
        } else {
          toast.error(data.message || 'Failed to upload profile photo');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to upload profile photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('An error occurred while uploading');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSaveProfile = async () => {
    if (savingRef.current || isSaving) {
      console.warn('Save already in progress');
      return;
    }

    if (!userData.fullName || userData.fullName.trim() === '') {
      toast.error('Full name is required');
      return;
    }

    savingRef.current = true;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!storedUser || !token) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user.id;

      const profilePhotoPath = userData.profilePhoto?.replace('http://localhost:5000', '');

      const response = await fetch(`http://localhost:5000/api/auth/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          gender: userData.gender,
          address: userData.address,
          contactNumber: userData.contactNumber,
          school: userData.school,
          course: userData.course,
          yearLevel: userData.yearLevel,
          gpa: Number.isFinite(userData.gpa) ? userData.gpa : undefined,
          financialStatus: userData.financialStatus,
          profilePhoto: profilePhotoPath,
          profileCompletion: Math.min(userData.profileCompletion + 10, 100)
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          const remoteProfilePhoto = data.user.profilePhoto ? `http://localhost:5000${data.user.profilePhoto}` : userData.profilePhoto;
          const updatedUser = {
            ...user,
            fullName: data.user.fullName || userData.fullName,
            FullName: data.user.fullName || userData.fullName,
            Name: data.user.Name || userData.fullName || user.Name,
            Email: data.user.Email || userData.email,
            email: data.user.Email || userData.email,
            gender: data.user.gender || userData.gender,
            Gender: data.user.gender || userData.gender,
            address: data.user.address || userData.address,
            Address: data.user.address || userData.address,
            contactNumber: data.user.contactNumber || userData.contactNumber,
            ContactNumber: data.user.contactNumber || userData.contactNumber,
            school: data.user.school || userData.school,
            School: data.user.school || userData.school,
            course: data.user.course || userData.course,
            Course: data.user.course || userData.course,
            yearLevel: data.user.yearLevel || userData.yearLevel,
            YearLevel: data.user.yearLevel || userData.yearLevel,
            gpa: data.user.gpa !== undefined ? data.user.gpa : userData.gpa,
            GPA: data.user.gpa !== undefined ? data.user.gpa : userData.gpa,
            financialStatus: data.user.financialStatus || userData.financialStatus,
            FinancialStatus: data.user.financialStatus || userData.financialStatus,
            profilePhoto: remoteProfilePhoto,
            ProfilePhoto: remoteProfilePhoto,
            profileCompletion: data.user.profileCompletion !== undefined ? data.user.profileCompletion : userData.profileCompletion,
            ProfileCompletion: data.user.profileCompletion !== undefined ? data.user.profileCompletion : userData.profileCompletion
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          setUserData({
            id: data.user.id?.toString() || userData.id,
            fullName: data.user.fullName || userData.fullName,
            email: data.user.Email || userData.email,
            gender: data.user.gender || userData.gender,
            address: data.user.address || userData.address,
            contactNumber: data.user.contactNumber || userData.contactNumber,
            school: data.user.school || userData.school,
            course: data.user.course || userData.course,
            yearLevel: data.user.yearLevel || userData.yearLevel,
            gpa: data.user.gpa !== undefined ? data.user.gpa : userData.gpa,
            financialStatus: data.user.financialStatus || userData.financialStatus,
            profileCompletion: data.user.profileCompletion !== undefined ? data.user.profileCompletion : userData.profileCompletion,
            profilePhoto: remoteProfilePhoto
          });
          
          toast.success('Profile updated successfully!');
        } else {
          toast.error(data.message || 'Failed to update profile');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('An error occurred while saving');
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData.email) {
      toast.error('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const user = JSON.parse(storedUser!);

      const response = await fetch(`http://localhost:5000/api/admin/change-email/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          newEmail: userData.email,
          password: passwordData.currentPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Email updated successfully');
        const updatedUser = { ...user, Email: userData.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
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
      const storedUser = localStorage.getItem('user');
      const user = JSON.parse(storedUser!);

      const response = await fetch(`http://localhost:5000/api/admin/change-password/${user.id}`, {
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
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
        <Navbar />
        <main className="flex-1 container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-96">
            <p className="text-[#64748B]">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-8 pb-24 md:pb-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#1A2E5A]">My Profile</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Profile Header with Avatar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative group">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={userData.profilePhoto} alt={userData.fullName} />
                  <AvatarFallback className="bg-[#1A2E5A] text-white text-4xl">
                    {userData.fullName.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="h-8 w-8 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-[#1A2E5A] mb-2">{userData.fullName}</h2>
                <p className="text-[#64748B] mb-4">{userData.email}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748B]">Profile Completion</span>
                    <span className="text-sm font-semibold text-[#1A2E5A]">{userData.profileCompletion}%</span>
                  </div>
                  <Progress value={userData.profileCompletion} className="h-2" />
                </div>

                {selectedFile && (
                  <Button
                    onClick={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="profile">Profile Info</TabsTrigger>
                <TabsTrigger value="account">Account Settings</TabsTrigger>
              </TabsList>

              {/* Profile Info Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="font-semibold text-[#1A2E5A] mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={userData.fullName}
                          onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={userData.gender || 'not-selected'} onValueChange={(value) => setUserData({ ...userData, gender: value === 'not-selected' ? '' : value })}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={userData.address}
                          onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                          id="contactNumber"
                          value={userData.contactNumber}
                          onChange={(e) => setUserData({ ...userData, contactNumber: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h3 className="font-semibold text-[#1A2E5A] mb-4">Academic Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="school">School/University</Label>
                        <Input
                          id="school"
                          value={userData.school}
                          onChange={(e) => setUserData({ ...userData, school: e.target.value })}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="course">Course/Degree</Label>
                        <Input
                          id="course"
                          value={userData.course}
                          onChange={(e) => setUserData({ ...userData, course: e.target.value })}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="yearLevel">Year Level</Label>
                        <Select value={userData.yearLevel || 'not-selected'} onValueChange={(value) => setUserData({ ...userData, yearLevel: value === 'not-selected' ? '' : value })}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select Year Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1st Year">1st Year</SelectItem>
                            <SelectItem value="2nd Year">2nd Year</SelectItem>
                            <SelectItem value="3rd Year">3rd Year</SelectItem>
                            <SelectItem value="4th Year">4th Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="gwa">GWA (Grade Weighted Average)</Label>
                        <Input
                          id="gwa"
                          type="number"
                          min="1.0"
                          max="5.0"
                          step="0.1"
                          value={userData.gpa || ''}
                          onChange={(e) => setUserData({ ...userData, gpa: parseFloat(e.target.value) || 0 })}
                          placeholder="1.0 - 5.0"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Status */}
                <div>
                  <Label htmlFor="financialStatus">Financial Status</Label>
                  <Select value={userData.financialStatus || 'not-selected'} onValueChange={(value) => setUserData({ ...userData, financialStatus: value === 'not-selected' ? '' : value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select Financial Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low Income">Low Income</SelectItem>
                      <SelectItem value="Middle Income">Middle Income</SelectItem>
                      <SelectItem value="High Income">High Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Profile Changes'}
                </Button>
              </TabsContent>

              {/* Account Settings Tab */}
              <TabsContent value="account" className="space-y-6">
                <h3 className="font-semibold text-[#1A2E5A] mb-4">Account Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Change Email Section */}
                  <div>
                    <h4 className="font-medium text-[#1A2E5A] mb-4">Change Email</h4>
                    <form onSubmit={handleChangeEmail} className="space-y-4">
                      <div>
                        <Label htmlFor="new-email">New Email Address</Label>
                        <Input
                          id="new-email"
                          type="email"
                          placeholder="Enter new email address"
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
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

                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Email'}
                      </Button>
                    </form>
                  </div>

                  {/* Change Password Section */}
                  <div>
                    <h4 className="font-medium text-[#1A2E5A] mb-4">Change Password</h4>
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
                        {isSaving ? 'Saving...' : 'Save Password'}
                      </Button>
                    </form>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
