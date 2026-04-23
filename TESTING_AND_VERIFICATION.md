# Testing and Verification Guide
**Last Updated**: April 23, 2026

---

## Table of Contents
1. [Setup Instructions](#setup-instructions)
2. [Test Scenarios](#test-scenarios)
3. [Admin Testing](#admin-testing)
4. [Student Testing](#student-testing)
5. [Verification Checklist](#verification-checklist)
6. [Troubleshooting](#troubleshooting)

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL/MariaDB server running
- Git repository cloned

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 3: Configure Environment Variables

**Backend** (create `.env` in backend folder):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sfs
JWT_SECRET=your_secret_key
```

**Frontend** (create `.env` in frontend folder):
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Step 4: Initialize Database
```bash
# Make sure MySQL is running
# The backend will auto-create tables on first run

cd backend
npm run dev
```

### Step 5: Start Backend Server
```bash
cd backend
npm run dev
# Server should run on http://localhost:5000
```

### Step 6: Start Frontend Development Server
```bash
cd frontend
npm run dev
# Frontend should run on http://localhost:5174
```

---

## Test Scenarios

### Scenario 1: User Registration and Login

#### Step 1: Register New Student
1. Open http://localhost:5174
2. Click "Register" or navigate to `/register`
3. Fill in form:
   - Email: student@example.com
   - Name: Test Student
   - Password: password123
4. Click "Register"
5. **Expected**: Account created, redirected to search page or login

#### Step 2: Login with New Account
1. Go to `/login`
2. Enter credentials:
   - Email: student@example.com
   - Password: password123
3. Click "Login"
4. **Expected**: Logged in successfully, redirected to dashboard or search page

#### Step 3: Verify Admin Login
1. Go to `/login`
2. Enter admin credentials:
   - Email: admin@bisu.edu.ph
   - Password: admin123
3. Click "Login"
4. **Expected**: Redirected to `/admin/dashboard`

---

### Scenario 2: Browse and Search Scholarships

#### Step 1: View Landing Page
1. Open http://localhost:5174 (not logged in)
2. **Expected**: 
   - Featured Scholarships section visible
   - Shows top 3 scholarships
   - "View All" button present

#### Step 2: Search Scholarships
1. Click "Search Scholarships" in navbar
2. Browse scholarship list
3. **Expected**: 
   - Cards display properly without overflow
   - "Details" and "Apply" buttons visible
   - Search/filter functionality works
   - Mobile layout responsive

#### Step 3: View Matched Scholarships (Logged-In Student)
1. Register and login as student
2. Go to landing page `/`
3. **Expected**: 
   - Shows "Matched Scholarships" section
   - Filtered by student's GWA and course
   - If no matches, shows featured scholarships

---

### Scenario 3: Apply to Scholarship

#### Step 1: Initiate Application
1. Login as student
2. Search for a scholarship
3. Click "Apply" button
4. **Expected**: Redirected to `/apply/:id`

#### Step 2: Fill Application Form

**Step 1 - Personal Statement**:
1. Enter personal statement in textarea
2. Click "Continue to Review"
3. **Expected**: Moves to Step 2

**Step 2 - Review**:
1. Verify information displayed correctly
2. Check "I certify that my information is accurate" checkbox
3. **Note**: Documents section shows "Documents Temporarily Disabled" alert
4. Click "Submit Application"
5. **Expected**: 
   - Success message appears
   - Success screen displays
   - Application saved to database

#### Step 3: Verify Application Submitted
1. Go to "My Applications" page
2. **Expected**: 
   - New application appears in list
   - Status shows "Pending"
   - Can see scholarship details

---

### Scenario 4: Application Withdrawal

#### Step 1: Withdraw Application
1. Login as student who has pending applications
2. Go to "My Applications" page
3. Find a "Pending" application
4. Click "Withdraw" button
5. Confirm withdrawal when prompted
6. **Expected**:
   - Application removed from list
   - API call successful
   - Database updated

#### Step 2: Verify Withdrawal
1. Refresh page
2. **Expected**: Application still removed (not temporarily cached)

---

### Scenario 5: Notifications System

#### Test 5A: Receive Notification on Approval
1. Login as admin
2. Go to Admin Dashboard
3. Find pending application
4. Click "Approve" button
5. **Expected**:
   - Success message appears
   - Notification created in database
   - Student receives notification

#### Test 5B: View Notifications (Student)
1. Login as student who received notification
2. Click bell icon in navbar
3. Or go to `/notifications`
4. **Expected**:
   - Notifications list displayed
   - Title: "Application Approved"
   - Message includes scholarship name
   - Blue background for unread (white for read)
   - Unread count accurate

#### Test 5C: Mark Notification as Read
1. On notifications page
2. Note unread count (blue notifications)
3. Click on unread notification
4. **Expected**:
   - Changes to white background
   - Unread count decreases
   - Database updated

#### Test 5D: Mark All as Read
1. On notifications page with unread notifications
2. Click "Mark all as read" button
3. **Expected**:
   - All notifications turn white
   - Unread count shows "You're all caught up!"
   - Persists after page refresh

#### Test 5E: Delete Notification
1. Hover over notification
2. Click delete/trash icon
3. **Expected**:
   - Notification removed from list
   - Database updated

---

## Admin Testing

### Admin Dashboard Testing

#### Step 1: Access Admin Dashboard
1. Login with admin@bisu.edu.ph / admin123
2. **Expected**: Redirected to `/admin/dashboard`

#### Step 2: View Scholarships
1. Dashboard shows list of all scholarships
2. Each scholarship shows:
   - Name
   - Amount
   - GWA Requirement
   - Applicants count
   - Action buttons
3. **Expected**: All scholarships displayed correctly

#### Step 3: Create Scholarship
1. Click "Create Scholarship" or "+" button
2. Fill form:
   - Name: Test Scholarship
   - Description: Test Description
   - Amount: 10000
   - Minimum GWA: 3.0
   - Eligible Courses: Computer Science
   - Year Levels: Select 1st Year, 2nd Year
3. Click "Save"
4. **Expected**:
   - Success message
   - New scholarship appears in list
   - GWA Requirement auto-filled with 3.0
   - Year levels saved

#### Step 4: Edit Scholarship
1. Click scholarship in list
2. Click "Edit" or edit icon
3. Modify fields
4. Click "Save"
5. **Expected**: Changes persisted in database

#### Step 5: Manage Applications
1. Click on scholarship
2. View "Applicants" section
3. **Expected**: List of applicants with:
   - Student name/email
   - Application status (Pending/Approved/Rejected)
   - Action buttons for Pending applications

#### Step 6: Approve Application
1. Find pending application
2. Click "Approve" button
3. **Expected**:
   - Status changes to "Approved"
   - Green button color
   - Notification created for student

#### Step 7: Reject Application
1. Find pending application
2. Click "Reject" button
3. **Expected**:
   - Status changes to "Rejected"
   - Red button color
   - Notification created for student

#### Step 8: Delete Scholarship
1. Click on scholarship
2. Click "Delete" button
3. Confirm deletion
4. **Expected**:
   - Scholarship removed from list
   - All associated applications handled

---

## Student Testing

### Student Profile Testing

#### Step 1: Update Profile
1. Login as student
2. Go to Profile page
3. Update information:
   - Full Name
   - Gender
   - Address
   - School
   - Course
   - Year Level
   - GWA
   - Financial Status
4. Click "Save"
5. **Expected**: Profile updated successfully

#### Step 2: Upload Profile Photo
1. On profile page
2. Click profile photo area
3. Select image file
4. **Expected**: Photo uploaded and displayed

---

## Verification Checklist

### Code Quality
- [ ] TypeScript compilation: NO ERRORS
- [ ] ESLint validation: NO WARNINGS
- [ ] Frontend build: SUCCESS
- [ ] Backend build: SUCCESS

### Feature Implementation
- [ ] Admin dashboard accessible
- [ ] Admin can create scholarships
- [ ] Admin can edit scholarships
- [ ] Admin can delete scholarships
- [ ] Admin can approve applications
- [ ] Admin can reject applications
- [ ] Students can apply (without documents)
- [ ] Students can withdraw applications
- [ ] Notifications auto-created on approval/rejection
- [ ] Notifications persist in database
- [ ] Matched scholarships show for logged-in students
- [ ] GWA requirement auto-populates
- [ ] Year level checkboxes working
- [ ] Application submission works without documents

### UI/UX
- [ ] Scholarship cards display without overflow
- [ ] Buttons properly sized and positioned
- [ ] Mobile layout responsive
- [ ] Navigation working correctly
- [ ] Admin navbar shows correct options
- [ ] Student navbar shows correct options
- [ ] Notifications display properly
- [ ] Toast messages appear correctly
- [ ] Form validation working
- [ ] Error messages clear

### Database
- [ ] Tables created successfully
- [ ] Data persists after refresh
- [ ] Notifications stored correctly
- [ ] Applications stored correctly
- [ ] Role column functioning
- [ ] Admin user created

### API
- [ ] All endpoints responding
- [ ] CORS configured correctly
- [ ] Authentication working
- [ ] Authorization working
- [ ] Error handling working

---

## Troubleshooting

### Issue: Cannot Connect to Backend
**Solution**:
```bash
# Check if backend is running
lsof -i :5000  # On Mac/Linux
netstat -ano | findstr :5000  # On Windows

# If port in use, kill the process
# Then restart backend
cd backend && npm run dev
```

### Issue: Database Connection Error
**Solution**:
1. Verify MySQL is running
2. Check connection string in `.env`
3. Verify database exists
4. Restart backend server

### Issue: CORS Error
**Solution**:
- Check `backend/src/server.ts` has correct ports
- Should include: `http://localhost:5173` and `http://localhost:5174`

### Issue: Frontend Not Updating Changes
**Solution**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite
rm -rf dist

# Restart dev server
npm run dev
```

### Issue: Admin Dashboard Not Loading
**Solution**:
1. Verify logged in as admin
2. Check browser console for errors
3. Verify database has scholarships
4. Check API endpoints in network tab

### Issue: Applications Not Submitting
**Solution**:
1. Verify personal statement is filled
2. Check certification checkbox is checked
3. Check browser console for errors
4. Verify FormData being sent correctly

### Issue: Notifications Not Appearing
**Solution**:
1. Verify notifications exist in database
2. Check StudentID matches logged-in user
3. Verify API endpoint working
4. Check browser console for errors

---

## Performance Notes

### Recommended Hardware
- RAM: 4GB minimum
- Disk: 100MB free space
- Connection: Broadband internet (for Google OAuth)

### Database Optimization
- Ensure proper indexes on StudentID, ScholarshipID
- Regular backups recommended
- Monitor query performance

### Frontend Performance
- Clear cache if experiencing slowness
- Update dependencies regularly
- Use production build for deployment

