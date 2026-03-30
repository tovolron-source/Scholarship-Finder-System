import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';

export function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const passwordRequirements = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'Contains number', met: /[0-9]/.test(formData.password) },
  ];

  const passwordStrength = passwordRequirements.filter(req => req.met).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (passwordStrength < 4) {
      toast.error('Password does not meet requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Registration error:', data.message);
        toast.error('Registration failed', {
          description: data.message || 'Something went wrong',
        });
        setIsLoading(false);
        return;
      }

      console.log('✅ Registration successful for:', formData.email);
      toast.success('Account created successfully! 🎉', {
        description: `Welcome ${formData.fullName}! Redirecting to login...`,
      });
      
      // Clear form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      });
      
      setIsLoading(false);
      
      // Navigate to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('❌ Registration error:', error);
      toast.error('Registration failed', {
        description: 'Could not connect to server. Make sure backend is running on http://localhost:5000',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Branding (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#1A2E5A] via-[#2A3E6A] to-[#1A2E5A] text-white p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJBM0U2QSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative z-10 space-y-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-14 h-14 bg-[#F5A623] rounded-lg flex items-center justify-center">
              <span className="text-[#1A2E5A] font-bold text-3xl">S</span>
            </div>
            <span style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl text-[#F5A623]">
              Scholarship Finder System
            </span>
          </Link>

          <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-4xl mb-4">
            Start Your Journey to Educational Success
          </h1>
          <p className="text-gray-200 text-lg">
            Join thousands of students who have found their perfect scholarship match. 
            Create your account and unlock opportunities tailored to your academic profile.
          </p>

          <div className="space-y-4 mt-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#F5A623] rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">Smart Matching</p>
                <p className="text-sm text-gray-300">Get personalized scholarship recommendations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#F5A623] rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">Easy Applications</p>
                <p className="text-sm text-gray-300">Apply to multiple scholarships with ease</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#F5A623] rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">Track Progress</p>
                <p className="text-sm text-gray-300">Monitor all your applications in one place</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[#F8F9FC]">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="mb-8">
              <Link to="/" className="md:hidden flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-[#1A2E5A] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span style={{ fontFamily: 'var(--font-heading)' }} className="text-lg text-[#1A2E5A]">
                  Scholarship Finder System
                </span>
              </Link>
              <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl text-[#1A2E5A] mb-2">
                Create Account
              </h2>
              <p className="text-[#64748B]">Join Scholarship Finder System and discover your opportunities</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1A2E5A]"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2">
                      <Progress value={(passwordStrength / 4) * 100} className="flex-1" />
                      <span className="text-xs text-[#64748B]">
                        {passwordStrength === 4 ? 'Strong' : passwordStrength >= 2 ? 'Medium' : 'Weak'}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs">
                          {req.met ? (
                            <Check className="h-3 w-3 text-[#2ECC71]" />
                          ) : (
                            <X className="h-3 w-3 text-[#64748B]" />
                          )}
                          <span className={req.met ? 'text-[#2ECC71]' : 'text-[#64748B]'}>
                            {req.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1A2E5A]"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-[#E74C3C]">Passwords do not match</p>
                )}
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                />
                <label htmlFor="terms" className="text-sm text-[#64748B] leading-relaxed">
                  I agree to the <a href="#" className="text-[#1A2E5A] hover:underline">Terms & Conditions</a> and{' '}
                  <a href="#" className="text-[#1A2E5A] hover:underline">Privacy Policy</a>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white h-11 disabled:opacity-50"
                disabled={!formData.agreeToTerms || formData.password !== formData.confirmPassword || isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#64748B]">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11"
                onClick={() => navigate('/profile')}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>

              <p className="text-center text-sm text-[#64748B]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#1A2E5A] font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}