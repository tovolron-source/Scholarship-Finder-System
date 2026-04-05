import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Bell, User, Search, Home, Heart, FileText, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { mockNotifications } from '../../lib/mock-data';
import { toast } from 'sonner';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    toast.success('Logged out successfully!', {
      action: {
        label: 'Close',
        onClick: () => {},
      },
    });
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-12 h-12 bg-[#1A2E5A] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <span style={{ fontFamily: 'var(--font-heading)' }} className="text-xl text-[#F5A623]">
                Scholarship Finder System
              </span>
            </Link>

            <div className="flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-[#1A2E5A] ${
                  location.pathname === '/' ? 'text-[#1A2E5A]' : 'text-[#64748B]'
                }`}
              >
                Home
              </Link>
              <Link
                to="/search"
                className={`text-sm font-medium transition-colors hover:text-[#1A2E5A] ${
                  location.pathname === '/search' ? 'text-[#1A2E5A]' : 'text-[#64748B]'
                }`}
              >
                Search
              </Link>
              <Link
                to="/applications"
                className={`text-sm font-medium transition-colors hover:text-[#1A2E5A] ${
                  location.pathname === '/applications' ? 'text-[#1A2E5A]' : 'text-[#64748B]'
                }`}
              >
                My Applications
              </Link>
              <Link
                to="/favorites"
                className={`text-sm font-medium transition-colors hover:text-[#1A2E5A] ${
                  location.pathname === '/favorites' ? 'text-[#1A2E5A]' : 'text-[#64748B]'
                }`}
              >
                Favorites
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#E74C3C] text-white text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user?.ProfilePhoto} alt={user?.FullName} />
                      <AvatarFallback className="bg-[#1A2E5A] text-white">
                        {user?.FullName ? user.FullName.split(' ').map((n: string) => n[0]).join('') : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.FullName || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.Email || ''}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/notifications">Notifications</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg">
        <div className="flex items-center justify-around px-2 py-3">
          <Link to="/" className="flex flex-col items-center gap-1">
            <Home className={`h-5 w-5 ${location.pathname === '/' ? 'text-[#1A2E5A]' : 'text-[#64748B]'}`} />
            <span className={`text-xs ${location.pathname === '/' ? 'text-[#1A2E5A] font-medium' : 'text-[#64748B]'}`}>
              Home
            </span>
          </Link>
          <Link to="/search" className="flex flex-col items-center gap-1">
            <Search className={`h-5 w-5 ${location.pathname === '/search' ? 'text-[#1A2E5A]' : 'text-[#64748B]'}`} />
            <span className={`text-xs ${location.pathname === '/search' ? 'text-[#1A2E5A] font-medium' : 'text-[#64748B]'}`}>
              Search
            </span>
          </Link>
          <Link to="/applications" className="flex flex-col items-center gap-1">
            <FileText className={`h-5 w-5 ${location.pathname === '/applications' ? 'text-[#1A2E5A]' : 'text-[#64748B]'}`} />
            <span className={`text-xs ${location.pathname === '/applications' ? 'text-[#1A2E5A] font-medium' : 'text-[#64748B]'}`}>
              Applications
            </span>
          </Link>
          <Link to="/favorites" className="flex flex-col items-center gap-1">
            <Heart className={`h-5 w-5 ${location.pathname === '/favorites' ? 'text-[#1A2E5A]' : 'text-[#64748B]'}`} />
            <span className={`text-xs ${location.pathname === '/favorites' ? 'text-[#1A2E5A] font-medium' : 'text-[#64748B]'}`}>
              Favorites
            </span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 relative">
            <User className={`h-5 w-5 ${location.pathname === '/profile' ? 'text-[#1A2E5A]' : 'text-[#64748B]'}`} />
            <span className={`text-xs ${location.pathname === '/profile' ? 'text-[#1A2E5A] font-medium' : 'text-[#64748B]'}`}>
              Profile
            </span>
          </Link>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-40 border-b bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#1A2E5A] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)' }} className="text-base text-[#F5A623]">
            Scholarship Finder System
          </span>
        </Link>
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-[#E74C3C] text-white text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </Link>
      </div>
    </>
  );
}