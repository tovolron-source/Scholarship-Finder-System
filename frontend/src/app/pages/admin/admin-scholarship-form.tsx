import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';

export function CreateScholarshipPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    ScholarshipName: '',
    Provider: '',
    Type: 'Merit',
    Description: '',
    Amount: '',
    Slots: '',
    Deadline: '',
    ApplicationMethod: '',
    GoogleFormLink: '',
    ProviderContact: '',
  });

  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState('');
  
  const [applicationProcess, setApplicationProcess] = useState<string[]>([]);
  const [newStep, setNewStep] = useState('');

  const [eligibility, setEligibility] = useState({
    gwa: '',
    courses: '',
    yearLevel: ''
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      navigate('/search');
      return;
    }

    if (isEdit && id) {
      fetchScholarship(parseInt(id));
    }
  }, [navigate, id, isEdit]);

  const fetchScholarship = async (scholarshipId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/scholarships/${scholarshipId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const scholarship = data.data;
        setFormData({
          ScholarshipName: scholarship.ScholarshipName,
          Provider: scholarship.Provider,
          Type: scholarship.Type,
          Description: scholarship.Description || '',
          Amount: scholarship.Amount || '',
          Slots: scholarship.Slots || '',
          Deadline: scholarship.Deadline ? scholarship.Deadline.split('T')[0] : '',
          ApplicationMethod: scholarship.ApplicationMethod || '',
          GoogleFormLink: scholarship.GoogleFormLink || '',
          ProviderContact: scholarship.ProviderContact || '',
        });

        // Parse Benefits
        try {
          const benefitsData = typeof scholarship.Benefits === 'string' ? JSON.parse(scholarship.Benefits) : scholarship.Benefits;
          setBenefits(Array.isArray(benefitsData) ? benefitsData : []);
        } catch {
          setBenefits([]);
        }

        // Parse Application Process
        try {
          const processData = typeof scholarship.ApplicationProcess === 'string' ? JSON.parse(scholarship.ApplicationProcess) : scholarship.ApplicationProcess;
          setApplicationProcess(Array.isArray(processData) ? processData : []);
        } catch {
          setApplicationProcess([]);
        }

        // Parse Eligibility Requirements
        try {
          const eligData = typeof scholarship.EligibilityRequirements === 'string' ? JSON.parse(scholarship.EligibilityRequirements) : scholarship.EligibilityRequirements;
          setEligibility({
            gwa: eligData?.gwa || '',
            courses: eligData?.courses || '',
            yearLevel: eligData?.yearLevel || ''
          });
        } catch {
          setEligibility({ gwa: '', courses: '', yearLevel: '' });
        }
      } else {
        toast.error('Failed to load scholarship');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error fetching scholarship:', error);
      toast.error('Failed to load scholarship');
      navigate('/admin/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ScholarshipName || !formData.Provider || !formData.Type) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      const url = isEdit
        ? `http://localhost:5000/api/admin/scholarships/${id}`
        : 'http://localhost:5000/api/admin/scholarships';

      const method = isEdit ? 'PUT' : 'POST';

      const submitData = {
        ...formData,
        Benefits: JSON.stringify(benefits),
        ApplicationProcess: JSON.stringify(applicationProcess),
        EligibilityRequirements: JSON.stringify(eligibility)
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(isEdit ? 'Scholarship updated successfully' : 'Scholarship created successfully');
        navigate('/admin/dashboard');
      } else {
        toast.error(data.message || 'Failed to save scholarship');
      }
    } catch (error) {
      console.error('Error saving scholarship:', error);
      toast.error('Failed to save scholarship');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/admin/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold text-[#1A2E5A]">
            {isEdit ? 'Edit Scholarship' : 'Create New Scholarship'}
          </h1>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1A2E5A]">
              {isEdit ? 'Edit Scholarship Details' : 'Scholarship Information'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1A2E5A]">Basic Information</h3>
                
                <div>
                  <Label htmlFor="name">Scholarship Name *</Label>
                  <Input
                    id="name"
                    value={formData.ScholarshipName}
                    onChange={(e) => setFormData({ ...formData, ScholarshipName: e.target.value })}
                    placeholder="Enter scholarship name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="provider">Provider *</Label>
                  <Input
                    id="provider"
                    value={formData.Provider}
                    onChange={(e) => setFormData({ ...formData, Provider: e.target.value })}
                    placeholder="Enter provider name"
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select value={formData.Type} onValueChange={(value) => setFormData({ ...formData, Type: value })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Merit">Merit</SelectItem>
                        <SelectItem value="Need-based">Need-based</SelectItem>
                        <SelectItem value="Athletic">Athletic</SelectItem>
                        <SelectItem value="Government">Government</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="contact">Provider Contact</Label>
                    <Input
                      id="contact"
                      value={formData.ProviderContact}
                      onChange={(e) => setFormData({ ...formData, ProviderContact: e.target.value })}
                      placeholder="Email or phone"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Description & Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1A2E5A]">Description & Details</h3>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.Description}
                    onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                    placeholder="Scholarship description"
                    className="mt-2"
                    rows={4}
                  />
                </div>

                {/* Benefits List */}
                <div>
                  <Label>Benefits</Label>
                  <div className="mt-2 space-y-2">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={benefit}
                          onChange={(e) => {
                            const newBenefits = [...benefits];
                            newBenefits[index] = e.target.value;
                            setBenefits(newBenefits);
                          }}
                          placeholder={`Benefit ${index + 1}`}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setBenefits(benefits.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        placeholder="Add new benefit"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newBenefit.trim()) {
                            setBenefits([...benefits, newBenefit]);
                            setNewBenefit('');
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1A2E5A]">Financial Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      value={formData.Amount}
                      onChange={(e) => setFormData({ ...formData, Amount: e.target.value })}
                      placeholder="e.g., $5,000/year"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="slots">Available Slots</Label>
                    <Input
                      id="slots"
                      type="number"
                      value={formData.Slots}
                      onChange={(e) => setFormData({ ...formData, Slots: e.target.value })}
                      placeholder="Number of slots"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.Deadline}
                      onChange={(e) => setFormData({ ...formData, Deadline: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Application Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1A2E5A]">Application Information</h3>

                <div>
                  <Label htmlFor="method">Application Method</Label>
                  <Input
                    id="method"
                    value={formData.ApplicationMethod}
                    onChange={(e) => setFormData({ ...formData, ApplicationMethod: e.target.value })}
                    placeholder="e.g., Online Application, University Portal"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="form-link">Google Form Link</Label>
                  <Input
                    id="form-link"
                    value={formData.GoogleFormLink}
                    onChange={(e) => setFormData({ ...formData, GoogleFormLink: e.target.value })}
                    placeholder="https://forms.google.com/..."
                    className="mt-2"
                  />
                </div>

                {/* Application Process */}
                <div>
                  <Label>Application Process Steps</Label>
                  <div className="mt-2 space-y-2">
                    {applicationProcess.map((step, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#1A2E5A] min-w-12">Step {index + 1}:</span>
                        <Input
                          value={step}
                          onChange={(e) => {
                            const newProcess = [...applicationProcess];
                            newProcess[index] = e.target.value;
                            setApplicationProcess(newProcess);
                          }}
                          placeholder={`Step ${index + 1} description`}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setApplicationProcess(applicationProcess.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#1A2E5A] min-w-12">Step {applicationProcess.length + 1}:</span>
                      <Input
                        value={newStep}
                        onChange={(e) => setNewStep(e.target.value)}
                        placeholder={`Step ${applicationProcess.length + 1} description`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newStep.trim()) {
                            setApplicationProcess([...applicationProcess, newStep]);
                            setNewStep('');
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eligibility Requirements */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1A2E5A]">Eligibility Requirements</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="gwa">Minimum GWA (Grade Weighted Average)</Label>
                    <Input
                      id="gwa"
                      type="number"
                      step="0.01"
                      value={eligibility.gwa}
                      onChange={(e) => setEligibility({ ...eligibility, gwa: e.target.value })}
                      placeholder="e.g., 3.0"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="courses">Required Courses</Label>
                    <Input
                      id="courses"
                      value={eligibility.courses}
                      onChange={(e) => setEligibility({ ...eligibility, courses: e.target.value })}
                      placeholder="e.g., Computer Science, Mathematics"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="yearLevel">Year Level</Label>
                    <Select value={eligibility.yearLevel} onValueChange={(value) => setEligibility({ ...eligibility, yearLevel: value })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select year level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any Year">Any Year</SelectItem>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : isEdit ? 'Update Scholarship' : 'Create Scholarship'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
