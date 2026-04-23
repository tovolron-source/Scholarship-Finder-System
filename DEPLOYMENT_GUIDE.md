# Deployment Guide
**Last Updated**: April 23, 2026

---

## Quick Start for Development

### Prerequisites
- Node.js v14+ installed
- MySQL/MariaDB server running
- Git repository cloned

### Step 1: Backend Setup
```bash
cd backend
npm install
```

**Create `.env` file**:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sfs
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

**Run Backend**:
```bash
npm run dev
```

Expected output:
```
Server running on http://localhost:5000
CORS enabled for http://localhost:5173
Database: sfs
✅ Users table ready
✅ Scholarship table ready
...
```

### Step 2: Frontend Setup
```bash
cd frontend
npm install
```

**Create `.env` file**:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Run Frontend**:
```bash
npm run dev
```

Expected output:
```
VITE v4.x.x ready in xxx ms
➜  Local:   http://localhost:5174/
```

### Step 3: Access Application
- Open browser to `http://localhost:5174`
- Test login with admin account:
  - Email: admin@bisu.edu.ph
  - Password: admin123

---

## Production Deployment

### Backend Deployment

#### Option 1: Traditional Hosting (VPS/Dedicated Server)

**Prerequisites**:
- Ubuntu 20.04+ server
- Node.js v14+ installed
- MySQL server running
- Nginx or Apache

**Steps**:

1. **SSH into Server**:
```bash
ssh user@your_server_ip
```

2. **Clone Repository**:
```bash
git clone <your_repo_url>
cd Scholarship-Finder-System/backend
```

3. **Install Dependencies**:
```bash
npm install
```

4. **Build Project**:
```bash
npm run build
```

5. **Create `.env` for Production**:
```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_secure_password
DB_NAME=sfs
JWT_SECRET=your_very_secure_secret_key
PORT=5000
NODE_ENV=production
```

6. **Use PM2 for Process Management**:
```bash
npm install -g pm2
pm2 start npm --name "sfs-backend" -- start
pm2 startup
pm2 save
```

7. **Configure Nginx**:
```bash
sudo nano /etc/nginx/sites-available/sfs-backend
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your_backend_domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/sfs-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. **Setup SSL (HTTPS)**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your_backend_domain.com
```

#### Option 2: Cloud Deployment (AWS, Google Cloud, Azure)

**AWS EC2 Example**:
1. Launch EC2 instance (Ubuntu 20.04)
2. Install Node.js and MySQL client
3. Follow VPS steps above
4. Configure security groups to allow ports 80, 443, 3306

**Google Cloud Run Example**:
1. Create Dockerfile:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src
COPY tsconfig.json ./

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

2. Deploy:
```bash
gcloud run deploy sfs-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars DB_HOST=your_db_host,DB_USER=user,DB_PASSWORD=pass
```

### Frontend Deployment

#### Option 1: Static Hosting (Vercel, Netlify)

**Vercel (Recommended)**:

1. **Push to GitHub**:
```bash
git push origin main
```

2. **Connect to Vercel**:
- Go to vercel.com
- Click "New Project"
- Select GitHub repository
- Select "frontend" folder as root
- Add environment variables:
  ```
  VITE_GOOGLE_CLIENT_ID=your_client_id
  VITE_API_URL=https://your-backend-domain.com
  ```
- Deploy

3. **Custom Domain**:
- Settings → Domains
- Add your domain
- Update DNS settings

**Netlify**:

1. **Build**:
```bash
cd frontend
npm run build
```

