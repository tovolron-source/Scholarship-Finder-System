import { Link } from 'react-router';
import { Home, Search } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-9xl text-[#1A2E5A]">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-[#1A2E5A]">Page Not Found</h2>
          <p className="text-[#64748B]">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/search">
              <Search className="mr-2 h-4 w-4" />
              Browse Scholarships
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
