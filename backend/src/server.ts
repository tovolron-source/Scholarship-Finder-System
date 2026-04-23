import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import authRoutes from './routes/auth';
import scholarshipRoutes from './routes/scholarships';
import favoriteRoutes from './routes/favorites';
import adminRoutes from './routes/admin';
import applicationsRoutes from './routes/applications';
import notificationRoutes from './routes/notifications';
import pool from './config/database';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Export upload middleware for use in routes
export { upload };

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Database test
app.get('/api/db-test', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('SELECT 1');
    connection.release();
    res.json({ 
      success: true, 
      message: 'Database connected successfully',
      database: process.env.DB_NAME,
      host: process.env.DB_HOST
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Database connection failed',
      database: process.env.DB_NAME,
      host: process.env.DB_HOST
    });
  }
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`CORS enabled for http://localhost:5173`);
  console.log(`Database: ${process.env.DB_NAME}`);
  console.log(`Database Host: ${process.env.DB_HOST}`);
});
