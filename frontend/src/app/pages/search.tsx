import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, SlidersHorizontal, Heart, X, ChevronDown, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { toast } from 'sonner';

export function SearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [gpaRange, setGpaRange] = useState([2.0, 4.0]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [defaultCourses, setDefaultCourses] = useState(['All Programs', 'BS Computer Science', 'BS Engineering', 'BS Biology', 'BS Physics', 'BS Mathematics']);
  const [newCourse, setNewCourse] = useState('');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  // Fetch scholarships from API
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/scholarships');
        if (response.ok) {
          const data = await response.json();
          setScholarships(data.data || []);
          setError(null);
        } else {
          throw new Error('Failed to fetch scholarships');
        }
      } catch (err) {
        console.error('Error fetching scholarships:', err);
        setError('Failed to load scholarships. Please try again.');
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  // Fetch saved favorites from API
  useEffect(() => {
    if (!user?.id) return;

    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/favorites/student?userId=${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          // Extract scholarship IDs from favorites
          const favoriteIds = data.data?.map((fav: any) => 
            String(fav.ScholarshipID || fav.scholarshipId || '')
          ) || [];
          setSavedScholarships(favoriteIds);
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setSavedScholarships([]);
      }
    };

    fetchFavorites();
  }, [user?.id]);

  const scholarshipTypes = ['Merit', 'Need-based', 'Athletic', 'Government', 'Private'];

  const handleAddCourse = () => {
    if (newCourse.trim() && !defaultCourses.includes(newCourse.trim())) {
      setDefaultCourses([...defaultCourses, newCourse.trim()]);
      setSelectedCourses([...selectedCourses, newCourse.trim()]);
      setNewCourse('');
      setShowAddCourse(false);
      toast.success('Course added successfully');
    } else if (defaultCourses.includes(newCourse.trim())) {
      toast.error('This course already exists');
    }
  };

  const getEligibilityStatus = (scholarship: any) => {
    if (!user || !user.GPA || !user.Course) return 'partial';
    
    // Handle both database and mock data formats
    const gpaRequirement = scholarship.gpaRequirement || scholarship.GPARequirement || 0;
    const eligReqs = scholarship.eligibilityRequirements || 
                     (scholarship.EligibilityRequirements ? JSON.parse(scholarship.EligibilityRequirements) : {});
    
    const meetsGPA = user.GPA >= gpaRequirement;
    const courses = eligReqs.courses || [];
    const meetsCourse = courses.includes('All Programs') || courses.includes(user.Course || '');
    const yearLevels = eligReqs.yearLevel || [];
    const meetsYearLevel = yearLevels.includes(user.YearLevel || '');
    
    if (meetsGPA && meetsCourse && meetsYearLevel) return 'eligible';
    if (!meetsGPA) return 'not-eligible';
    return 'partial';
  };

  const filteredScholarships = scholarships.filter(scholarship => {
    // Handle both database and mock data formats
    const name = scholarship.name || scholarship.ScholarshipName || '';
    const provider = scholarship.provider || scholarship.Provider || '';
    const description = scholarship.description || scholarship.Description || '';
    const type = scholarship.type || scholarship.Type || '';
    const gpaRequirement = scholarship.gpaRequirement || scholarship.GPARequirement || 0;
    const eligReqs = scholarship.eligibilityRequirements || 
                     (scholarship.EligibilityRequirements ? JSON.parse(scholarship.EligibilityRequirements) : {});

    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGPA = gpaRequirement >= gpaRange[0] && gpaRequirement <= gpaRange[1];
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(type);
    const courses = eligReqs.courses || [];
    const matchesCourse = selectedCourses.length === 0 || 
                         selectedCourses.includes('All Programs') ||
                         courses.some((c: string) => selectedCourses.includes(c));
    
    return matchesSearch && matchesGPA && matchesType && matchesCourse;
  });

  const toggleSaveScholarship = async (scholarshipId: string) => {
    if (!user?.id) {
      toast.error('Please log in to save scholarships');
      return;
    }

    const isCurrentlySaved = savedScholarships.includes(scholarshipId);
    const endpoint = 'http://localhost:5000/api/favorites';

    try {
      const response = await fetch(endpoint, {
        method: isCurrentlySaved ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(user.id),
          scholarshipId: parseInt(scholarshipId),
        }),
      });

      if (response.ok) {
        if (isCurrentlySaved) {
          setSavedScholarships(savedScholarships.filter(s => s !== scholarshipId));
          toast.success('Removed from favorites');
        } else {
          setSavedScholarships([...savedScholarships, scholarshipId]);
          toast.success('Added to favorites');
        }
      } else {
        throw new Error('Failed to update favorite');
      }
    } catch (err) {
      console.error('Error updating favorite:', err);
      toast.error('Failed to update favorites');
    }
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setGpaRange([2.0, 4.0]);
    setSelectedTypes([]);
    setSelectedCourses([]);
    toast.success('All filters cleared');
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#1A2E5A]">Course/Field of Study</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddCourse(!showAddCourse)}
            className="text-[#1A2E5A] p-0 h-auto"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {showAddCourse && (
          <div className="mb-3 space-y-2 pb-3 border-b">
            <div className="flex gap-2">
              <Input
                placeholder="Add new course..."
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCourse()}
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={handleAddCourse}
                className="bg-[#1A2E5A] text-white"
              >
                Add
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {defaultCourses.map((course) => (
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
        onClick={handleClearAllFilters}
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
                <SelectTrigger className="w-full md:w-45">
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
          <aside className={`w-full md:w-64 shrink-0 ${!showFilters && 'md:block hidden'}`}>
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
            {loading ? (
              <Card className="p-12">
                <div className="text-center">
                  <div className="inline-block">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2E5A]"></div>
                  </div>
                  <p className="mt-4 text-[#64748B]">Loading scholarships...</p>
                </div>
              </Card>
            ) : error ? (
              <Card className="p-12">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold text-[#E74C3C]">Failed to Load</h3>
                  <p className="text-[#64748B]">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              </Card>
            ) : filteredScholarships.length === 0 ? (
              <Card className="p-12">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-[#F8F9FC] rounded-full flex items-center justify-center mx-auto">
                    <Search className="h-10 w-10 text-[#64748B]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A2E5A]">No scholarships match your filters</h3>
                  <p className="text-[#64748B]">Try adjusting your search criteria or filters</p>
                  <Button
                    variant="outline"
                    onClick={handleClearAllFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredScholarships.map((scholarship) => {
                  const eligibility = getEligibilityStatus(scholarship);
                  const scholarshipId = String(scholarship.id || scholarship.ScholarshipID);
                  const name = scholarship.name || scholarship.ScholarshipName || '';
                  const provider = scholarship.provider || scholarship.Provider || '';
                  const description = scholarship.description || scholarship.Description || '';
                  const type = scholarship.type || scholarship.Type || '';
                  const gpaRequirement = scholarship.gpaRequirement || scholarship.GPARequirement || '';
                  const slots = scholarship.slots || scholarship.Slots || '';
                  const amount = scholarship.amount || scholarship.Amount || '';
                  const deadline = scholarship.deadline || scholarship.Deadline || '';
                  const isSaved = savedScholarships.includes(scholarshipId);
                  
                  return (
                    <Card key={scholarshipId} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-[#1A2E5A] text-white">{type}</Badge>
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
                            className="shrink-0"
                            onClick={() => toggleSaveScholarship(scholarshipId)}
                          >
                            <Heart
                              className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-[#64748B]'}`}
                            />
                          </Button>
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg text-[#1A2E5A] mb-1 line-clamp-2">
                            {name}
                          </h3>
                          <p className="text-sm text-[#64748B]">{provider}</p>
                        </div>

                        <p className="text-sm text-[#64748B] line-clamp-2">{description}</p>

                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                          <Badge variant="outline">GPA {gpaRequirement}+</Badge>
                          <span>•</span>
                          <span>{slots} slots</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <p className="text-lg font-bold text-[#F5A623]">{amount}</p>
                            <p className="text-xs text-[#64748B]">Due: {new Date(deadline).toLocaleDateString()}</p>
                          </div>
                          <Button asChild variant="ghost" size="sm" className="text-[#1A2E5A]">
                            <Link to={`/scholarship/${scholarshipId}`}>
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
