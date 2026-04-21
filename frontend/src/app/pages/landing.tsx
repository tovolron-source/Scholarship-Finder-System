import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Users, Award, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Footer } from '../components/layout/footer';
import { scholarshipMapper } from '../lib/scholarshipMapper';

export function LandingPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [featuredScholarships, setFeaturedScholarships] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const isLogged = !!(token && storedUser);
    setIsLoggedIn(isLogged);

    // Fetch all scholarships from API
    const fetchScholarships = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/scholarships');
        if (response.ok) {
          const data = await response.json();
          const allScholarships = data.data || [];
          
          let scholarshipsToDisplay = allScholarships;
          
          // If logged in, filter by user eligibility, otherwise just get first 3
          if (isLogged && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            scholarshipsToDisplay = filterMatchedScholarships(allScholarships, parsedUser);
          }
          
          // Get first 3 scholarships to display
          setFeaturedScholarships(scholarshipsToDisplay.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching scholarships:', error);
        setFeaturedScholarships([]);
      }
    };

    fetchScholarships();
  }, []);

  const filterMatchedScholarships = (scholarships: any[], userProfile: any) => {
    const userGPA = userProfile.GPA || userProfile.gpa || 0;
    const userCourse = userProfile.Course || userProfile.course || '';
    const userYearLevel = userProfile.YearLevel || userProfile.yearLevel || '';
    
    return scholarships.filter(scholarship => {
      // Get GWA requirement
      const scholarshipGWA = scholarshipMapper.getGwaRequirement(scholarship) || 0;
      
      // Check GWA eligibility - user's GWA must be <= scholarship requirement (1.0 best, 5.0 worst)
      const meetsGWA = userGPA <= scholarshipGWA;
      
      if (!meetsGWA) {
        return false;
      }
      
      // Get eligibility requirements
      let eligReqs: any = {};
      if (scholarship.EligibilityRequirements) {
        try {
          eligReqs = typeof scholarship.EligibilityRequirements === 'string' 
            ? JSON.parse(scholarship.EligibilityRequirements) 
            : scholarship.EligibilityRequirements;
        } catch (e) {
          eligReqs = {};
        }
      }
      
      // Check course eligibility
      const requiredCourses = eligReqs.courses || [];
      const meetsCourse = requiredCourses.length === 0 || 
                         requiredCourses.includes('All Programs') || 
                         requiredCourses.includes(userCourse);
      
      if (!meetsCourse) {
        return false;
      }
      
      // Check year level eligibility
      const requiredYearLevels = eligReqs.yearLevel || [];
      const meetsYearLevel = requiredYearLevels.length === 0 || 
                            requiredYearLevels.includes(userYearLevel);
      
      return meetsYearLevel;
    });
  };

  const handleSearch = () => {
    // Check if user is logged in by checking localStorage for token
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      // User is not logged in, store search query and redirect to sign in
      if (searchInput.trim()) {
        localStorage.setItem('pendingSearchQuery', searchInput.trim());
      }
      navigate('/login');
    } else {
      // User is logged in, check if admin
      const userData = JSON.parse(user);
      if (userData.role === 'admin') {
        // Admin users go to dashboard
        navigate('/admin/dashboard');
      } else {
        // Student users go to search
        if (searchInput.trim()) {
          navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
        } else {
          navigate('/search');
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-[#1A2E5A] via-[#2A3E6A] to-[#1A2E5A] text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJBM0U2QSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-4xl md:text-6xl mb-6">
              Find the Scholarship You Deserve
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Connect with thousands of scholarship opportunities tailored to your academic profile. 
              Start your journey to financial freedom today.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto mt-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by scholarship name, field of study..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 bg-white text-[#1A2E5A] border-0"
                />
              </div>
              <Button onClick={handleSearch} className="h-12 bg-[#F5A623] hover:bg-[#E69515] text-white px-8">
                Search Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
              {!isLoggedIn && (
                <>
                  <Button asChild size="lg" className="bg-[#F5A623] hover:bg-[#E69515] text-white">
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* Featured/Matched Scholarships */}
      <section className="py-16 bg-[#F8F9FC]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl md:text-4xl text-[#1A2E5A] mb-4">
              {isLoggedIn ? 'Matched Scholarships' : 'Featured Scholarships'}
            </h2>
            <p className="text-[#64748B] max-w-2xl mx-auto">
              {isLoggedIn 
                ? 'Scholarships matched to your profile and eligibility criteria'
                : 'Discover top scholarship opportunities handpicked for students like you'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredScholarships.map((scholarship) => (
              <Card key={scholarship.id || scholarship.ScholarshipID} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge className="bg-[#1A2E5A] text-white">{scholarship.type || scholarship.Type}</Badge>
                    <Badge variant="outline" className="text-[#64748B]">
                      GWA {scholarshipMapper.getGwaRequirement(scholarship)}+
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#1A2E5A] mb-2">{scholarship.name || scholarship.ScholarshipName}</h3>
                    <p className="text-sm text-[#64748B]">{scholarship.provider || scholarship.Provider}</p>
                  </div>
                  <p className="text-sm text-[#64748B] line-clamp-2">{scholarship.description || scholarship.Description}</p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-lg font-bold text-[#F5A623]">{scholarship.amount || scholarship.Amount}</p>
                      <p className="text-xs text-[#64748B]">Deadline: {new Date(scholarship.deadline || scholarship.Deadline).toLocaleDateString()}</p>
                    </div>
                    <Button asChild variant="ghost" className="text-[#1A2E5A]">
                      <Link to={`/scholarship/${scholarship.id || scholarship.ScholarshipID}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white">
              <Link to="/search">View All Scholarships</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl md:text-4xl text-[#1A2E5A] mb-4">
              How It Works
            </h2>
            <p className="text-[#64748B] max-w-2xl mx-auto">
              Three simple steps to finding and applying for scholarships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#1A2E5A] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold text-[#1A2E5A]">Register & Create Profile</h3>
              <p className="text-[#64748B]">
                Sign up and complete your academic profile with your GPA, field of study, and other relevant information.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#F5A623] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold text-[#1A2E5A]">Get Matched</h3>
              <p className="text-[#64748B]">
                Our smart matching system automatically finds scholarships that fit your profile and eligibility criteria.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#2ECC71] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold text-[#1A2E5A]">Apply & Track</h3>
              <p className="text-[#64748B]">
                Submit applications directly through our platform and track their status in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}