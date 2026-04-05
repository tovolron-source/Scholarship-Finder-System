import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, SlidersHorizontal, Heart, X, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { mockScholarships, mockSavedScholarships } from '../lib/mock-data';
import { toast } from 'sonner';

export function SearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [gpaRange, setGpaRange] = useState([2.0, 4.0]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<string[]>(mockSavedScholarships);
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const scholarshipTypes = ['Merit', 'Need-based', 'Athletic', 'Government', 'Private'];
  const courses = ['All Programs', 'BS Computer Science', 'BS Engineering', 'BS Biology', 'BS Physics', 'BS Mathematics'];

  const getEligibilityStatus = (scholarship: any) => {
    if (!user || !user.GPA || !user.Course) return 'partial';
    
    const meetsGPA = user.GPA >= scholarship.gpaRequirement;
    const meetsCourse = scholarship.eligibilityRequirements.courses.includes('All Programs') || 
                        scholarship.eligibilityRequirements.courses.includes(user.Course || '');
    const meetsYearLevel = scholarship.eligibilityRequirements.yearLevel.includes(user.YearLevel || '');
    
    if (meetsGPA && meetsCourse && meetsYearLevel) return 'eligible';
    if (!meetsGPA) return 'not-eligible';
    return 'partial';
  };

  const filteredScholarships = mockScholarships.filter(scholarship => {
    const matchesSearch = scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGPA = scholarship.gpaRequirement >= gpaRange[0] && scholarship.gpaRequirement <= gpaRange[1];
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(scholarship.type);
    const matchesCourse = selectedCourses.length === 0 || 
                         selectedCourses.includes('All Programs') ||
                         scholarship.eligibilityRequirements.courses.some(c => selectedCourses.includes(c));
    
    return matchesSearch && matchesGPA && matchesType && matchesCourse;
  });

  const toggleSaveScholarship = (id: string) => {
    if (savedScholarships.includes(id)) {
      setSavedScholarships(savedScholarships.filter(s => s !== id));
      toast.success('Removed from favorites');
    } else {
      setSavedScholarships([...savedScholarships, id]);
      toast.success('Added to favorites');
    }
  };

  const FilterSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-[#1A2E5A] mb-3">GPA Requirement</h3>
        <div className="space-y-3">
          <Slider
            value={[gpaRange[1]]}
            onValueChange={(value) => setGpaRange([2.0, value[0]])}
            min={2.0}
            max={4.0}
            step={0.1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-[#64748B]">
            <span>Min: 2.0</span>
            <span>Max: {gpaRange[1].toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-[#1A2E5A] mb-3">Scholarship Type</h3>
        <div className="space-y-2">
          {scholarshipTypes.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTypes([...selectedTypes, type]);
                  } else {
                    setSelectedTypes(selectedTypes.filter(t => t !== type));
                  }
                }}
              />
              <label htmlFor={`type-${type}`} className="text-sm text-[#64748B] cursor-pointer">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-[#1A2E5A] mb-3">Course/Field of Study</h3>
        <div className="space-y-2">
          {courses.map((course) => (
            <div key={course} className="flex items-center gap-2">
              <Checkbox
                id={`course-${course}`}
                checked={selectedCourses.includes(course)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCourses([...selectedCourses, course]);
                  } else {
                    setSelectedCourses(selectedCourses.filter(c => c !== course));
                  }
                }}
              />
              <label htmlFor={`course-${course}`} className="text-sm text-[#64748B] cursor-pointer">
                {course}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setGpaRange([2.0]);
          setSelectedTypes([]);
          setSelectedCourses([]);
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-8 pb-24 md:pb-8">
        {/* Search Header */}
        <div className="mb-6">
          <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl text-[#1A2E5A] mb-6">
            Find Your Scholarship
          </h1>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search scholarships by name, provider, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            
            <div className="flex gap-2">
              {/* Desktop Filter Button */}
              <Button
                variant={showFilters ? "default" : "outline"}
                className="md:hidden flex-1"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="gpa">GPA Requirement</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-[#64748B]">
              <span className="font-semibold text-[#1A2E5A]">{filteredScholarships.length}</span> scholarships found
            </p>
            
            {/* Active Filters */}
            {(selectedTypes.length > 0 || selectedCourses.length > 0 || gpaRange[1] < 4.0) && (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="gap-1">
                    {type}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedTypes(selectedTypes.filter(t => t !== type))}
                    />
                  </Badge>
                ))}
                {gpaRange[1] < 4.0 && (
                  <Badge variant="secondary" className="gap-1">
                    GPA {gpaRange[1].toFixed(1)} max
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setGpaRange([2.0, 4.0])}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-6 flex-col-reverse md:flex-row">
          {/* Filter Sidebar - Desktop Always Visible, Mobile Toggleable */}
          <aside className={`w-full md:w-64 flex-shrink-0 ${!showFilters && 'md:block hidden'}`}>
            <Card className="md:sticky md:top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1A2E5A]">Filters</h3>
                  <SlidersHorizontal className="h-4 w-4 text-[#64748B]" />
                </div>
                <FilterSection />
              </CardContent>
            </Card>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            {filteredScholarships.length === 0 ? (
              <Card className="p-12">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-[#F8F9FC] rounded-full flex items-center justify-center mx-auto">
                    <Search className="h-10 w-10 text-[#64748B]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A2E5A]">No scholarships match your filters</h3>
                  <p className="text-[#64748B]">Try adjusting your search criteria or filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setGpaRange([2.0, 4.0]);
                      setSelectedTypes([]);
                      setSelectedCourses([]);
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredScholarships.map((scholarship) => {
                  const eligibility = getEligibilityStatus(scholarship);
                  const isSaved = savedScholarships.includes(scholarship.id);
                  
                  return (
                    <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-[#1A2E5A] text-white">{scholarship.type}</Badge>
                            {eligibility === 'eligible' && (
                              <Badge className="bg-[#2ECC71] text-white">✓ Likely Eligible</Badge>
                            )}
                            {eligibility === 'partial' && (
                              <Badge className="bg-[#E67E22] text-white">⚠ Partial Match</Badge>
                            )}
                            {eligibility === 'not-eligible' && (
                              <Badge variant="outline" className="text-[#64748B]">✗ Check Requirements</Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0"
                            onClick={() => toggleSaveScholarship(scholarship.id)}
                          >
                            <Heart
                              className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-[#64748B]'}`}
                            />
                          </Button>
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg text-[#1A2E5A] mb-1 line-clamp-2">
                            {scholarship.name}
                          </h3>
                          <p className="text-sm text-[#64748B]">{scholarship.provider}</p>
                        </div>

                        <p className="text-sm text-[#64748B] line-clamp-2">{scholarship.description}</p>

                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                          <Badge variant="outline">GPA {scholarship.gpaRequirement}+</Badge>
                          <span>•</span>
                          <span>{scholarship.slots} slots</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <p className="text-lg font-bold text-[#F5A623]">{scholarship.amount}</p>
                            <p className="text-xs text-[#64748B]">Due: {new Date(scholarship.deadline).toLocaleDateString()}</p>
                          </div>
                          <Button asChild variant="ghost" size="sm" className="text-[#1A2E5A]">
                            <Link to={`/scholarship/${scholarship.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
