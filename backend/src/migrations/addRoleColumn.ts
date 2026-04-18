import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
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

  try {
    const connection = await pool.getConnection();
    console.log('🔄 Running migration: Add role column to user table...');

    // Check if role column already exists
    const [columns]: any = await connection.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'user' AND COLUMN_NAME = 'role'"
    );

    if (columns.length === 0) {
      // Add role column
      await connection.query(
        "ALTER TABLE user ADD COLUMN role ENUM('admin', 'student') NOT NULL DEFAULT 'student' AFTER RegistrationDate"
      );
      console.log('✅ Added role column to user table');
    } else {
      console.log('⚠️ Role column already exists');
    }

    // Check if admin user exists (ID = 1)
    const [adminUser]: any = await connection.query('SELECT * FROM user WHERE id = 1');

    if (adminUser.length === 0) {
      // Hash the password for admin@bisu.edu.ph with password admin123
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Insert admin user
      await connection.query(
        'INSERT INTO user (id, Name, Email, Password, RegistrationDate, role) VALUES (1, ?, ?, ?, NOW(), ?)',
        ['Admin', 'admin@bisu.edu.ph', hashedPassword, 'admin']
      );
      console.log('✅ Created admin user (ID: 1, Email: admin@bisu.edu.ph, Password: admin123)');
    } else {
      // Update existing admin user to have admin role
      await connection.query('UPDATE user SET role = ? WHERE id = 1', ['admin']);
      console.log('✅ Updated user ID 1 to have admin role');
    }

    // Update all other users to have student role
    await connection.query("UPDATE user SET role = 'student' WHERE id != 1");
    console.log('✅ Updated all other users to have student role');

    await connection.release();
    await pool.end();
    console.log('✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
