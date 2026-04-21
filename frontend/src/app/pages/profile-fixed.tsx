import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Camera, Save, LogOut } from 'lucide-react';
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
import { throttle } from '../lib/debounce';

export function ProfilePage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

  const handleSave = async () => {
    if (savingRef.current || isSaving) {
      console.warn('Save already in progress');
      return;
    }

    if (!userData.fullName || userData.fullName.trim() === '') {
      toast.error('Full name is required');
      return;
    }

    if (!userData.email || userData.email.trim() === '') {
      toast.error('Email is required');
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-8 pb-24 md:pb-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-[#64748B]">Loading profile...</p>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={userData.profilePhoto} alt={userData.fullName} />
                        <AvatarFallback className="bg-[#1A2E5A] text-white text-2xl">
                          {userData.fullName.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Camera className="h-6 w-6 text-white" />
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
                      <h1 className="text-2xl font-semibold text-[#1A2E5A] mb-1">{userData.fullName}</h1>
                      <p className="text-[#64748B] mb-4">{userData.email}</p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {userData.gender && (
                          <div>
                            <p className="text-xs text-[#64748B] mb-1">Gender</p>
                            <p className="text-sm font-semibold text-[#1A2E5A]">{userData.gender}</p>
                          </div>
                        )}
                        {userData.gpa && Number.isFinite(userData.gpa) && userData.gpa > 0 && (
                          <div>
                            <p className="text-xs text-[#64748B] mb-1">GWA</p>
                            <p className="text-sm font-semibold text-[#1A2E5A]">{Number(userData.gwa).toFixed(2)} / 5.0</p>
                          </div>
                        )}
                        {userData.address && (
                          <div>
                            <p className="text-xs text-[#64748B] mb-1">Address</p>
                            <p className="text-sm font-semibold text-[#1A2E5A] truncate">{userData.address}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#64748B]">Profile Completion</span>
                          <span className="text-sm font-semibold text-[#1A2E5A]">{userData.profileCompletion}%</span>
                        </div>
                        <Progress value={userData.profileCompletion} className="h-2" />
                        <p className="text-xs text-[#64748B]">
                          Complete your profile for better scholarship matches!
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Photo Upload Section */}
            {selectedFile && (
              <div className="mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Selected"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-[#64748B]">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                          disabled={uploadingPhoto}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handlePhotoUpload}
                          disabled={uploadingPhoto}
                        >
                          {uploadingPhoto ? 'Uploading...' : 'Upload'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Profile Sections */}
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="academic">Academic Info</TabsTrigger>
                <TabsTrigger value="financial">Financial Status</TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={userData.fullName}
                          onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          placeholder="john.doe@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Contact Number</Label>
                        <Input
                          id="phone"
                          value={userData.contactNumber}
                          onChange={(e) => setUserData({ ...userData, contactNumber: e.target.value })}
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={userData.gender}
                          onValueChange={(value) => setUserData({ ...userData, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={userData.address}
                          onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                          placeholder="123 Main Street, City, State, ZIP"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Mobile Logout Button - After Personal Info */}
              {true && (
                <div className="md:hidden">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full text-[#E74C3C] border-[#E74C3C] hover:bg-[#E74C3C] hover:text-white"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              )}

              {/* Academic Info Tab */}
              <TabsContent value="academic">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="school">School/University</Label>
                        <Input
                          id="school"
                          value={userData.school}
                          onChange={(e) => setUserData({ ...userData, school: e.target.value })}
                          placeholder="State University"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="course">Course/Program</Label>
                        <Input
                          id="course"
                          value={userData.course}
                          onChange={(e) => setUserData({ ...userData, course: e.target.value })}
                          placeholder="BS Computer Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearLevel">Year Level</Label>
                        <Select
                          value={userData.yearLevel}
                          onValueChange={(value) => setUserData({ ...userData, yearLevel: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1st Year">1st Year</SelectItem>
                            <SelectItem value="2nd Year">2nd Year</SelectItem>
                            <SelectItem value="3rd Year">3rd Year</SelectItem>
                            <SelectItem value="4th Year">4th Year</SelectItem>
                            <SelectItem value="Graduate">Graduate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gwa">GWA (Grade Weighted Average)</Label>
                        <Input
                          id="gwa"
                          type="number"
                          step="0.01"
                          min="0"
                          max="5.0"
                          value={userData.gwa}
                          onChange={(e) => setUserData({ ...userData, gwa: parseFloat(e.target.value) })}
                          placeholder="3.5"
                        />
                      </div>
                    </div>

                    {userData.gwa && (
                      <div className="space-y-2 bg-[#F8F9FC] p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#64748B]">GWA Score</span>
                          <span className="text-sm font-semibold text-[#1A2E5A]">{userData.gwa} / 5.0</span>
                        </div>
                        <Progress value={((5.0 - userData.gwa) / 5.0) * 100} className="h-2" />
                        <p className="text-xs text-[#64748B]">
                          {userData.gwa <= 1.5 ? 'Excellent! You qualify for most merit scholarships.' : 
                           userData.gwa <= 2.5 ? 'Good standing. Many scholarships available.' : 
                           'Consider improving your GWA for more opportunities.'}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Financial Status Tab */}
              <TabsContent value="financial">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="financialStatus">Financial Status</Label>
                      <Select
                        value={userData.financialStatus}
                        onValueChange={(value: any) => setUserData({ ...userData, financialStatus: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select financial status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low Income">Low Income</SelectItem>
                          <SelectItem value="Middle Income">Middle Income</SelectItem>
                          <SelectItem value="High Income">High Income</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-[#64748B]">
                        This information helps us match you with need-based scholarships. 
                        Your financial data is kept confidential.
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-[#1A2E5A] mb-2">Why we ask this?</h4>
                      <p className="text-sm text-[#64748B]">
                        Many scholarship programs prioritize students based on financial need. 
                        Providing this information increases your chances of being matched with 
                        relevant need-based scholarships.
                      </p>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
