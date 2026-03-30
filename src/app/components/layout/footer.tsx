import { Link } from 'react-router';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1A2E5A] text-white mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-[#F5A623] rounded-lg flex items-center justify-center">
                <span className="text-[#1A2E5A] font-bold text-2xl">S</span>
              </div>
              <span style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl text-[#F5A623]">
                Scholarship Finder System
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
          <p>© 2026 Scholarship Finder System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}