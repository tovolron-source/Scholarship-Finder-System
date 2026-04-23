# Technical Documentation
**Last Updated**: April 23, 2026

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [File Structure](#file-structure)
4. [Code Changes Documentation](#code-changes-documentation)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Deployment Instructions](#deployment-instructions)
8. [Document Uploads - Re-enabling Guide](#document-uploads---re-enabling-guide)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                  │
│              localhost:5174 (Vite Dev)              │
├─────────────────────────────────────────────────────┤
│         ↓ HTTP/REST API (Fetch) ↑                  │
├─────────────────────────────────────────────────────┤
│              Backend (Express.js)                   │
│              localhost:5000                         │
├─────────────────────────────────────────────────────┤
│         ↓ SQL Queries ↑                             │
├─────────────────────────────────────────────────────┤
│         MySQL/MariaDB Database                      │
│              sfs (Database Name)                    │
└─────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (super-fast build tool)
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **State Management**: React Hooks (useState, useContext)
- **HTTP Client**: Fetch API
- **Notifications**: Sonner (toast library)
- **Icons**: Lucide React
- **Authentication**: JWT (stored in localStorage)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database Driver**: mysql2/promise
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **OAuth**: Google Auth Library (google-auth-library)
- **File Upload**: Multer (disabled for documents)
- **Environment**: dotenv

### Database
- **Type**: MySQL/MariaDB
- **Connection Pool**: mysql2/promise pool
- **Schema**: Relational with 6 main tables

---

## File Structure

### Backend Structure
```
backend/
├── src/
│   ├── server.ts              # Express app setup
│   ├── config/
│   │   └── database.ts        # Database connection pool
│   ├── controllers/
│   │   ├── authController.ts  # Auth logic (register, login)
│   │   ├── applicationsController.ts  # Application logic
│   │   ├── scholarshipController.ts   # Scholarship logic
│   │   ├── adminScholarshipController.ts  # Admin scholarship logic
│   │   ├── notificationController.ts  # Notification logic
│   │   ├── favoriteController.ts      # Favorites logic
│   │   └── ...
│   ├── routes/
│   │   ├── auth.ts           # Auth endpoints
│   │   ├── applications.ts   # Application endpoints
│   │   ├── scholarships.ts   # Scholarship endpoints
│   │   ├── admin.ts          # Admin endpoints
│   │   ├── notifications.ts  # Notification endpoints
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.ts           # JWT verification
│   │   ├── adminAuth.ts      # Admin role verification
│   │   └── ...
│   ├── models/
│   │   ├── User.ts           # User model/types
│   │   └── ...
│   └── migrations/
│       └── addRoleColumn.ts  # Database migration script
├── uploads/                   # Uploaded files directory
├── package.json
├── tsconfig.json
└── .env                       # Environment variables
```

### Frontend Structure
```
frontend/
├── src/
│   ├── main.tsx              # Entry point
│   ├── app/
│   │   ├── App.tsx           # Root component
│   │   ├── routes.tsx        # Route configuration
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── navbar.tsx      # Navigation bar
│   │   │   │   └── footer.tsx      # Footer
│   │   │   └── ui/                 # Shadcn UI components
│   │   ├── pages/
│   │   │   ├── landing.tsx         # Home page
│   │   │   ├── login.tsx           # Login page
│   │   │   ├── register.tsx        # Register page
│   │   │   ├── search.tsx          # Search page
│   │   │   ├── apply.tsx           # Application form
│   │   │   ├── applications.tsx    # My applications
│   │   │   ├── favorites.tsx       # Favorites page
│   │   │   ├── notifications.tsx   # Notifications page
│   │   │   ├── profile.tsx         # Student profile
│   │   │   ├── admin/
│   │   │   │   ├── admin-dashboard.tsx
│   │   │   │   ├── admin-scholarship-form.tsx
│   │   │   │   └── admin-account-settings.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── debounce.ts
│   │   │   ├── scholarshipMapper.ts
│   │   │   └── redirectWithSearchQuery.ts
│   │   └── styles/
│   │       ├── index.css
│   │       ├── tailwind.css
│   │       └── fonts.css
│   └── ...
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env                       # Environment variables
```

---

## Code Changes Documentation

### 1. GWA Auto-Population Feature

**File**: `frontend/src/app/pages/admin/admin-scholarship-form.tsx`

**Change**: When admin enters minimum GWA, it automatically fills GWA Requirement

```typescript
const handleMinimumGWAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.value) {
    setFormData({
      ...formData,
      GWARequirement: e.target.value
    });
  }
};
```

**Usage**:
```typescript
<Input
  type="number"
  placeholder="e.g., 3.0"
  value={formData.minimumGWA}
  onChange={handleMinimumGWAChange}
/>
```

---

### 2. Year Level Selection (Multiple Checkboxes)

**File**: `frontend/src/app/pages/admin/admin-scholarship-form.tsx`

**Change**: Replaced single year level input with checkboxes for multiple selection

**State Change**:
```typescript
// Before
yearLevel: ''

// After
yearLevel: [] as string[]
```

**Rendering**:
```typescript
{['1st Year', '2nd Year', '3rd Year', '4th Year'].map((year) => (
  <div key={year} className="flex items-center space-x-2">
    <Checkbox
      id={year}
      checked={formData.yearLevel.includes(year)}
      onCheckedChange={(checked) => {
        if (checked) {
          setFormData({
            ...formData,
            yearLevel: [...formData.yearLevel, year]
          });
        } else {
          setFormData({
            ...formData,
            yearLevel: formData.yearLevel.filter(y => y !== year)
          });
        }
      }}
    />
    <label htmlFor={year}>{year}</label>
  </div>
))}
```

---

### 3. Application Withdrawal Implementation

**File**: `frontend/src/app/pages/applications.tsx`

**Change**: Added withdrawal functionality with API integration

```typescript
const handleWithdraw = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!user || !token) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(user);
    const response = await fetch(
      `http://localhost:5000/api/applications/${id}/withdraw`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId: userData.id })
      }
    );

    if (response.ok) {
      setApplications(
        applications.filter(app => app.ApplicationID !== Number(id))
      );
      toast.success('Application withdrawn successfully');
    } else {
      const error = await response.json();
      toast.error(error.message || 'Failed to withdraw application');
    }
  } catch (error) {
    console.error('Withdraw error:', error);
    toast.error('Failed to withdraw application');
  }
};
```

**Backend Endpoint** (`backend/src/routes/applications.ts`):
```typescript
router.delete(
  '/:applicationId/withdraw',
  verifyToken,
  withdrawApplication
);
```

**Backend Controller** (`backend/src/controllers/applicationsController.ts`):
```typescript
export async function withdrawApplication(req: Request, res: Response) {
  try {
    const { applicationId } = req.params;
    const { studentId } = req.body;
    const userId = req.user?.id;

    // Verify ownership
    if (userId !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const connection = await pool.getConnection();
    
    // Check application exists and is pending
    const [applications] = await connection.query(
      'SELECT * FROM application WHERE ApplicationID = ? AND StudentID = ?',
      [applicationId, studentId]
    );

    const app = (applications as any[])[0];
    if (!app || app.Status !== 'Pending') {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Can only withdraw pending applications'
      });
    }

    // Delete application
    await connection.query(
      'DELETE FROM application WHERE ApplicationID = ?',
      [applicationId]
    );

    connection.release();
    res.json({ success: true, message: 'Application withdrawn' });
  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
```

---

### 4. Notifications Auto-Generation on Approval/Rejection

**File**: `backend/src/controllers/applicationsController.ts`

**Change**: When admin approves/rejects, notification is automatically created

```typescript
export async function approveApplication(req: Request, res: Response) {
  try {
    const { applicationId } = req.params;
    const connection = await pool.getConnection();

    // Get application details
    const [applications] = await connection.query(
      'SELECT * FROM application WHERE ApplicationID = ?',
      [applicationId]
    );

    const app = (applications as any[])[0];

    // Get scholarship details
    const [scholarships] = await connection.query(
      'SELECT ScholarshipName FROM scholarship WHERE ScholarshipID = ?',
      [app.ScholarshipID]
    );

    const scholarship = (scholarships as any[])[0];

    // Create notification
    await connection.query(
      `INSERT INTO notification 
       (StudentID, Type, Title, Message, ScholarshipID, ApplicationID, IsRead, CreatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        app.StudentID,
        'status',
        'Application Approved',
        `Congratulations! Your application for ${scholarship.ScholarshipName} has been approved. You will be contacted with further instructions.`,
        app.ScholarshipID,
        applicationId,
        false
      ]
    );

    // Update application status
    await connection.query(
      'UPDATE application SET Status = ? WHERE ApplicationID = ?',
      ['Approved', applicationId]
    );

    connection.release();
    res.json({ success: true, message: 'Application approved' });
  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
```

---

### 5. Document Uploads - Disabled

**File**: `frontend/src/app/pages/apply.tsx`

**Change**: Removed document step from form, added alert

**Before**:
```typescript
const steps = [
  { number: 1, title: 'Details', description: 'Personal statement' },
  { number: 2, title: 'Documents', description: 'Upload files' },
  { number: 3, title: 'Review', description: 'Review & submit' },
];
```

**After**:
```typescript
const steps = [
  { number: 1, title: 'Details', description: 'Personal statement' },
  // DISABLED: Document upload step
  { number: 2, title: 'Review', description: 'Review & submit' },
];
```

**Alert Added**:
```typescript
<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
  <h4 className="font-semibold text-yellow-900 mb-2">
    Documents Temporarily Disabled
  </h4>
  <p className="text-sm text-yellow-800">
    Document uploads (transcript, ID, recommendation letter) are temporarily disabled.
    You can still submit your application with your personal statement.
  </p>
</div>
```

**File Submission**:
```typescript
const applicationFormData = new FormData();
applicationFormData.append('StudentID', userData.id);
applicationFormData.append('ScholarshipID', id!);
applicationFormData.append('PersonalStatement', formData.personalStatement);

// Files optional - only append if they exist
if (formData.transcript) {
  applicationFormData.append('transcript', formData.transcript);
}
```

**File**: `backend/src/routes/applications.ts`

**Change**: Removed multer middleware from POST route

**Before**:
```typescript
router.post('/', 
  verifyToken, 
  upload.fields([
    { name: 'transcript', maxCount: 1 },
    { name: 'idDocument', maxCount: 1 },
    { name: 'recommendation', maxCount: 1 }
  ]), 
  createApplication
);
```

**After**:
```typescript
// DOCUMENT UPLOADS DISABLED FOR NOW
router.post('/', verifyToken, createApplication);
```

---

## Database Schema

### User Table
```sql
CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  Email VARCHAR(255) UNIQUE NOT NULL,
  Name VARCHAR(255) NOT NULL,
  Password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Student Profile Table
```sql
CREATE TABLE student_profile (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  fullName VARCHAR(255),
  gender VARCHAR(50),
  address TEXT,
  contactNumber VARCHAR(20),
  profilePhoto VARCHAR(255),
  profileCompletion INT DEFAULT 0,
  school VARCHAR(255),
  course VARCHAR(255),
  yearLevel VARCHAR(50),
  gwa DECIMAL(3,2),
  financialStatus VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(id)
);
```

### Scholarship Table
```sql
CREATE TABLE scholarship (
  ScholarshipID INT PRIMARY KEY AUTO_INCREMENT,
  ScholarshipName VARCHAR(255) NOT NULL,
  Description TEXT,
  Amount DECIMAL(10,2),
  GWARequirement DECIMAL(3,2),
  EligibleCourses TEXT,
  YearLevel VARCHAR(255),
  AdditionalRequirements TEXT,
  Status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Application Table
```sql
CREATE TABLE application (
  ApplicationID INT PRIMARY KEY AUTO_INCREMENT,
  StudentID INT NOT NULL,
  ScholarshipID INT NOT NULL,
  PersonalStatement TEXT,
  Status ENUM('Pending', 'Approved', 'Rejected', 'Under Review') DEFAULT 'Pending',
  TranscriptPath VARCHAR(255),
  IDDocumentPath VARCHAR(255),
  RecommendationPath VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (StudentID) REFERENCES user(id),
  FOREIGN KEY (ScholarshipID) REFERENCES scholarship(ScholarshipID)
);
```

### Notification Table
```sql
CREATE TABLE notification (
  NotificationID INT PRIMARY KEY AUTO_INCREMENT,
  StudentID INT NOT NULL,
  Type VARCHAR(50),
  Title VARCHAR(255),
  Message TEXT,
  ScholarshipID INT,
  ApplicationID INT,
  IsRead BOOLEAN DEFAULT FALSE,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (StudentID) REFERENCES user(id),
  FOREIGN KEY (ScholarshipID) REFERENCES scholarship(ScholarshipID),
  FOREIGN KEY (ApplicationID) REFERENCES application(ApplicationID)
);
```

### Favorite Table
```sql
CREATE TABLE favorite (
  FavoriteID INT PRIMARY KEY AUTO_INCREMENT,
  StudentID INT NOT NULL,
  ScholarshipID INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (StudentID) REFERENCES user(id),
  FOREIGN KEY (ScholarshipID) REFERENCES scholarship(ScholarshipID)
);
```

---

## API Reference

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "name": "John Doe",
  "password": "password123"
}

Response: { success: true, user: {...}, token: "jwt_token" }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}

Response: { success: true, user: {...}, token: "jwt_token" }
```

#### Google OAuth
```
POST /api/auth/google
Content-Type: application/json
Headers: Authorization: Bearer {token}

{
  "token": "google_credential_token"
}

Response: { success: true, user: {...}, token: "jwt_token" }
```

### Scholarship Endpoints

#### Get All Scholarships
```
GET /api/scholarships
Response: { success: true, data: [scholarship] }
```

#### Get Scholarship by ID
```
GET /api/scholarships/:id
Response: { success: true, data: scholarship }
```

#### Create Scholarship (Admin)
```
POST /api/admin/scholarships
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "ScholarshipName": "...",
  "Description": "...",
  "Amount": 10000,
  "GWARequirement": 3.0,
  "YearLevel": ["1st Year", "2nd Year"],
  ...
}

Response: { success: true, message: "..." }
```

### Application Endpoints

#### Submit Application
```
POST /api/applications
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "StudentID": 1,
  "ScholarshipID": 1,
  "PersonalStatement": "...",
  "transcript": (optional file),
  "idDocument": (optional file),
  "recommendation": (optional file)
}

Response: { success: true, message: "Application submitted" }
```

#### Get Student's Applications
```
GET /api/applications/student/:studentId
Headers: Authorization: Bearer {token}

Response: { success: true, data: [applications] }
```

#### Withdraw Application
```
DELETE /api/applications/:applicationId/withdraw
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "studentId": 1
}

