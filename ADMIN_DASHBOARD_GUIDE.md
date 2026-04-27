# Admin Dashboard - Scholarships Not Showing

## Issue
You're logged in as admin but don't see any scholarships on the admin dashboard.

## Reason
There are **no scholarships in the database yet**. The dashboard is working correctly - it's just that no scholarships have been created.

## Solution

### How to Add Scholarships (2 options)

#### Option 1: Create via Admin Dashboard (Recommended)
1. Login as admin (admin@bisu.edu.ph / admin123)
2. Go to **Admin Dashboard**
3. Click **+ New Scholarship** button
4. Fill in the scholarship details:
   - **Scholarship Name**: e.g., "BISU Merit Scholarship"
   - **Provider**: e.g., "BISU Foundation"
   - **Type**: Choose from Merit, Need-based, Athletic, Government, Private
   - **Description**: Brief description of the scholarship
   - **Amount**: e.g., "₱50,000" or "Full Tuition"
   - **Slots**: Number of slots available (e.g., 10)
   - **GWA Requirement**: e.g., 2.5
   - **Deadline**: Select a date
   - **Application Method**: e.g., "Online Form"
   - **Google Form Link**: If applicable
   - **Provider Contact**: Email or phone
5. Click **Save**
6. The scholarship will appear on the dashboard and be visible to students

#### Option 2: Add via SQL (Direct Database)
Run this SQL query in your Railway MySQL database:

```sql
INSERT INTO scholarship (
  ScholarshipName, 
  Provider, 
  Type, 
  Description, 
  Amount, 
  Slots, 
  GWARequirement, 
  Deadline, 
  ApplicationMethod, 
  GoogleFormLink, 
  ProviderContact
) VALUES (
  'BISU Merit Scholarship',
  'BISU Foundation',
  'Merit',
  'For students with excellent academic performance',
  '₱50,000',
  10,
  2.5,
  '2026-12-31',
  'Online Form',
  'https://forms.google.com/...',
  'scholarships@bisu.edu.ph'
);
```

## Troubleshooting

If scholarships still don't show after creating them:

1. **Check browser console (F12)**:
   - Look for error messages
   - Check if API_URL is correct
   - See if fetch request is failing

2. **Check Railway logs**:
   - Go to Railway → Backend → Logs
   - Look for any database errors

3. **Verify connection**:
   - Test: `curl https://your-railway-url/api/health`
   - Should return: `{"status":"Server is running"}`

4. **Clear cache and refresh**:
   - Hard refresh: Ctrl+Shift+Delete (clear cache)
   - Then Ctrl+F5 (hard refresh page)

## How Students See Scholarships

Once you add scholarships as admin:
- Students can see them on the **Search page**
- They can filter by Type, GWA requirement, Course
- They can add to **Favorites**
- They can click **Apply** to submit an application

## Admin Can Also:
- **Edit** scholarships: Click the Edit button
- **Delete** scholarships: Click the Trash icon
- **View Applicants**: Click on a scholarship to see who applied
- **Approve/Reject** applications
