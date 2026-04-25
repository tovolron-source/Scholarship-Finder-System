import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setIsAdmin(userData.role === 'admin');
      } catch (e) {
        setIsAdmin(false);
      }
    }
  }, []);

  return (
    <footer className="bg-[#1A2E5A] text-white mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src='/logo.png' alt="logo" className = "w-15 h-15 rounded-full object-cover"/>
              <span style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl text-[#F5A623]">
                Scholarship Finder
              </span>
            </div>
            <p className="text-sm text-gray-300">
              Find the scholarship you deserve. Empowering students to achieve their academic dreams.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {isAdmin ? (
                <>
                  <li>
                    <Link to="/" className="text-gray-300 hover:text-[#F5A623] transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/dashboard" className="text-gray-300 hover:text-[#F5A623] transition-colors">
                      Dashboard
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/" className="text-gray-300 hover:text-[#F5A623] transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/search" className="text-gray-300 hover:text-[#F5A623] transition-colors">
                      Search Scholarships
                    </Link>
                  </li>
                  <li>
                    <Link to="/applications" className="text-gray-300 hover:text-[#F5A623] transition-colors">
                      My Applications
                    </Link>
                  </li>
                  <li>
                    <Link to="/favorites" className="text-gray-300 hover:text-[#F5A623] transition-colors">
                      Saved Scholarships
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#F5A623] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#F5A623] transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#F5A623] transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#F5A623] transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-[#F5A623] rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-[#F5A623] rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-[#F5A623] rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-[#F5A623] rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>© 2026 Scholarship Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}