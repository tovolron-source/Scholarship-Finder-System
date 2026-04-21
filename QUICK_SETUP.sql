CREATE DATABASE IF NOT EXISTS scholarship_finder;
USE scholarship_finder;

CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(255) NOT NULL,
  FullName VARCHAR(255),
  Email VARCHAR(255) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student') DEFAULT 'student',
  RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (Email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL UNIQUE,
  fullName VARCHAR(255),
  gender VARCHAR(50),
  address VARCHAR(500),
  school VARCHAR(255),
  course VARCHAR(255),
  yearLevel VARCHAR(50),
  gwa DECIMAL(3,2),
  financialStatus VARCHAR(50),
  contactNumber VARCHAR(20),
  profilePhoto VARCHAR(500),
  profileCompletion INT DEFAULT 20,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_gwa (gwa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS scholarship (
  ScholarshipID INT AUTO_INCREMENT PRIMARY KEY,
  ScholarshipName VARCHAR(255) NOT NULL,
  Provider VARCHAR(255) NOT NULL,
  Type ENUM('Merit', 'Need-based', 'Athletic', 'Government', 'Private') NOT NULL,
  Description LONGTEXT,
  Benefits JSON,
  Amount VARCHAR(100),
  Slots INT DEFAULT 0,
  GWARequirement DECIMAL(3,2) DEFAULT 0.0,
  Deadline DATE,
  ApplicationMethod VARCHAR(255),
  GoogleFormLink VARCHAR(500),
  ProviderContact VARCHAR(255),
  EligibilityRequirements JSON,
  ApplicationProcess JSON,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_scholarship_name (ScholarshipName),
  INDEX idx_deadline (Deadline),
  INDEX idx_gwa_requirement (GWARequirement),
  INDEX idx_type (Type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS favorite (
  FavoriteID INT AUTO_INCREMENT PRIMARY KEY,
  StudentID INT NOT NULL,
  ScholarshipID INT NOT NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_student_scholarship (StudentID, ScholarshipID),
  FOREIGN KEY (StudentID) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (ScholarshipID) REFERENCES scholarship(ScholarshipID) ON DELETE CASCADE,
  INDEX idx_student_id (StudentID),
  INDEX idx_scholarship_id (ScholarshipID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS application (
  ApplicationID INT AUTO_INCREMENT PRIMARY KEY,
  StudentID INT NOT NULL,
  ScholarshipID INT NOT NULL,
  Status ENUM('Pending', 'Under Review', 'Approved', 'Rejected') DEFAULT 'Pending',
  PersonalStatement LONGTEXT,
  TranscriptPath VARCHAR(500),
  IDDocumentPath VARCHAR(500),
  RecommendationPath VARCHAR(500),
  DateApplied TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_student_scholarship_app (StudentID, ScholarshipID),
  FOREIGN KEY (StudentID) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (ScholarshipID) REFERENCES scholarship(ScholarshipID) ON DELETE CASCADE,
  INDEX idx_student_id (StudentID),
  INDEX idx_scholarship_id (ScholarshipID),
  INDEX idx_status (Status),
  INDEX idx_date_applied (DateApplied)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE user ADD COLUMN role ENUM('admin', 'student') DEFAULT 'student';

SHOW TABLES;