Response: { success: true, message: "Application withdrawn" }
```

#### Approve Application (Admin)
```
POST /api/applications/:applicationId/approve
Headers: Authorization: Bearer {token}

Response: { success: true, message: "Application approved" }
```

#### Reject Application (Admin)
```
POST /api/applications/:applicationId/reject
Headers: Authorization: Bearer {token}

Response: { success: true, message: "Application rejected" }
```

### Notification Endpoints

#### Get Notifications
```
GET /api/notifications/student/:studentId
Headers: Authorization: Bearer {token}

Response: { success: true, count: 5, data: [notifications] }
```

#### Mark as Read
```
PUT /api/notifications/:notificationId/read
Headers: Authorization: Bearer {token}

Response: { success: true, message: "Marked as read" }
```

#### Mark All as Read
```
PUT /api/notifications/mark-all-read
Headers: Authorization: Bearer {token}

Body: { studentId: 1 }

Response: { success: true, message: "All marked as read" }
```

#### Delete Notification
```
DELETE /api/notifications/:notificationId
Headers: Authorization: Bearer {token}

Response: { success: true, message: "Notification deleted" }
```

---

## Deployment Instructions

### Production Build

#### Backend
```bash
cd backend

# Build TypeScript
npm run build

# Start production server
npm start
# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "sfs-backend" -- start
```

#### Frontend
```bash
cd frontend

