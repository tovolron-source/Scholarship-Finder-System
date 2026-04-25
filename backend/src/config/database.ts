import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Initialize database tables on startup
async function initializeTables() {
  try {
    const connection = await pool.getConnection();
    console.log('📊 Initializing database tables...');

    // Create users table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        FullName VARCHAR(255),
        Email VARCHAR(255) UNIQUE NOT NULL,
        Password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'student') DEFAULT 'student',
        RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Users table ready');

    // Create student_profile table if it doesn't exist
    await connection.query(`
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
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Student Profile table ready');

    // Create scholarship table if it doesn't exist
    await connection.query(`
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
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Scholarship table ready');

    // Create favorites table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS favorite (
        FavoriteID INT AUTO_INCREMENT PRIMARY KEY,
        StudentID INT NOT NULL,
        ScholarshipID INT NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_student_scholarship (StudentID, ScholarshipID),
        FOREIGN KEY (StudentID) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (ScholarshipID) REFERENCES scholarship(ScholarshipID) ON DELETE CASCADE
      )
    `);

    console.log('✅ Favorite table ready');

    // Create applications table if it doesn't exist
    await connection.query(`
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
        FOREIGN KEY (ScholarshipID) REFERENCES scholarship(ScholarshipID) ON DELETE CASCADE
      )
    `);

    console.log('✅ Application table ready');

    // Create notifications table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notification (
        NotificationID INT AUTO_INCREMENT PRIMARY KEY,
        StudentID INT NOT NULL,
        Type ENUM('deadline', 'status', 'new_scholarship', 'application', 'general') DEFAULT 'general',
        Title VARCHAR(255) NOT NULL,
        Message LONGTEXT NOT NULL,
        ScholarshipID INT,
        ApplicationID INT,
        IsRead BOOLEAN DEFAULT FALSE,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (StudentID) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (ScholarshipID) REFERENCES scholarship(ScholarshipID) ON DELETE SET NULL,
        FOREIGN KEY (ApplicationID) REFERENCES application(ApplicationID) ON DELETE SET NULL,
        KEY idx_student_id (StudentID),
        KEY idx_type (Type),
        KEY idx_is_read (IsRead),
        KEY idx_created_at (CreatedAt)
      )
    `);

    console.log('✅ Notification table ready');
    connection.release();
  } catch (error) {
    console.error('❌ Error initializing tables:', error);
    throw error;
  }
}

// Initialize on import
initializeTables().catch(err => {
  console.error('❌ Failed to initialize database:', err.message);
  process.exit(1);
});

export default pool;
