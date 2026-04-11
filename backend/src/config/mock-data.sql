-- Insert Mock Scholarship Data
-- This file contains SQL INSERT statements for the scholarship table

-- DOST Science & Technology Scholarship
INSERT INTO scholarship (
  ScholarshipName,
  Provider,
  Type,
  Description,
  Benefits,
  Amount,
  Slots,
  GPARequirement,
  Deadline,
  ApplicationMethod,
  GoogleFormLink,
  ProviderContact,
  EligibilityRequirements,
  ApplicationProcess
) VALUES (
  'DOST Science & Technology Scholarship',
  'Department of Science and Technology',
  'Government',
  'Full scholarship program for STEM students with strong academic performance and commitment to serving the country after graduation.',
  '["Full tuition fee coverage", "Monthly living allowance", "Book allowance", "Thesis/Research grant"]',
  '$5,000/year',
  50,
  3.0,
  '2026-04-30',
  'Online Application',
  'https://forms.google.com/dost-scholarship',
  'scholarships@dost.gov',
  '{"gpa": 3.0, "courses": ["BS Computer Science", "BS Engineering", "BS Physics", "BS Chemistry", "BS Biology"], "yearLevel": ["1st Year", "2nd Year", "3rd Year", "4th Year"], "financialStatus": ["Low Income", "Middle Income"]}',
  '["Submit online application form", "Upload required documents (transcript, ID, recommendation letter)", "Take entrance examination", "Attend interview if shortlisted"]'
);

-- Google Excellence Scholarship
INSERT INTO scholarship (
  ScholarshipName,
  Provider,
  Type,
  Description,
  Benefits,
  Amount,
  Slots,
  GPARequirement,
  Deadline,
  ApplicationMethod,
  GoogleFormLink,
  ProviderContact,
  EligibilityRequirements,
  ApplicationProcess
) VALUES (
  'Google Excellence Scholarship',
  'Google Inc.',
  'Private',
  'Scholarship for exceptional students pursuing careers in technology with demonstrated leadership and community involvement.',
  '["One-time grant of $10,000", "Mentorship from Google engineers", "Internship opportunity", "Access to Google developer resources"]',
  '$10,000',
  20,
  3.5,
  '2026-05-15',
  'Online Application',
  'https://forms.google.com/google-excellence',
  'scholarships@google.com',
  '{"gpa": 3.5, "courses": ["BS Computer Science", "BS Information Technology", "BS Software Engineering"], "yearLevel": ["3rd Year", "4th Year"]}',
  '["Complete online application", "Submit essay on technology and society", "Provide two letters of recommendation", "Participate in video interview"]'
);

-- Academic Merit Award
INSERT INTO scholarship (
  ScholarshipName,
  Provider,
  Type,
  Description,
  Benefits,
  Amount,
  Slots,
  GPARequirement,
  Deadline,
  ApplicationMethod,
  GoogleFormLink,
  ProviderContact,
  EligibilityRequirements,
  ApplicationProcess
) VALUES (
  'Academic Merit Award',
  'State University Foundation',
  'Merit',
  'Merit-based scholarship for high-achieving students across all disciplines.',
  '["Tuition reduction of $3,000 per semester", "Priority course registration", "Access to honors lounge"]',
  '$3,000/semester',
  100,
  3.8,
  '2026-03-31',
  'University Portal',
  'https://forms.google.com/merit-award',
  'foundation@stateuniversity.edu',
  '{"gpa": 3.8, "courses": ["All Programs"], "yearLevel": ["2nd Year", "3rd Year", "4th Year"]}',
  '["Submit application through university portal", "No additional documents required (automatic review based on grades)"]'
);

-- Future Engineers Scholarship
INSERT INTO scholarship (
  ScholarshipName,
  Provider,
  Type,
  Description,
  Benefits,
  Amount,
  Slots,
  GPARequirement,
  Deadline,
  ApplicationMethod,
  GoogleFormLink,
  ProviderContact,
  EligibilityRequirements,
  ApplicationProcess
) VALUES (
  'Future Engineers Scholarship',
  'Engineering Society of America',
  'Merit',
  'Supporting the next generation of engineers through financial assistance and professional development.',
  '["Annual grant of $4,500", "Conference attendance sponsorship", "Professional networking events"]',
  '$4,500',
  30,
  3.2,
  '2026-06-01',
  'Online Application',
  'https://forms.google.com/future-engineers',
  'scholarships@esa.org',
  '{"gpa": 3.2, "courses": ["BS Engineering", "BS Computer Engineering", "BS Electrical Engineering"], "yearLevel": ["2nd Year", "3rd Year", "4th Year"]}',
  '["Fill out application form", "Submit project portfolio", "Provide faculty recommendation"]'
);

-- Community Champions Grant
INSERT INTO scholarship (
  ScholarshipName,
  Provider,
  Type,
  Description,
  Benefits,
  Amount,
  Slots,
  GPARequirement,
  Deadline,
  ApplicationMethod,
  GoogleFormLink,
  ProviderContact,
  EligibilityRequirements,
  ApplicationProcess
) VALUES (
  'Community Champions Grant',
  'National Youth Foundation',
  'Need-based',
  'Financial support for students who demonstrate commitment to community service and leadership.',
  '["$2,500 annual grant", "Leadership training workshops", "Community project funding"]',
  '$2,500',
  75,
  2.5,
  '2026-04-15',
  'Online Application',
  'https://forms.google.com/community-champions',
  'grants@nyf.org',
  '{"gpa": 2.5, "courses": ["All Programs"], "yearLevel": ["1st Year", "2nd Year", "3rd Year", "4th Year"], "financialStatus": ["Low Income"]}',
  '["Complete application form", "Submit community service documentation", "Write essay on leadership experience"]'
);

-- Women in STEM Scholarship
INSERT INTO scholarship (
  ScholarshipName,
  Provider,
  Type,
  Description,
  Benefits,
  Amount,
  Slots,
  GPARequirement,
  Deadline,
  ApplicationMethod,
  GoogleFormLink,
  ProviderContact,
  EligibilityRequirements,
  ApplicationProcess
) VALUES (
  'Women in STEM Scholarship',
  'Tech Women Network',
  'Merit',
  'Empowering women pursuing careers in science, technology, engineering, and mathematics.',
  '["Annual scholarship of $6,000", "Mentorship program", "Industry networking events", "Career development workshops"]',
  '$6,000',
  25,
  3.3,
  '2026-05-30',
  'Online Application',
  'https://forms.google.com/women-stem',
  'scholarships@techwomen.org',
  '{"gpa": 3.3, "courses": ["BS Computer Science", "BS Engineering", "BS Mathematics", "BS Physics"], "yearLevel": ["1st Year", "2nd Year", "3rd Year", "4th Year"]}',
  '["Online application submission", "Personal statement on STEM goals", "Faculty recommendation letter"]'
);

-- Verify inserts
SELECT COUNT(*) as total_scholarships FROM scholarship;
SELECT * FROM scholarship;
