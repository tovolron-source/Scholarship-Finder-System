// Mock data for ScholarPath application
// NOTE: All data is now fetched from the database

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

// Mock data has been removed - all data is now fetched from the database
// See the backend API at http://localhost:5000/api/scholarships

// Note: All mock scholarship and application data has been removed.
// All data is now fetched from the database API.
