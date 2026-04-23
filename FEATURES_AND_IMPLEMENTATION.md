# Features and Implementation Guide
**Last Updated**: April 23, 2026

---

## Table of Contents
1. [Admin Dashboard Features](#admin-dashboard-features)
2. [Scholarship Management](#scholarship-management)
3. [Application Management](#application-management)
4. [Notifications System](#notifications-system)
5. [Student Features](#student-features)

---

## Admin Dashboard Features

### Admin User Setup ✅
**Email**: admin@bisu.edu.ph  
**Password**: admin123  
**Role**: admin

**Features Available**:
- Dashboard showing all scholarships and applicants
- Approve/Reject applications
- Manage scholarships (Create, Edit, Delete)
- Search and sort functionality
- Year level selection (1st, 2nd, 3rd, 4th Year)
- Admin account settings

---

## Scholarship Management

### Creating/Editing Scholarships

#### Year Level Selection ✅
- Checkboxes for: 1st Year, 2nd Year, 3rd Year, 4th Year
- Multiple year levels can be selected
- Stored in database for eligibility filtering
- File: `frontend/src/app/pages/admin/admin-scholarship-form.tsx`

#### GWA Requirement Auto-Population ✅
- When admin enters "Minimum GWA" value, it automatically sets "GWA Requirement"
- Uses the Philippine scale (1.0 = best, 5.0 = worst)
- Filters scholarships by student's GWA during matching

**Code Implementation**:
```typescript
const handleMinimumGWAChange = (value: string) => {
  if (value) {
    setFormData({
      ...formData,
      GWARequirement: value
    });
  }
};
```

#### Fields Available
- Scholarship Name
- Description
- Amount
- Minimum GWA
- GWA Requirement (auto-set)
- Eligible Courses
- Year Levels (multiple checkboxes)
- Additional Requirements
- Status (Active/Inactive)

---

## Application Management

### Application Workflow

#### 1. Student Applies ✅
- Personal statement (required)
- Documents: Temporarily disabled
- Certification checkbox
- Submit application

**File**: `frontend/src/app/pages/apply.tsx`

#### 2. Admin Reviews ✅
- View all applicants for each scholarship
- Approve or Reject applications
- View applicant details

**File**: `frontend/src/app/pages/admin/admin-dashboard.tsx`

#### 3. Student Withdraws ✅
- Students can withdraw applications at any time
- Status must be "Pending"
- Stored in database with timestamp
- Available on: `frontend/src/app/pages/applications.tsx`

**Backend Endpoint**: `DELETE /api/applications/:applicationId/withdraw`

### Application Status Flow

```
Pending → Approved → Completed
      ↓
      Rejected
      
Pending → Withdrawn (by student)
```

**Status Color Coding**:
- Pending: Yellow
- Approved: Green
- Rejected: Red
- Under Review: Blue
- Withdrawn: Gray

---

## Notifications System

### Notification Features ✅

#### Auto-Generated Notifications
- **On Application Approval**: 
  - Title: "Application Approved"
  - Message: "Congratulations! Your application for [ScholarshipName] has been approved. You will be contacted with further instructions."
  
- **On Application Rejection**: 
  - Title: "Application Rejected"
  - Message: "Your application for [ScholarshipName] was not selected at this time. Please check other opportunities."

#### Notification Management
- Mark as read/unread
- Mark all as read
- Delete individual notifications
- Real-time notification count

**File**: `frontend/src/app/pages/notifications.tsx`

#### Database Schema
```sql
Columns:
- NotificationID (PK)
- StudentID (FK)
- Type (e.g., 'status')
- Title
- Message
- ScholarshipID (FK)
- ApplicationID (FK)
- IsRead (boolean)
- CreatedAt (timestamp)
```

---

## Student Features

### Landing Page - Matched Scholarships ✅
- **For Logged-In Students**: Shows matched scholarships based on:
  - Student's GWA
  - Student's Course
  - Year Level eligibility
  
- **For Non-Logged-In Users & Admins**: Shows featured scholarships

**File**: `frontend/src/app/pages/landing.tsx`

**Filtering Logic**:
```typescript
const matchedScholarships = allScholarships.filter((scholarship: any) => {
  const gwaRequirement = scholarship.GWARequirement || 5.0;
  const eligibleCourses = scholarship.EligibleCourses 
    ? scholarship.EligibleCourses.split(',').map((c: string) => c.trim())
    : ['All Programs'];
  
  const meetsGWA = !userData.GWA || userData.GWA <= gwaRequirement;
  const meetsCourse = !userData.Course || 
    eligibleCourses.includes('All Programs') || 
    eligibleCourses.includes(userData.Course);
  
  return meetsGWA && meetsCourse;
}).slice(0, 3);
```

### Search Page
- Filter by scholarship name, description
- View scholarship details
- Apply to scholarships
- Card layout displays properly without overflow

### My Applications
- View all applications with current status
- Withdraw pending applications
- View application details
- Track application history

### Favorites
- Save scholarships for later
- View all favorited scholarships
- Remove from favorites

### Profile
- Edit personal information
- Upload profile photo
- View profile completion percentage
- Update academic information (GWA, course, year level)

---

## Technical Implementation Notes

### Database Tables
- `user` - User accounts with role
- `student_profile` - Student details and metadata
- `scholarship` - Scholarship information
- `application` - Student applications with status
- `notification` - Notification records
- `favorite` - Saved scholarships

### API Endpoints Summary

**Authentication**:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login

**Scholarships**:
- `GET /api/scholarships` - List all scholarships
- `GET /api/scholarships/:id` - Get specific scholarship
- `POST /api/admin/scholarships` - Create scholarship (admin)
- `PUT /api/admin/scholarships/:id` - Update scholarship (admin)
- `DELETE /api/admin/scholarships/:id` - Delete scholarship (admin)

**Applications**:
- `POST /api/applications` - Submit application
- `GET /api/applications/student/:studentId` - Get student's applications
- `DELETE /api/applications/:applicationId/withdraw` - Withdraw application
- `GET /api/admin/scholarships/:id/applicants` - Get applicants (admin)
- `POST /api/applications/:id/approve` - Approve application (admin)
- `POST /api/applications/:id/reject` - Reject application (admin)

**Notifications**:
- `GET /api/notifications/student/:studentId` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

---

## Document Upload Status

### Currently Disabled ✅
- File uploads (transcript, ID document, recommendation letter) are **temporarily disabled**
- Students can still submit applications with personal statement
- Documents section shows yellow alert: "Documents Temporarily Disabled"

### To Re-Enable Documents
See `TECHNICAL_DOCUMENTATION.md` for re-enabling instructions

---

## GWA System (Not GPA)

**Important**: This system uses **GWA (Grade Weighted Average)**, not GPA.

**GWA Scale** (Philippine System):
- 1.0 = Best/Highest Performance
- 5.0 = Worst/Lowest Performance

Filtering Logic:
- Student GWA ≤ Scholarship GWA Requirement = Eligible
- Example: If scholarship requires 3.0 GWA, students with 1.0-3.0 are eligible

