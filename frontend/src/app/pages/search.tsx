import { useState, useEffect, memo, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Search, SlidersHorizontal, Heart, X, Plus } from 'lucide-react';
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
import { scholarshipMapper } from '../lib/scholarshipMapper';

// FilterSection Component - Memoized to prevent re-renders causing focus loss
const FilterSection = memo(({
  scholarshipTypes,
  defaultCourses,
  selectedTypes,
  selectedCourses,
  gwaRange,
  newCourse,
  showAddCourse,
  onGwaChange,
  onTypeChange,
  onCourseChange,
  onAddCourse,
  onClearFilters,
  onShowAddCourse,
  onNewCourseChange,
}: {
  scholarshipTypes: string[];
  defaultCourses: string[];
  selectedTypes: string[];
  selectedCourses: string[];
  gwaRange: [number, number];
  newCourse: string;
  showAddCourse: boolean;
  onGwaChange: (value: number) => void;
  onTypeChange: (type: string, checked: boolean) => void;
  onCourseChange: (course: string, checked: boolean) => void;
  onAddCourse: () => void;
  onClearFilters: () => void;
  onShowAddCourse: (show: boolean) => void;
  onNewCourseChange: (value: string) => void;
}) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-semibold text-[#1A2E5A] mb-3">GWA Requirement</h3>
      <div className="space-y-3">
        <Slider
          value={[gwaRange[1]]}
          onValueChange={(value) => onGwaChange(value[0])}
          min={1.0}
          max={5.0}
          step={0.1}
          className="w-full"
        />
        <div className="flex items-center justify-between text-sm text-[#64748B]">
          <span>Min: 5.0</span>
          <span>Max: {gwaRange[1].toFixed(1)}</span>
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
              onCheckedChange={(checked) => onTypeChange(type, !!checked)}
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
          onClick={() => onShowAddCourse(!showAddCourse)}
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
              onChange={(e) => onNewCourseChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onAddCourse()}
              className="text-sm"
            />
            <Button
              size="sm"
              onClick={onAddCourse}
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
              onCheckedChange={(checked) => onCourseChange(course, !!checked)}
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
      onClick={onClearFilters}
    >
      Clear All Filters
    </Button>
  </div>
));

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [gwaRange, setGwaRange] = useState<[number, number]>([1.0, 5.0]);
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

  // Load user from localStorage and handle search query
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(storedUser));

    // Check for search query from URL parameter or localStorage
    const urlQuery = searchParams.get('q');
    const pendingQuery = localStorage.getItem('pendingSearchQuery');

    if (urlQuery) {
      setSearchQuery(decodeURIComponent(urlQuery));
    } else if (pendingQuery) {
      setSearchQuery(pendingQuery);
      // Clear the pending query after using it
      localStorage.removeItem('pendingSearchQuery');
    }
  }, [navigate, searchParams]);

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
    if (!user || !user.GWA || !user.Course) return 'partial';
    
    const gwaRequirement = scholarshipMapper.getGwaRequirement(scholarship);
    const eligReqs = scholarshipMapper.getEligibilityRequirements(scholarship);
    
    const meetsGWA = user.GWA <= gwaRequirement;
    const courses = eligReqs.courses || [];
    const meetsCourse = courses.includes('All Programs') || courses.includes(user.Course || '');
    const yearLevels = eligReqs.yearLevel || [];
    const meetsYearLevel = yearLevels.includes(user.YearLevel || '');
    
    if (meetsGWA && meetsCourse && meetsYearLevel) return 'eligible';
    if (!meetsGWA) return 'not-eligible';
    return 'partial';
  };

  const filteredScholarships = scholarships.filter(scholarship => {
    const name = scholarshipMapper.getName(scholarship);
    const provider = scholarshipMapper.getProvider(scholarship);
    const description = scholarshipMapper.getDescription(scholarship);
    const type = scholarshipMapper.getType(scholarship);
    const gwaRequirement = scholarshipMapper.getGwaRequirement(scholarship);
    const eligReqs = scholarshipMapper.getEligibilityRequirements(scholarship);

    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGWA = gwaRequirement >= gwaRange[0] && gwaRequirement <= gwaRange[1];
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(type);
    const courses = eligReqs.courses || [];
    const matchesCourse = selectedCourses.length === 0 || 
                         selectedCourses.includes('All Programs') ||
                         courses.some((c: string) => selectedCourses.includes(c));
    
    return matchesSearch && matchesGWA && matchesType && matchesCourse;
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
    setGwaRange([1.0, 5.0]);
    setSelectedTypes([]);
    setSelectedCourses([]);
    toast.success('All filters cleared');
  };

  // Memoized handlers for FilterSection
  const handleGwaChange = useCallback((value: number) => {
    setGwaRange([1.0, value]);
  }, []);

  const handleTypeChange = useCallback((type: string, checked: boolean) => {
    setSelectedTypes(prev => 
      checked ? [...prev, type] : prev.filter(t => t !== type)
    );
  }, []);

  const handleCourseChange = useCallback((course: string, checked: boolean) => {
    setSelectedCourses(prev => 
      checked ? [...prev, course] : prev.filter(c => c !== course)
    );
  }, []);

  const handleShowAddCourse = useCallback((show: boolean) => {
    setShowAddCourse(show);
  }, []);

  const handleNewCourseChange = useCallback((value: string) => {
    setNewCourse(value);
  }, []);

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
            {(selectedTypes.length > 0 || selectedCourses.length > 0 || gwaRange[1] < 5.0) && (
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
                {gwaRange[1] < 4.0 && (
                  <Badge variant="secondary" className="gap-1">
                    GPA {gwaRange[1].toFixed(1)} max
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setGwaRange([1.0, 4.0])}
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
                <FilterSection
                  scholarshipTypes={scholarshipTypes}
                  defaultCourses={defaultCourses}
                  selectedTypes={selectedTypes}
                  selectedCourses={selectedCourses}
                  gwaRange={gwaRange}
                  newCourse={newCourse}
                  showAddCourse={showAddCourse}
                  onGwaChange={handleGwaChange}
                  onTypeChange={handleTypeChange}
                  onCourseChange={handleCourseChange}
                  onAddCourse={handleAddCourse}
                  onClearFilters={handleClearAllFilters}
                  onShowAddCourse={handleShowAddCourse}
                  onNewCourseChange={handleNewCourseChange}
                />
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
                  const {
                    id: scholarshipId,
                    name,
                    provider,
                    description,
                    type,
                    gwaRequirement,
                    slots,
                    amount,
                    deadline,
                  } = scholarshipMapper.getScholarshipData(scholarship);
                  
                  const isSaved = savedScholarships.includes(scholarshipId);
                  
                  return (
                    <Card key={scholarshipId} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-5 space-y-4 ">
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
                          <Badge variant="outline">GWA {gwaRequirement}+</Badge>
                          <span>•</span>
                          <span>{slots} slots</span>
                        </div>

                        <div className="flex flex-col gap-3 pt-3 border-t">
                          <div>
                            <p className="text-lg font-bold text-[#F5A623]">{amount}</p>
                            <p className="text-xs text-[#64748B]">Due: {new Date(deadline).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-3 w-full">
                            <Button asChild variant="outline" size="sm" className="flex-1 text-[#1A2E5A]">
                              <Link to={`/scholarship/${scholarshipId}`}>
                                Details
                              </Link>
                            </Button>
                            <Button asChild size="sm" className="flex-1 bg-[#1A2E5A] text-white hover:bg-[#0F1A36]">
                              <Link to={`/apply/${scholarshipId}`}>
                                Apply
                              </Link>
                            </Button>
                          </div>
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
