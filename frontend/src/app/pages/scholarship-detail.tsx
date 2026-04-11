import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Heart, Share2, CheckCircle2, XCircle, AlertCircle, Calendar, Users, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/breadcrumb';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { mockScholarships, mockSavedScholarships, mockUser } from '../lib/mock-data';
import { toast } from 'sonner';

export function ScholarshipDetailPage() {
  const { id } = useParams();
  const scholarship = mockScholarships.find(s => s.id === id);
  const [isSaved, setIsSaved] = useState(mockSavedScholarships.includes(id || ''));

  if (!scholarship) {
    return <div>Scholarship not found</div>;
  }

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from favorites' : 'Added to favorites');
  };

  // Calculate eligibility match
  const meetsGPA = (mockUser.gpa || 0) >= scholarship.gpaRequirement;
  const meetsCourse = scholarship.eligibilityRequirements.courses.includes('All Programs') || 
                      scholarship.eligibilityRequirements.courses.includes(mockUser.course || '');
  const meetsYearLevel = scholarship.eligibilityRequirements.yearLevel.includes(mockUser.yearLevel || '');
  const meetsFinancial = !scholarship.eligibilityRequirements.financialStatus || 
                        scholarship.eligibilityRequirements.financialStatus.includes(mockUser.financialStatus || '');
  
  const criteriaChecks = [
    { label: 'GPA', meets: meetsGPA, value: meetsGPA },
    { label: 'Course', meets: meetsCourse, value: meetsCourse },
    { label: 'Year Level', meets: meetsYearLevel, value: meetsYearLevel },
    { label: 'Financial Status', meets: meetsFinancial, value: meetsFinancial },
  ];

  const matchScore = (criteriaChecks.filter(c => c.meets).length / criteriaChecks.length) * 100;
  const profileComplete = mockUser.profileCompletion === 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-8 pb-24 md:pb-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/search">Search</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{scholarship.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button (Mobile) */}
        <Button variant="ghost" asChild className="md:hidden mb-4">
          <Link to="/search">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-[#1A2E5A] text-white">{scholarship.type}</Badge>
                <Badge variant="outline">GPA {scholarship.gpaRequirement}+</Badge>
                <Badge className="bg-[#F5A623] text-white">
                  <Calendar className="mr-1 h-3 w-3" />
                  Due: {new Date(scholarship.deadline).toLocaleDateString()}
                </Badge>
              </div>
              <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl md:text-4xl text-[#1A2E5A] mb-2">
                {scholarship.name}
              </h1>
              <p className="text-lg text-[#64748B]">{scholarship.provider}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={toggleSave}>
                <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Scholarship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#64748B] leading-relaxed">{scholarship.description}</p>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {scholarship.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#2ECC71] shrink-0 mt-0.5" />
                      <span className="text-[#64748B]">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Eligibility Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#1A2E5A] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#1A2E5A]">GPA Requirement</p>
                      <p className="text-sm text-[#64748B]">{scholarship.gpaRequirement} or higher</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#1A2E5A] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#1A2E5A]">Eligible Programs</p>
                      <p className="text-sm text-[#64748B]">
                        {scholarship.eligibilityRequirements.courses.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#1A2E5A] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#1A2E5A]">Year Level</p>
                      <p className="text-sm text-[#64748B]">
                        {scholarship.eligibilityRequirements.yearLevel.join(', ')}
                      </p>
                    </div>
                  </div>

                  {scholarship.eligibilityRequirements.financialStatus && (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#1A2E5A] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[#1A2E5A]">Financial Status</p>
                        <p className="text-sm text-[#64748B]">
                          {scholarship.eligibilityRequirements.financialStatus.join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Application Process */}
            <Card>
              <CardHeader>
                <CardTitle>Application Process</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {scholarship.applicationProcess.map((step, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#1A2E5A] text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-[#64748B] pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="w-10 h-10 bg-[#F5A623]/10 rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-[#F5A623]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B]">Amount</p>
                    <p className="font-semibold text-[#1A2E5A]">{scholarship.amount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="w-10 h-10 bg-[#2ECC71]/10 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-[#2ECC71]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B]">Available Slots</p>
                    <p className="font-semibold text-[#1A2E5A]">{scholarship.slots} positions</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="w-10 h-10 bg-[#E74C3C]/10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-[#E74C3C]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B]">Deadline</p>
                    <p className="font-semibold text-[#1A2E5A]">
                      {new Date(scholarship.deadline).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#64748B] mb-1">Provider Contact</p>
                  <p className="text-sm font-medium text-[#1A2E5A]">{scholarship.providerContact}</p>
                </div>
              </CardContent>
            </Card>

            {/* Eligibility Match Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Your Match Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#F8F9FC"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke={matchScore >= 75 ? '#2ECC71' : matchScore >= 50 ? '#F5A623' : '#E74C3C'}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - matchScore / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[#1A2E5A]">{Math.round(matchScore)}%</p>
                        <p className="text-xs text-[#64748B]">Match</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="font-medium text-[#1A2E5A] text-sm">Eligibility Criteria:</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      {meetsGPA ? (
                        <CheckCircle2 className="h-5 w-5 text-[#2ECC71] flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-[#E74C3C] flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-[#1A2E5A]">GPA</p>
                        <p className="text-xs text-[#64748B]">
                          {meetsGPA 
                            ? `Your GPA (${mockUser.gpa}) meets requirement (${scholarship.gpaRequirement}+)` 
                            : `Your GPA (${mockUser.gpa}) doesn't meet requirement (${scholarship.gpaRequirement}+)`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      {meetsCourse ? (
                        <CheckCircle2 className="h-5 w-5 text-[#2ECC71] flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-[#E74C3C] flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-[#1A2E5A]">Course</p>
                        <p className="text-xs text-[#64748B]">
                          {meetsCourse ? `${mockUser.course} — Eligible` : `${mockUser.course} — Not eligible`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      {meetsYearLevel ? (
                        <CheckCircle2 className="h-5 w-5 text-[#2ECC71] flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-[#E67E22] flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-[#1A2E5A]">Year Level</p>
                        <p className="text-xs text-[#64748B]">
                          {meetsYearLevel 
                            ? `${mockUser.yearLevel} — Eligible` 
                            : `You are ${mockUser.yearLevel}`}
                        </p>
                      </div>
                    </div>

                    {scholarship.eligibilityRequirements.financialStatus && (
                      <div className="flex items-start gap-2">
                        {meetsFinancial ? (
                          <CheckCircle2 className="h-5 w-5 text-[#2ECC71] flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-[#E74C3C] flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-[#1A2E5A]">Financial Status</p>
                          <p className="text-xs text-[#64748B]">
                            {meetsFinancial ? 'Matches requirement' : 'Does not match requirement'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!profileComplete && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-[#1A2E5A] mb-2">
                      <AlertCircle className="inline h-3 w-3 mr-1" />
                      Profile incomplete
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full text-xs">
                      <Link to="/profile">Complete Your Profile</Link>
                    </Button>
                  </div>
                )}

                <div className="space-y-2 pt-4 border-t">
                  <Button asChild className="w-full bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white">
                    <Link to={`/apply/${scholarship.id}`}>Apply Now</Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={toggleSave}>
                    <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                    {isSaved ? 'Saved' : 'Save to Favorites'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Sticky Bottom Bar */}
        <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
          <div className="flex gap-2">
            <Button asChild className="flex-1 bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white">
              <Link to={`/apply/${scholarship.id}`}>Apply Now</Link>
            </Button>
            <Button variant="outline" size="icon" onClick={toggleSave}>
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
