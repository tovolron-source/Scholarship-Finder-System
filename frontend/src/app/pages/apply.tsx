import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { ArrowLeft, Upload, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Progress } from '../components/ui/progress';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { toast } from 'sonner';

export function ApplyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    personalStatement: '',
    transcript: null as File | null,
    idDocument: null as File | null,
    recommendation: null as File | null,
    certify: false,
  });

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/scholarships/${id}`);
        if (response.ok) {
          const data = await response.json();
          setScholarship(data.data);
        } else {
          throw new Error('Scholarship not found');
        }
      } catch (error) {
        console.error('Error fetching scholarship:', error);
        toast.error('Failed to load scholarship');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchScholarship();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
        <Navbar />
        <main className="flex-1 container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2E5A]"></div>
            <p className="mt-4 text-[#64748B]">Loading scholarship information...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData({ ...formData, [field]: file });
    if (file) {
      toast.success(`${file.name} uploaded successfully`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.certify) {
      toast.error('Please certify that your information is accurate');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!user || !token) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(user);
      
      // Create FormData to handle file uploads
      const applicationFormData = new FormData();
      applicationFormData.append('StudentID', userData.id);
      applicationFormData.append('ScholarshipID', id!);
      applicationFormData.append('PersonalStatement', formData.personalStatement);
      
      // Add file uploads if they exist
      if (formData.transcript) {
        applicationFormData.append('transcript', formData.transcript);
      }
      if (formData.idDocument) {
        applicationFormData.append('idDocument', formData.idDocument);
      }
      if (formData.recommendation) {
        applicationFormData.append('recommendation', formData.recommendation);
      }
      
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: applicationFormData
      });

      if (response.ok) {
        toast.success('Application submitted successfully!');
        setShowSuccess(true);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    toast.success('Application saved as draft');
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-6 py-8 flex items-center justify-center pb-24 md:pb-8">
          <Card className="max-w-2xl w-full">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-[#2ECC71]/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-12 w-12 text-[#2ECC71]" />
              </div>
              
              <div className="space-y-2">
                <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl text-[#1A2E5A]">
                  Application Submitted!
                </h2>
                <p className="text-[#64748B]">
                  Your application for <span className="font-semibold text-[#1A2E5A]">{scholarship.name || scholarship.ScholarshipName}</span> has been successfully submitted.
                </p>
              </div>

              <div className="bg-[#F8F9FC] rounded-lg p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Scholarship</span>
                  <span className="font-medium text-[#1A2E5A]">{scholarship.name || scholarship.ScholarshipName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Provider</span>
                  <span className="font-medium text-[#1A2E5A]">{scholarship.provider || scholarship.Provider}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Submitted</span>
                  <span className="font-medium text-[#1A2E5A]">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Status</span>
                  <Badge className="bg-[#F5A623] text-white">Pending Review</Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="flex-1 bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white">
                  <Link to="/applications">View My Applications</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/search">Browse More Scholarships</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Details', description: 'Personal statement' },
    // DISABLED: Document upload step - Uploads are temporarily disabled
    // { number: 2, title: 'Documents', description: 'Upload files' },
    { number: 2, title: 'Review', description: 'Review & submit' },
  ];

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-8 pb-24 md:pb-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to={`/scholarship/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Scholarship
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl text-[#1A2E5A] mb-2">
              Apply for Scholarship
            </h1>
            <p className="text-[#64748B] mb-4">{scholarship.name || scholarship.ScholarshipName} • {scholarship.provider || scholarship.Provider}</p>
            
            {/* Progress Stepper */}
            <div className="space-y-4">
              <Progress value={progress} className="h-2" />
              
              <div className="grid grid-cols-3 gap-2">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`text-center ${
                      step.number === currentStep
                        ? 'text-[#1A2E5A]'
                        : step.number < currentStep
                        ? 'text-[#2ECC71]'
                        : 'text-[#64748B]'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          step.number === currentStep
                            ? 'bg-[#1A2E5A] text-white'
                            : step.number < currentStep
                            ? 'bg-[#2ECC71] text-white'
                            : 'bg-gray-200 text-[#64748B]'
                        }`}
                      >
                        {step.number < currentStep ? '✓' : step.number}
                      </div>
                    </div>
                    <p className="text-xs font-medium">{step.title}</p>
                    <p className="text-xs">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Statement */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Statement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="statement">
                      Why are you applying for this scholarship?
                    </Label>
                    <Textarea
                      id="statement"
                      rows={10}
                      placeholder="Share your story, academic goals, and why you deserve this scholarship..."
                      value={formData.personalStatement}
                      onChange={(e) => setFormData({ ...formData, personalStatement: e.target.value })}
                      className="resize-none"
                      required
                    />
                    <div className="flex items-center justify-between text-sm text-[#64748B]">
                      <span>{formData.personalStatement.length} characters</span>
                      <span>Minimum 200 characters recommended</span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={handleSaveDraft}>
                      Save Draft
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white"
                      disabled={formData.personalStatement.length < 50}
                    >
                      Continue to Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Documents - DISABLED FOR NOW */}
            {/* 
              DISABLED CODE: Document upload step
              File: frontend/src/app/pages/apply.tsx (Lines ~350-420)
              This entire step has been disabled because document uploads are temporarily disabled.
              
              The following file upload inputs were disabled:
              - Transcript upload (e-g Input with id="transcript")
              - ID Document upload (e.g. Input with id="id")  
              - Letter of Recommendation upload (e.g. Input with id="recommendation")
              
              The handleFileUpload function and file state management (formData.transcript, 
              formData.idDocument, formData.recommendation) remain in the code but are not used
              in the form submission since files are now optional on the backend.
              
              To re-enable, set currentStep to 3 instead of 2, and uncomment the document upload UI.
            */}

            {/* Step 2: Review & Submit */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-[#F8F9FC] rounded-lg p-4">
                      <h4 className="font-semibold text-[#1A2E5A] mb-2">Personal Statement</h4>
                      <p className="text-sm text-[#64748B] line-clamp-4">{formData.personalStatement}</p>
                    </div>

                    {/* Document upload section disabled - showing notice instead */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900 mb-2">Documents Temporarily Disabled</h4>
                      <p className="text-sm text-yellow-800">
                        Document uploads (transcript, ID, recommendation letter) are temporarily disabled. 
                        You can still submit your application with your personal statement. Documents can be provided later if needed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <Checkbox
                      id="certify"
                      checked={formData.certify}
                      onCheckedChange={(checked) => setFormData({ ...formData, certify: checked as boolean })}
                      required
                    />
                    <label htmlFor="certify" className="text-sm text-[#1A2E5A] leading-relaxed cursor-pointer">
                      I certify that all information provided in this application is accurate and complete to the best of my knowledge.
                    </label>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={handleSaveDraft}>
                        Save Draft
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white"
                        disabled={!formData.certify || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
