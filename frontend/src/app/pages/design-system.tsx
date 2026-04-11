import { useState } from 'react';
import { Heart, Search, Award, Users, Bell, Calendar, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

export function DesignSystemPage() {
  const [sliderValue, setSliderValue] = useState([3.0]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-12 px-6">
      <div className="container mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-5xl text-[#1A2E5A]">
            Scholarship Finder System Design
          </h1>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            A comprehensive component library showcasing all design elements used in the Scholarship Finder System application
          </p>
        </div>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="w-full h-20 bg-[#1A2E5A] rounded-lg mb-2"></div>
                <p className="text-sm font-medium">Deep Navy</p>
                <p className="text-xs text-[#64748B]">#1A2E5A</p>
              </div>
              <div>
                <div className="w-full h-20 bg-[#F5A623] rounded-lg mb-2"></div>
                <p className="text-sm font-medium">Warm Gold</p>
                <p className="text-xs text-[#64748B]">#F5A623</p>
              </div>
              <div>
                <div className="w-full h-20 bg-[#2ECC71] rounded-lg mb-2"></div>
                <p className="text-sm font-medium">Success</p>
                <p className="text-xs text-[#64748B]">#2ECC71</p>
              </div>
              <div>
                <div className="w-full h-20 bg-[#E67E22] rounded-lg mb-2"></div>
                <p className="text-sm font-medium">Warning</p>
                <p className="text-xs text-[#64748B]">#E67E22</p>
              </div>
              <div>
                <div className="w-full h-20 bg-[#E74C3C] rounded-lg mb-2"></div>
                <p className="text-sm font-medium">Error</p>
                <p className="text-xs text-[#64748B]">#E74C3C</p>
              </div>
              <div>
                <div className="w-full h-20 bg-[#F8F9FC] rounded-lg mb-2 border"></div>
                <p className="text-sm font-medium">Background</p>
                <p className="text-xs text-[#64748B]">#F8F9FC</p>
              </div>
              <div>
                <div className="w-full h-20 bg-white rounded-lg mb-2 border"></div>
                <p className="text-sm font-medium">White</p>
                <p className="text-xs text-[#64748B]">#FFFFFF</p>
              </div>
              <div>
                <div className="w-full h-20 bg-[#64748B] rounded-lg mb-2"></div>
                <p className="text-sm font-medium">Muted Text</p>
                <p className="text-xs text-[#64748B]">#64748B</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)' }}>Heading 1 - DM Serif Display</h1>
              <p className="text-sm text-[#64748B]">40px / 2.5rem - Page titles</p>
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)' }}>Heading 2 - DM Serif Display</h2>
              <p className="text-sm text-[#64748B]">28px / 1.75rem - Section headings</p>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)' }}>Heading 3 - DM Serif Display</h3>
              <p className="text-sm text-[#64748B]">20px / 1.25rem - Card titles</p>
            </div>
            <div>
              <p>Body text - DM Sans Regular</p>
              <p className="text-sm text-[#64748B]">16px / 1rem - Paragraphs and content</p>
            </div>
            <div>
              <p className="text-sm">Small text - DM Sans Regular</p>
              <p className="text-sm text-[#64748B]">14px / 0.875rem - Metadata and captions</p>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-[#1A2E5A] hover:bg-[#2A3E6A] text-white">
                Primary Button
              </Button>
              <Button className="bg-[#F5A623] hover:bg-[#E69515] text-white">
                Accent Button
              </Button>
              <Button variant="outline">
                Outline Button
              </Button>
              <Button variant="ghost">
                Ghost Button
              </Button>
              <Button variant="destructive">
                Destructive Button
              </Button>
              <Button disabled>
                Disabled Button
              </Button>
              <Button size="sm">
                Small Button
              </Button>
              <Button size="lg">
                Large Button
              </Button>
              <Button size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-[#1A2E5A] text-white">Merit</Badge>
              <Badge className="bg-[#F5A623] text-white">Pending</Badge>
              <Badge className="bg-[#2ECC71] text-white">✓ Eligible</Badge>
              <Badge className="bg-[#E67E22] text-white">⚠ Partial Match</Badge>
              <Badge className="bg-[#E74C3C] text-white">Rejected</Badge>
              <Badge variant="outline">GPA 3.5+</Badge>
              <Badge variant="secondary">Secondary</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input Field</label>
              <Input placeholder="Enter your email" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search Input</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <Input placeholder="Search scholarships..." className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Slider (GPA: {sliderValue[0].toFixed(1)})</label>
              <Slider 
                value={sliderValue} 
                onValueChange={setSliderValue}
                min={0}
                max={4.0}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Checkboxes</label>
              <div className="flex items-center gap-2">
                <Checkbox id="check1" defaultChecked />
                <label htmlFor="check1" className="text-sm">Checked</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="check2" />
                <label htmlFor="check2" className="text-sm">Unchecked</label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Linear Progress - 75%</p>
              <Progress value={75} />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Circular Progress</p>
              <div className="flex gap-6">
                {[25, 50, 75, 100].map((value) => (
                  <div key={value} className="relative w-24 h-24">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="#F8F9FC" strokeWidth="6" fill="none" />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke={value >= 75 ? '#2ECC71' : value >= 50 ? '#F5A623' : '#E74C3C'}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - value / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-[#1A2E5A]">{value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Icons */}
        <Card>
          <CardHeader>
            <CardTitle>Icons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
              <div className="text-center">
                <Heart className="h-6 w-6 mx-auto mb-2 text-[#1A2E5A]" />
                <p className="text-xs">Heart</p>
              </div>
              <div className="text-center">
                <Search className="h-6 w-6 mx-auto mb-2 text-[#1A2E5A]" />
                <p className="text-xs">Search</p>
              </div>
              <div className="text-center">
                <Award className="h-6 w-6 mx-auto mb-2 text-[#1A2E5A]" />
                <p className="text-xs">Award</p>
              </div>
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-[#1A2E5A]" />
                <p className="text-xs">Users</p>
              </div>
              <div className="text-center">
                <Bell className="h-6 w-6 mx-auto mb-2 text-[#1A2E5A]" />
                <p className="text-xs">Bell</p>
              </div>
              <div className="text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-[#1A2E5A]" />
                <p className="text-xs">Calendar</p>
              </div>
              <div className="text-center">
                <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-[#2ECC71]" />
                <p className="text-xs">Check</p>
              </div>
              <div className="text-center">
                <XCircle className="h-6 w-6 mx-auto mb-2 text-[#E74C3C]" />
                <p className="text-xs">X</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Card Variations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#1A2E5A] mb-2">Standard Card</h3>
                <p className="text-sm text-[#64748B]">
                  Cards have subtle shadows and hover effects for better interaction feedback.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#F5A623]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#1A2E5A] mb-2">Highlighted Card</h3>
                <p className="text-sm text-[#64748B]">
                  Used for notifications or important information with accent border.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">Personal Info</TabsTrigger>
                <TabsTrigger value="tab2">Academic Info</TabsTrigger>
                <TabsTrigger value="tab3">Financial Status</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="space-y-2">
                <p className="text-sm text-[#64748B]">Personal information content goes here.</p>
              </TabsContent>
              <TabsContent value="tab2" className="space-y-2">
                <p className="text-sm text-[#64748B]">Academic information content goes here.</p>
              </TabsContent>
              <TabsContent value="tab3" className="space-y-2">
                <p className="text-sm text-[#64748B]">Financial status content goes here.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Toast Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => toast.success('Success message!')}>
                Success Toast
              </Button>
              <Button onClick={() => toast.error('Error message!')}>
                Error Toast
              </Button>
              <Button onClick={() => toast('Info message!')}>
                Info Toast
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Status Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#2ECC71]" />
                <span className="text-sm">Eligible / Approved / Success</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-[#E67E22]" />
                <span className="text-sm">Partial Match / Warning / In Progress</span>
              </div>
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-[#E74C3C]" />
                <span className="text-sm">Not Eligible / Rejected / Error</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}