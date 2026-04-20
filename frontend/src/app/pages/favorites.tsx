import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { toast } from 'sonner';
import { scholarshipMapper } from '../lib/scholarshipMapper';

export function FavoritesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [savedScholarships, setSavedScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Fetch saved scholarships from API
    const fetchSavedScholarships = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/favorites/student?userId=${parsedUser.id}`
        );
        if (response.ok) {
          const data = await response.json();
          // Format response data to match scholarship display structure
          setSavedScholarships(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load saved scholarships');
        setSavedScholarships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedScholarships();
  }, [navigate]);

  const removeFromFavorites = async (scholarshipId: number) => {
    if (!user?.id) return;

    try {
      const response = await fetch('http://localhost:5000/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(String(user.id)),
          scholarshipId,
        }),
      });

      if (response.ok) {
        setSavedScholarships(
          savedScholarships.filter(
            s => (s.ScholarshipID || s.scholarshipId) !== scholarshipId
          )
        );
        toast.success('Removed from favorites');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-8 pb-24 md:pb-8">
        <div className="mb-8">
          <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl text-[#1A2E5A] mb-2">
            Saved Scholarships
          </h1>
          <p className="text-[#64748B]">
            <span className="font-semibold text-[#1A2E5A]">{savedScholarships.length}</span> scholarships saved
          </p>
        </div>

        {savedScholarships.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-[#F8F9FC] rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-10 w-10 text-[#64748B]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1A2E5A]">No saved scholarships yet</h3>
              <p className="text-[#64748B] max-w-md mx-auto">
                Start saving scholarships you're interested in to keep track of them easily
              </p>
              <Button asChild className="bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white">
                <Link to="/search">Browse Scholarships</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedScholarships.map((scholarship) => (
              <Card key={scholarship.id || scholarship.ScholarshipID} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex gap-2 flex-wrap">
                      <Badge className="bg-[#1A2E5A] text-white">{scholarship.type || scholarship.Type}</Badge>
                      <Badge variant="outline">GWA {scholarshipMapper.getGwaRequirement(scholarship)}+</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => removeFromFavorites(scholarship.ScholarshipID || parseInt(scholarship.id))}
                    >
                      <Trash2 className="h-4 w-4 text-[#E74C3C]" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-[#1A2E5A] mb-1 line-clamp-2">
                      {scholarship.name || scholarship.ScholarshipName}
                    </h3>
                    <p className="text-sm text-[#64748B]">{scholarship.provider || scholarship.Provider}</p>
                  </div>

                  <p className="text-sm text-[#64748B] line-clamp-2">{scholarship.description || scholarship.Description}</p>

                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <span>{scholarship.slots || scholarship.Slots} slots</span>
                    <span>•</span>
                    <span>Due: {new Date(scholarship.deadline || scholarship.Deadline).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <p className="text-lg font-bold text-[#F5A623]">{scholarship.amount || scholarship.Amount}</p>
                    <div className="flex gap-2">
                      <Button asChild variant="ghost" size="sm" className="text-[#1A2E5A]">
                        <Link to={`/scholarship/${scholarship.id || scholarship.ScholarshipID}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white">
                        <Link to={`/apply/${scholarship.id || scholarship.ScholarshipID}`}>
                          Apply
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
