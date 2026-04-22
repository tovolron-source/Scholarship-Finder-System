# Complete Testing Guide - Scholarship Finder System
**Date**: April 22, 2026

## 🎯 Overview of All Fixes

### 1. ✅ Landing Page - Matched Scholarships
- Logged-in students see "Matched Scholarships" filtered by their GWA and course
- Non-logged-in users see "Featured Scholarships" (first 3)
- Admin users see "Featured Scholarships" (since they don't apply)

### 2. ✅ Admin Dashboard - Applicant Management
- Fixed API endpoints for viewing, approving, and rejecting applications
- Admin can now properly manage applications for each scholarship

### 3. ✅ Notifications - Database Integration
- Notifications now persist in database
- Enhanced error logging for easier troubleshooting
- Read status syncs across sessions

### 4. ✅ File Uploads - Application Documents
- Transcript, ID document, and recommendation letter now properly sent to backend
- Files saved to `/uploads` directory with unique names
- File paths stored in database

---

## 🧪 TESTING PROCEDURE

### TEST 1: Landing Page Matching (Required: 2 Accounts)

**Setup Account 1 (Student)**:
1. Register new account as student
2. Complete profile with:
   - GWA: 3.5
   - Course: Computer Science
3. Log out

**Setup Account 2 (Admin)**:
1. Create admin account (direct database insert or admin registration)
2. Create 2-3 scholarships with different GWA requirements
3. Example:
   - Scholarship A: GWA Requirement 3.0, Eligible Courses: All
   - Scholarship B: GWA Requirement 4.0, Eligible Courses: Computer Science
   - Scholarship C: GWA Requirement 3.8, Eligible Courses: Engineering
4. Log out

**Test Matched Scholarships**:
1. Log in as Student (Account 1)
2. Go to home/landing page
3. Verify heading says "Matched Scholarships"
4. Verify subtitle mentions "tailored to your academic profile"
5. Should see Scholarship A and B (match GWA 3.5)
6. Should NOT see Scholarship C (only for Engineering)

**Test Featured (Non-Logged In)**:
1. Log out completely
2. Go to home/landing page
3. Verify heading says "Featured Scholarships"
4. Verify subtitle says "handpicked for students"
5. Should see first 3 scholarships

**Test Featured (Admin)**:
1. Log in as Admin
2. Go to home/landing page
3. Verify heading says "Featured Scholarships"
4. Should see first 3 scholarships regardless of GWA/course

✅ **PASS if**:
- [ ] Logged-in students see "Matched Scholarships"
- [ ] Matched scholarships filter by GWA and course
- [ ] Non-logged-in users see "Featured Scholarships"
- [ ] Admin users see "Featured Scholarships"

---

### TEST 2: Admin Dashboard - Applicant Management

**Setup**:
1. Log in as Admin
2. Create a new scholarship called "Test Admin Scholarship"
3. Log out

**Apply as Student**:
1. Log in as Student
2. Search for "Test Admin Scholarship"
3. Click "Apply" button
4. Complete application:
   - Personal Statement: "I am applying because..." (at least 50 characters)
   - Upload Transcript: Select any PDF file
   - Upload ID: Select any PNG/JPG file
   - Upload Recommendation: Select any PDF file
   - Check certification checkbox
   - Click Submit
5. Verify success message
6. Log out

**View in Admin Dashboard**:
1. Log in as Admin
2. Go to Admin Dashboard
3. Find and click on "Test Admin Scholarship"
4. **CRITICAL**: Should see the student's application in the applicants list
5. Verify applicant name, email, status (Pending)
6. Click "Approve" or "Reject" button
7. Verify status changes in the list

✅ **PASS if**:
- [ ] Can see applicant in admin dashboard
- [ ] Applicant name and email display correctly
- [ ] Initial status is "Pending"
- [ ] Approve/Reject buttons work
- [ ] Status updates in real-time

---

### TEST 3: File Uploads - Database Verification

**Verify Files Are Saved**:
1. After applying (from TEST 2):
2. Open browser developer tools (F12)
3. Go to Console tab
4. Files should have been uploaded without errors
5. Check file system:
   - Navigate to: `backend/uploads/`
   - Should see 3 files with timestamps in names
   - Example: `1713868432123-transcript.pdf`

**Verify Database Records**:
1. Log in to MySQL/database tool
2. Query: `SELECT * FROM application ORDER BY ApplicationID DESC LIMIT 1;`
3. Verify columns contain:
   - `PersonalStatement`: Your statement text (NOT a link)
   - `TranscriptPath`: `/uploads/[filename]` or similar
   - `IDDocumentPath`: `/uploads/[filename]` or similar
   - `RecommendationPath`: `/uploads/[filename]` or similar
4. All paths should be strings, NOT null

✅ **PASS if**:
- [ ] Files appear in backend/uploads/ directory
- [ ] Database shows file paths (not null)
- [ ] PersonalStatement contains text, not a link
- [ ] All 3 file paths are populated

---

### TEST 4: Notifications - Persistence

**Create Notifications**:
1. As Admin, create a new scholarship
2. As Student, apply to it
3. Create a status change (Admin approves application)
4. This should trigger a notification

**Test Read Persistence**:
1. Log in as Student
2. Go to Notifications page
3. Should see notification(s)
4. Verify unread count shows
5. Click on a notification (blue background)
6. Should turn white/gray (marked as read)
7. Unread count should decrease
8. **CRITICAL**: Refresh page (F5)
9. Notification should STILL be white/marked as read
10. Unread count should remain decreased
11. Close browser, reopen
12. Go to Notifications again
13. Notification should STILL be marked as read

**Test Mark All As Read**:
1. If you have multiple unread notifications
2. Click "Mark All As Read" button
3. All should turn white
4. Unread count shows "You're all caught up!"
5. Refresh page
6. Should still show "all caught up"

✅ **PASS if**:
- [ ] Notifications load without "Failed to load" error
- [ ] Can mark notification as read
- [ ] Read status persists after refresh
- [ ] Read status persists after browser close/reopen
- [ ] "Mark all as read" works correctly

---

### TEST 5: Search Page - Example Scholarship

**Create Example Scholarship**:
1. Log in as Admin
2. Create new scholarship:
   - Name: "Example Scholarship Test"
   - Provider: "Test Provider"
   - Type: Merit
   - GWA Requirement: 3.0
   - Deadline: Future date (e.g., 2025-12-31)
   - Slots: 5
   - Amount: "₱50,000"
3. Save scholarship

**Search for It**:
1. Log in as Student
2. Go to Search page
3. Search for "Example Scholarship"
4. **SHOULD SEE** the scholarship in results
5. Click on it to view details
6. Click "Apply" button
7. Should navigate to apply page

✅ **PASS if**:
- [ ] Example scholarship appears in search results
- [ ] Scholarship details display correctly
- [ ] Apply button works

---

## 🔍 Error Checking

**Open Developer Console** (F12):
1. Go to each page
2. Check Console tab for errors
3. Should see NO red errors
4. Info messages are OK (blue icons)

**Check Network Tab**:
1. Open Network tab (F12)
2. Go to Notifications page
3. Look for request to: `http://localhost:5000/api/notifications/student/[ID]`
4. Verify it returns 200 status
5. Response should have `data` array with notifications

---

## 📋 Quick Checklist

- [ ] Frontend builds without errors
- [ ] Backend builds without errors
- [ ] Landing page shows correct heading based on login status
- [ ] Admin can see applicants in dashboard
- [ ] File uploads save to database
- [ ] Notifications persist across page reloads
- [ ] Search shows new scholarships immediately
- [ ] Console has no critical errors

---

## 🚀 FINAL VERIFICATION

Run these commands in terminals to confirm everything is ready:

**Frontend**:
```bash
cd frontend
npm run build
npm run lint
```
Expected: No errors, only warnings about chunk size

**Backend**:
```bash
cd backend
npm run build
```
Expected: No TypeScript errors, successful compilation

---

## 💡 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to load notifications" | Check console for studentId, verify user is logged in |
| Applicants not showing | Verify scholarship exists, refresh page, check admin token |
| Files showing as null | Clear browser cache, reapply with fresh files |
| Matched scholarships not filtering | Check student profile has GWA/Course set |
| Search not showing new scholarship | Refresh page, verify scholarship created in database |

---

## 📞 Next Steps If Issues Found

1. Check browser console for specific error messages
2. Check backend console logs (look for ✅ and ❌ indicators)
3. Verify student profile is complete (GWA, Course)
4. Verify database connectivity (run `/api/db-test` endpoint)
5. Check uploads folder exists with proper permissions

---

**Testing Date**: _________________
**Tester Name**: _________________
**All Tests Passed**: ☐ Yes ☐ No
**Issues Found**: _________________