# Build for production
npm run build

# Serve static files
npm install -g serve
serve -s dist
# Or use Nginx/Apache
```

### Environment Variables for Production

**Backend** (`.env`):
```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=sfs
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

**Frontend** (`.env`):
```env
VITE_API_URL=https://your-backend-url.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Document Uploads - Re-enabling Guide

### To Re-Enable Document Uploads

#### Step 1: Uncomment Frontend Code
**File**: `frontend/src/app/pages/apply.tsx`

Find and uncomment the document upload step:
```typescript
// CHANGE: Restore steps array
const steps = [
  { number: 1, title: 'Details', description: 'Personal statement' },
  { number: 2, title: 'Documents', description: 'Upload files' },  // Uncomment
  { number: 3, title: 'Review', description: 'Review & submit' },
];

// CHANGE: Restore document upload UI
// Uncomment the entire Step 2 section with file inputs

// CHANGE: Restore back button logic
onClick={() => setCurrentStep(2)}  // From setCurrentStep(1)
```

#### Step 2: Uncomment Backend Route Middleware
**File**: `backend/src/routes/applications.ts`

Uncomment the multer configuration:
```typescript
// CHANGE: Restore multer middleware
router.post('/', 
  verifyToken, 
  upload.fields([
    { name: 'transcript', maxCount: 1 },
    { name: 'idDocument', maxCount: 1 },
    { name: 'recommendation', maxCount: 1 }
  ]), 
  createApplication
);
```

#### Step 3: Uncomment File Processing
**File**: `backend/src/controllers/applicationsController.ts`

Uncomment file handling logic:
```typescript
// CHANGE: Restore file processing
if (req.files) {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
  if (files.transcript) {
    applicationData.TranscriptPath = `/uploads/${files.transcript[0].filename}`;
  }
  if (files.idDocument) {
    applicationData.IDDocumentPath = `/uploads/${files.idDocument[0].filename}`;
  }
  if (files.recommendation) {
    applicationData.RecommendationPath = `/uploads/${files.recommendation[0].filename}`;
  }
}
```

#### Step 4: Rebuild and Restart
```bash
# Backend
cd backend
npm run build
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

### Verification After Re-enabling
1. Login as student
2. Apply to scholarship
3. Step 1: Enter personal statement
4. Step 2: Upload files (should now be visible)
5. Step 3: Review and submit
6. Verify files saved to `backend/uploads/`
7. Verify file paths saved to database

