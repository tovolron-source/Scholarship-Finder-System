"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = __importDefault(require("./routes/auth"));
const scholarships_1 = __importDefault(require("./routes/scholarships"));
const favorites_1 = __importDefault(require("./routes/favorites"));
const admin_1 = __importDefault(require("./routes/admin"));
const applications_1 = __importDefault(require("./routes/applications"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const database_1 = __importDefault(require("./config/database"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'));
        }
    }
});
exports.upload = upload;
// Serve static files from uploads directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/scholarships', scholarships_1.default);
app.use('/api/favorites', favorites_1.default);
app.use('/api/applications', applications_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/admin', admin_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});
// Database test
app.get('/api/db-test', async (req, res) => {
    try {
        const connection = await database_1.default.getConnection();
        const [result] = await connection.query('SELECT 1');
        connection.release();
        res.json({
            success: true,
            message: 'Database connected successfully',
            database: process.env.DB_NAME,
            host: process.env.DB_HOST
        });
    }
    catch (error) {
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
app.use((err, req, res, next) => {
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
//# sourceMappingURL=server.js.map