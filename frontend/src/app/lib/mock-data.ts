// Mock data for ScholarPath application

export interface User {
  id: string;
  fullName: string;
  email: string;
  profilePhoto?: string;
  contactNumber?: string;
  school?: string;
  course?: string;
  yearLevel?: string;
  gpa?: number;
  financialStatus?: 'Low Income' | 'Middle Income' | 'High Income';
  profileCompletion: number;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  providerLogo?: string;
  type: 'Merit' | 'Need-based' | 'Athletic' | 'Government' | 'Private';
  gpaRequirement: number;
  amount: string;
  slots: number;
  deadline: string;
  description: string;
  benefits: string[];
  eligibilityRequirements: {
    gpa: number;
    courses: string[];
    yearLevel: string[];
    financialStatus?: string[];
  };
  applicationProcess: string[];
  providerContact: string;
}

export interface Application {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  dateApplied: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  personalStatement?: string;
  documents?: string[];
}

export interface Notification {
  id: string;
  type: 'new' | 'deadline' | 'status';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Mock scholarships
export const mockScholarships: Scholarship[] = [
  {
    id: '1',
    name: 'DOST Science & Technology Scholarship',
    provider: 'Department of Science and Technology',
    providerLogo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100',
    type: 'Government',
    gpaRequirement: 3.0,
    amount: '$5,000/year',
    slots: 50,
    deadline: '2026-04-30',
    description: 'Full scholarship program for STEM students with strong academic performance and commitment to serving the country after graduation.',
    benefits: [
      'Full tuition fee coverage',
      'Monthly living allowance',
      'Book allowance',
      'Thesis/Research grant'
    ],
    eligibilityRequirements: {
      gpa: 3.0,
      courses: ['BS Computer Science', 'BS Engineering', 'BS Physics', 'BS Chemistry', 'BS Biology'],
      yearLevel: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
      financialStatus: ['Low Income', 'Middle Income']
    },
    applicationProcess: [
      'Submit online application form',
      'Upload required documents (transcript, ID, recommendation letter)',
      'Take entrance examination',
      'Attend interview if shortlisted'
    ],
    providerContact: 'scholarships@dost.gov'
  },
  {
    id: '2',
    name: 'Google Excellence Scholarship',
    provider: 'Google Inc.',
    providerLogo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100',
    type: 'Private',
    gpaRequirement: 3.5,
    amount: '$10,000',
    slots: 20,
    deadline: '2026-05-15',
    description: 'Scholarship for exceptional students pursuing careers in technology with demonstrated leadership and community involvement.',
    benefits: [
      'One-time grant of $10,000',
      'Mentorship from Google engineers',
      'Internship opportunity',
      'Access to Google developer resources'
    ],
    eligibilityRequirements: {
      gpa: 3.5,
      courses: ['BS Computer Science', 'BS Information Technology', 'BS Software Engineering'],
      yearLevel: ['3rd Year', '4th Year'],
    },
    applicationProcess: [
      'Complete online application',
      'Submit essay on technology and society',
      'Provide two letters of recommendation',
      'Participate in video interview'
    ],
    providerContact: 'scholarships@google.com'
  },
  {
    id: '3',
    name: 'Academic Merit Award',
    provider: 'State University Foundation',
    providerLogo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100',
    type: 'Merit',
    gpaRequirement: 3.8,
    amount: '$3,000/semester',
    slots: 100,
    deadline: '2026-03-31',
    description: 'Merit-based scholarship for high-achieving students across all disciplines.',
    benefits: [
      'Tuition reduction of $3,000 per semester',
      'Priority course registration',
      'Access to honors lounge'
    ],
    eligibilityRequirements: {
      gpa: 3.8,
      courses: ['All Programs'],
      yearLevel: ['2nd Year', '3rd Year', '4th Year'],
    },
    applicationProcess: [
      'Submit application through university portal',
      'No additional documents required (automatic review based on grades)'
    ],
    providerContact: 'foundation@stateuniversity.edu'
  },
  {
    id: '4',
    name: 'Future Engineers Scholarship',
    provider: 'Engineering Society of America',
    providerLogo: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=100',
    type: 'Merit',
    gpaRequirement: 3.2,
    amount: '$4,500',
    slots: 30,
    deadline: '2026-06-01',
    description: 'Supporting the next generation of engineers through financial assistance and professional development.',
    benefits: [
      'Annual grant of $4,500',
      'Conference attendance sponsorship',
      'Professional networking events'
    ],
    eligibilityRequirements: {
      gpa: 3.2,
      courses: ['BS Engineering', 'BS Computer Engineering', 'BS Electrical Engineering'],
      yearLevel: ['2nd Year', '3rd Year', '4th Year'],
    },
    applicationProcess: [
      'Fill out application form',
      'Submit project portfolio',
      'Provide faculty recommendation'
    ],
    providerContact: 'scholarships@esa.org'
  },
  {
    id: '5',
    name: 'Community Champions Grant',
    provider: 'National Youth Foundation',
    providerLogo: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=100',
    type: 'Need-based',
    gpaRequirement: 2.5,
    amount: '$2,500',
    slots: 75,
    deadline: '2026-04-15',
    description: 'Financial support for students who demonstrate commitment to community service and leadership.',
    benefits: [
      '$2,500 annual grant',
      'Leadership training workshops',
      'Community project funding'
    ],
    eligibilityRequirements: {
      gpa: 2.5,
      courses: ['All Programs'],
      yearLevel: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
      financialStatus: ['Low Income']
    },
    applicationProcess: [
      'Complete application form',
      'Submit community service documentation',
      'Write essay on leadership experience'
    ],
    providerContact: 'grants@nyf.org'
  },
  {
    id: '6',
    name: 'Women in STEM Scholarship',
    provider: 'Tech Women Network',
    providerLogo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
    type: 'Merit',
    gpaRequirement: 3.3,
    amount: '$6,000',
    slots: 25,
    deadline: '2026-05-30',
    description: 'Empowering women pursuing careers in science, technology, engineering, and mathematics.',
    benefits: [
      'Annual scholarship of $6,000',
      'Mentorship program',
      'Industry networking events',
      'Career development workshops'
    ],
    eligibilityRequirements: {
      gpa: 3.3,
      courses: ['BS Computer Science', 'BS Engineering', 'BS Mathematics', 'BS Physics'],
      yearLevel: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    },
    applicationProcess: [
      'Online application submission',
      'Personal statement on STEM goals',
      'Faculty recommendation letter'
    ],
    providerContact: 'scholarships@techwomen.org'
  }
];

// Mock applications
export const mockApplications: Application[] = [
  {
    id: 'app1',
    scholarshipId: '1',
    scholarshipName: 'DOST Science & Technology Scholarship',
    provider: 'Department of Science and Technology',
    dateApplied: '2026-03-01',
    status: 'Under Review',
    personalStatement: 'I am passionate about using technology to solve real-world problems...',
    documents: ['transcript.pdf', 'recommendation.pdf']
  },
  {
    id: 'app2',
    scholarshipId: '2',
    scholarshipName: 'Google Excellence Scholarship',
    provider: 'Google Inc.',
    dateApplied: '2026-02-15',
    status: 'Pending',
    personalStatement: 'Technology has the power to transform lives...',
    documents: ['transcript.pdf', 'essay.pdf', 'recommendation1.pdf', 'recommendation2.pdf']
  }
];

// Mock notifications
export const mockNotifications: Notification[] = [];

// Mock saved scholarships
export const mockSavedScholarships: string[] = ['1', '3', '6'];
