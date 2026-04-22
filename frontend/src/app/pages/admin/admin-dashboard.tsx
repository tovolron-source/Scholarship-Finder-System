import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Edit, Trash2, Plus, Search, ArrowUpDown, LogOut, X, ChevronLeft, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Navbar } from '../../components/layout/navbar';
import { Footer } from '../../components/layout/footer';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { toast } from 'sonner';

interface Scholarship {
  ScholarshipID: number;
  ScholarshipName: string;
  Provider: string;
  Type: string;
  Amount: string;
  Deadline: string;
  Slots: number;
}

interface Applicant {
  ApplicationID: number;
  UserID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Address: string;
  AppliedDate: string;
  Status: string;
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'deadline' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!user || !token) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      navigate('/search');
      return;
    }

    fetchScholarships();
  }, [navigate]);

  const fetchScholarships = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/scholarships', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setScholarships(data.data || []);
      } else {
        toast.error('Failed to load scholarships');
      }
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      toast.error('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/scholarships/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Scholarship deleted successfully');
        fetchScholarships();
        setDeleteId(null);
      } else {
        toast.error('Failed to delete scholarship');
      }
    } catch (error) {
      console.error('Error deleting scholarship:', error);
      toast.error('Failed to delete scholarship');
    }
  };

  const fetchApplicants = async (scholarshipId: number) => {
    setLoadingApplicants(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/scholarships/${scholarshipId}/applicants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplicants(data.data || []);
      } else {
        toast.error('Failed to load applicants');
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
      toast.error('Failed to load applicants');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleSelectScholarship = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    fetchApplicants(scholarship.ScholarshipID);
  };

  const handleApproveApplication = async (applicationId: number) => {
    setApprovingId(applicationId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Application approved successfully');
        fetchApplicants(selectedScholarship!.ScholarshipID);
      } else {
        toast.error('Failed to approve application');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Failed to approve application');
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectApplication = async (applicationId: number) => {
    setApprovingId(applicationId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Application rejected successfully');
        fetchApplicants(selectedScholarship!.ScholarshipID);
      } else {
        toast.error('Failed to reject application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    } finally {
      setApprovingId(null);
    }
  };

  const filteredScholarships = scholarships.filter(s =>
    s.ScholarshipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.Provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case 'name':
        compareValue = a.ScholarshipName.localeCompare(b.ScholarshipName);
        break;
      case 'deadline':
        compareValue = new Date(a.Deadline || '').getTime() - new Date(b.Deadline || '').getTime();
        break;
      case 'type':
        compareValue = a.Type.localeCompare(b.Type);
        break;
    }

    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <Navbar />
      
      {selectedScholarship ? (
        // Detail View - Applicants
        <main className="flex-1 container mx-auto px-6 py-8 pb-24 md:pb-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedScholarship(null);
                setApplicants([]);
              }}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Scholarships
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A2E5A]">
              {selectedScholarship.ScholarshipName}
            </h1>
            <p className="text-[#64748B] mt-2">{selectedScholarship.Provider}</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div>
                <p className="text-sm text-[#64748B]">Type</p>
                <p className="font-semibold text-[#1A2E5A]">{selectedScholarship.Type}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B]">Amount</p>
                <p className="font-semibold text-[#1A2E5A]">{selectedScholarship.Amount || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B]">Deadline</p>
                <p className="font-semibold text-[#1A2E5A]">
                  {selectedScholarship.Deadline ? new Date(selectedScholarship.Deadline).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#64748B]">Available Slots</p>
                <p className="font-semibold text-[#1A2E5A]">{selectedScholarship.Slots}</p>
              </div>
            </div>
          </div>

          {/* Applicants List */}
          <div>
            <h2 className="text-2xl font-bold text-[#1A2E5A] mb-6">
              Applicants ({applicants.length})
            </h2>

            {loadingApplicants ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-[#64748B]">Loading applicants...</p>
              </div>
            ) : applicants.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-[#64748B]">No applicants for this scholarship</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applicants.map((applicant) => (
                  <Card key={applicant.ApplicationID} className="border border-gray-200 hover:shadow-lg transition">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div>
                          <h3 className="font-semibold text-[#1A2E5A]">
                            {applicant.FirstName} {applicant.LastName}
                          </h3>
                          <p className="text-sm text-[#64748B]">{applicant.Email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#64748B]">Phone</p>
                          <p className="font-medium text-[#1A2E5A]">{applicant.PhoneNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#64748B]">Address</p>
                          <p className="font-medium text-[#1A2E5A] line-clamp-2">{applicant.Address || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#64748B]">Applied Date</p>
                          <p className="font-medium text-[#1A2E5A]">
                            {applicant.AppliedDate ? new Date(applicant.AppliedDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#64748B]">Status</p>
                          <p className={`font-medium ${
                            applicant.Status === 'approved' ? 'text-green-600' :
                            applicant.Status === 'rejected' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {applicant.Status || 'Pending'}
                          </p>
                        </div>
                        <div className="flex gap-2 justify-end">
                          {applicant.Status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApproveApplication(applicant.ApplicationID)}
                                disabled={approvingId !== null}
                                className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectApplication(applicant.ApplicationID)}
                                disabled={approvingId !== null}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {applicant.Status !== 'pending' && (
                            <span className={`px-3 py-1 rounded text-xs font-medium ${
                              applicant.Status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {applicant.Status === 'approved' ? 'Approved' : 'Rejected'}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      ) : (
        // List View - Scholarships
        <main className="flex-1 container mx-auto px-6 py-8 pb-24 md:pb-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-5xl md:text-3xl font-bold text-[#1A2E5A]">Dashboard</h1>
              <p className="text-[#64748B] mt-1">Manage scholarships</p>
            </div>
          </div>

          {/* Controls */}
          <Card className="mb-6 shadow-sm">
            <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              {/* Search and Add */}
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full md:w-auto">
                  <label className="block text-sm font-medium text-[#1A2E5A] mb-2">
                    Search Scholarships
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search by name or provider..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/admin/create-scholarship')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Scholarship
                </Button>
              </div>

              {/* Sort Controls */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#1A2E5A] mb-2">
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="type">Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#1A2E5A] mb-2">
                    Order
                  </label>
                  <Button
                    variant="outline"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  </Button>
                </div>
              </div>
            </div>
            </CardContent>
          </Card>

          {/* Scholarship List */}
          {loading ? (
            <div className="flex items-center justify-center py-twelve">
              <p className="text-[#64748B]">Loading scholarships...</p>
            </div>
          ) : sortedScholarships.length === 0 ? (
            <div className="flex items-center justify-center py-twelve">
              <p className="text-[#64748B]">No scholarships found</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {sortedScholarships.map((scholarship) => (
                <Card 
                  key={scholarship.ScholarshipID} 
                  className="hover:shadow-lg transition border border-gray-200 cursor-pointer"
                  onClick={() => handleSelectScholarship(scholarship)}
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div>
                        <h3 className="font-semibold text-[#1A2E5A] line-clamp-2 hover:text-blue-600">
                          {scholarship.ScholarshipName}
                        </h3>
                        <p className="text-sm text-[#64748B]">{scholarship.Provider}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B]">Type</p>
                        <p className="font-medium text-[#1A2E5A]">{scholarship.Type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B]">Amount</p>
                        <p className="font-medium text-[#1A2E5A]">{scholarship.Amount || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B]">Deadline</p>
                        <p className="font-medium text-[#1A2E5A]">
                          {scholarship.Deadline ? new Date(scholarship.Deadline).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/edit-scholarship/${scholarship.ScholarshipID}`);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(scholarship.ScholarshipID);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scholarship</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scholarship? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
