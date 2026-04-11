import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Users, Award, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Footer } from '../components/layout/footer';

export function LandingPage() {
  const navigate = useNavigate();
  const [searchInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [featuredScholarships, setFeaturedScholarships] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!(token && user));

    // Fetch featured scholarships from API
    const fetchFeaturedScholarships = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/scholarships');
        if (response.ok) {
          const data = await response.json();
          // Get first 3 scholarships as featured
          setFeaturedScholarships((data.data || []).slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching featured scholarships:', error);
        setFeaturedScholarships([]);
      }
    };

    fetchFeaturedScholarships();
  }, []);

  const handleSearch = () => {
    // Check if user is logged in by checking localStorage for token
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      // User is not logged in, redirect to sign in
      navigate('/login');
    } else {
      // User is logged in, go to search
      navigate('/search');
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

      {/* Stats Strip */}
      <section className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Award className="h-6 w-6 text-[#F5A623]" />
                <span className="text-3xl font-bold text-[#1A2E5A]">2,500+</span>
              </div>
              <p className="text-[#64748B]">Total Scholarships</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Users className="h-6 w-6 text-[#F5A623]" />
                <span className="text-3xl font-bold text-[#1A2E5A]">10,000+</span>
              </div>
              <p className="text-[#64748B]">Students Matched</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-6 w-6 text-[#F5A623]" />
                <span className="text-3xl font-bold text-[#1A2E5A]">150+</span>
              </div>
              <p className="text-[#64748B]">Partner Providers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="py-16 bg-[#F8F9FC]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl md:text-4xl text-[#1A2E5A] mb-4">
              Featured Scholarships
            </h2>
            <p className="text-[#64748B] max-w-2xl mx-auto">
              Discover top scholarship opportunities handpicked for students like you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredScholarships.map((scholarship) => (
              <Card key={scholarship.id || scholarship.ScholarshipID} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge className="bg-[#1A2E5A] text-white">{scholarship.type || scholarship.Type}</Badge>
                    <Badge variant="outline" className="text-[#64748B]">
                      GPA {scholarship.gpaRequirement || scholarship.GPARequirement}+
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