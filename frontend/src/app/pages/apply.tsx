import { useState } from 'react';
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
import { mockScholarships } from '../lib/mock-data';
import { toast } from 'sonner';

export function ApplyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const scholarship = mockScholarships.find(s => s.id === id);
  
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

  if (!scholarship) {
    return <div>Scholarship not found</div>;
  }

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData({ ...formData, [field]: file });
    if (file) {
      toast.success(`${file.name} uploaded successfully`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
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
                  Your application for <span className="font-semibold text-[#1A2E5A]">{scholarship.name}</span> has been successfully submitted.
                </p>
              </div>

              <div className="bg-[#F8F9FC] rounded-lg p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Scholarship</span>
                  <span className="font-medium text-[#1A2E5A]">{scholarship.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Provider</span>
                  <span className="font-medium text-[#1A2E5A]">{scholarship.provider}</span>
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
    { number: 2, title: 'Documents', description: 'Upload files' },
    { number: 3, title: 'Review', description: 'Review & submit' },
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
            <p className="text-[#64748B] mb-4">{scholarship.name} • {scholarship.provider}</p>
            
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
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Documents */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Supporting Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="transcript">Academic Transcript *</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-[#1A2E5A] transition-colors">
                      <input
                        type="file"
                        id="transcript"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload('transcript', e.target.files?.[0] || null)}
                        required
                      />
                      <label htmlFor="transcript" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-[#64748B] mx-auto mb-2" />
                        <p className="text-sm text-[#1A2E5A] font-medium">
                          {formData.transcript ? formData.transcript.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-[#64748B]">PDF, DOC, DOCX (Max 10MB)</p>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="id">Valid ID *</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-[#1A2E5A] transition-colors">
                      <input
                        type="file"
                        id="id"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('idDocument', e.target.files?.[0] || null)}
                        required
                      />
                      <label htmlFor="id" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-[#64748B] mx-auto mb-2" />
                        <p className="text-sm text-[#1A2E5A] font-medium">
                          {formData.idDocument ? formData.idDocument.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-[#64748B]">PDF, JPG, PNG (Max 5MB)</p>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recommendation">Letter of Recommendation *</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-[#1A2E5A] transition-colors">
                      <input
                        type="file"
                        id="recommendation"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload('recommendation', e.target.files?.[0] || null)}
                        required
                      />
                      <label htmlFor="recommendation" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-[#64748B] mx-auto mb-2" />
                        <p className="text-sm text-[#1A2E5A] font-medium">
                          {formData.recommendation ? formData.recommendation.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-[#64748B]">PDF, DOC, DOCX (Max 10MB)</p>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white"
                      disabled={!formData.transcript || !formData.idDocument || !formData.recommendation}
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
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

                    <div className="bg-[#F8F9FC] rounded-lg p-4">
                      <h4 className="font-semibold text-[#1A2E5A] mb-3">Uploaded Documents</h4>
                      <div className="space-y-2">
                        {formData.transcript && (
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-[#1A2E5A]" />
                            <span className="text-[#64748B]">Transcript: {formData.transcript.name}</span>
                          </div>
                        )}
                        {formData.idDocument && (
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-[#1A2E5A]" />
                            <span className="text-[#64748B]">ID: {formData.idDocument.name}</span>
                          </div>
                        )}
                        {formData.recommendation && (
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-[#1A2E5A]" />
                            <span className="text-[#64748B]">Recommendation: {formData.recommendation.name}</span>
                          </div>
                        )}
                      </div>
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
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
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