2. **Create `netlify.toml`**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[env]
VITE_API_URL = "https://your-backend-url.com"
```

3. **Deploy**:
- Drag and drop `dist` folder, OR
- Connect GitHub for auto-deployment

#### Option 2: Traditional Web Server

**Nginx Configuration**:

```bash
sudo nano /etc/nginx/sites-available/sfs-frontend
```

```nginx
server {
    listen 80;
    server_name your_frontend_domain.com;

    root /var/www/sfs-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/sfs-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Setup HTTPS:
```bash
sudo certbot --nginx -d your_frontend_domain.com
```

#### Option 3: Docker + Docker Compose

**Frontend Dockerfile**:
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=db
      - DB_USER=root
      - DB_PASSWORD=password
      - DB_NAME=sfs
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://backend:5000

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=sfs
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

Deploy:
```bash
docker-compose up -d
```

---

## Database Setup for Production

### MySQL Initial Setup
```sql
-- Create database
CREATE DATABASE sfs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'sfs_user'@'localhost' IDENTIFIED BY 'strong_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON sfs.* TO 'sfs_user'@'localhost';
FLUSH PRIVILEGES;
```

### Import Initial Data (Optional)
```bash
mysql -u sfs_user -p sfs < sfs.sql
```

### Backup Strategy
```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/sfs"
DATE=$(date +%Y%m%d_%H%M%S)

mysqldump -u sfs_user -p sfs > $BACKUP_DIR/sfs_$DATE.sql
gzip $BACKUP_DIR/sfs_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

---

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (random 32+ characters)
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall (only allow necessary ports)
- [ ] Set up database backups
- [ ] Enable CORS only for your domain
- [ ] Implement rate limiting on API
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable database user with limited permissions
- [ ] Implement request logging
- [ ] Set up monitoring/alerting

---

## Performance Optimization

### Backend
```bash
# Use clustering for multiple cores
NODE_ENV=production node -e "
  const cluster = require('cluster');
  const os = require('os');
  
  if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  } else {
    require('./src/server.ts');
  }
"
```

### Database
```sql
-- Create indexes for common queries
CREATE INDEX idx_student_applications ON application(StudentID);
CREATE INDEX idx_scholarship_applications ON application(ScholarshipID);
CREATE INDEX idx_user_email ON user(Email);
CREATE INDEX idx_notification_student ON notification(StudentID);
```

### Frontend
```bash
# Build with optimizations
npm run build

# Compress assets
gzip -9 dist/**/*.js
gzip -9 dist/**/*.css
```

---

## Monitoring & Logging

### Application Monitoring
```bash
# Use PM2 monitoring
pm2 monit

# Or install New Relic
npm install newrelic
```

### Log Aggregation
```bash
# Setup with Winston logger
npm install winston

# Then aggregate with:
# - ELK Stack (Elasticsearch, Logstash, Kibana)
# - Splunk
# - CloudWatch (AWS)
```

### Health Checks
```
GET /health - Returns database status
Used by load balancers to verify server health
```

---

## Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Install Node
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install and Build Backend
      run: |
        cd backend
        npm ci
        npm run build
    
    - name: Install and Build Frontend
      run: |
        cd frontend
        npm ci
        npm run build
    
    - name: Deploy to Server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_KEY }}
        script: |
          cd ~/sfs
          git pull
          cd backend && npm run build && pm2 restart sfs-backend
          cd ../frontend && npm run build && cp -r dist/* /var/www/sfs
```

---

## Troubleshooting Deployment

### Issue: Database Connection Failed
```
Check:
1. MySQL service is running
2. Credentials in .env are correct
3. Database exists
4. User has permissions
5. Firewall allows connection
```

### Issue: Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Issue: Frontend Can't Connect to Backend
```
Check:
1. Backend is running
2. CORS is configured correctly
3. API URL in .env is correct
4. Firewall allows connection
5. DNS resolution working
```

### Issue: SSL Certificate Issues
```bash
# Check certificate validity
curl -I https://your_domain.com

# Renew Let's Encrypt certificate
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal
```

---

## Scaling for Production

### Horizontal Scaling
1. Deploy multiple backend instances
2. Use load balancer (Nginx, HAProxy)
3. Shared database for all instances
4. Session storage in Redis/database

### Vertical Scaling
1. Increase server CPU/RAM
2. Optimize database queries
3. Implement caching layer (Redis)
4. Use CDN for static files

### Database Optimization
1. Add read replicas for scaling reads
2. Implement connection pooling
3. Regular maintenance (VACUUM, ANALYZE)
4. Monitor slow queries
5. Archive old data periodically

