# College ERP - Setup Guide

## 📋 Prerequisites

Before setting up the College ERP system, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** package manager

## 🚀 Quick Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd College-ERP-main
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Environment Configuration
```bash
# Copy environment template
cp backend/config/.env.example backend/config/.env

# Edit the .env file with your configuration
# Update database URI, JWT secret, etc.
```

### 4. Initialize Database
```bash
npm run setup-env
```

### 5. Start the Application
```bash
npm start
```

## 🔧 Detailed Setup

### Backend Configuration

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `config/.env.example` to `config/.env`
   - Update the following variables:
     ```env
     # Database
     MONGO_URI=mongodb://localhost:27017/college-erp
     
     # Security
     JWT_SECRET=your-super-secret-jwt-key
     
     # Email (optional)
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     ```

4. **Start backend server**
   ```bash
   npm start
   ```

### Frontend Configuration

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Update API configuration**
   - Check `src/services/api.js` for correct backend URL
   - Default: `http://localhost:4001/api`

4. **Start frontend development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

### Local MongoDB Setup

1. **Install MongoDB Community Edition**
   - Windows: Download from MongoDB website
   - macOS: `brew install mongodb-community`
   - Linux: Follow MongoDB installation guide

2. **Start MongoDB service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

3. **Verify MongoDB connection**
   ```bash
   mongo
   # or
   mongosh
   ```

### Cloud MongoDB (MongoDB Atlas)

1. **Create MongoDB Atlas account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster

2. **Get connection string**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update environment variable**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/college-erp
   ```

## 👤 Default User Accounts

After setup, you can login with these default accounts:

### Admin Account
- **Username**: admin
- **Password**: admin

### Teacher Account
- Teachers are created by admin
- **Default Password**: teacher123

### Student Account
- Students are created by admin
- **Default Password**: student123

## 🔍 Verification

### 1. Check Backend Health
```bash
curl http://localhost:4001/api/health
```

### 2. Check Frontend
- Open browser: `http://localhost:5173`
- Should see login page

### 3. Test Login
- Use admin credentials to login
- Verify dashboard loads correctly

## 🛠️ Development Tools

### Available Scripts

```bash
# Start both frontend and backend
npm start

# Start only backend
npm run backend

# Start only frontend
npm run frontend

# Install all dependencies
npm run install-all

# Setup database and environment
npm run setup-env

# Health check
npm run health-check

# Build for production
npm run build

# Run tests
npm test

# Clean node_modules
npm run clean

# Clean logs
npm run clean-logs
```

### Development Workflow

1. **Start development servers**
   ```bash
   npm start
   ```

2. **Make changes to code**
   - Backend changes auto-restart with nodemon
   - Frontend changes auto-reload with Vite

3. **Test changes**
   - Use browser developer tools
   - Check console for errors
   - Test API endpoints

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 4001 (backend)
   npx kill-port 4001
   
   # Kill process on port 5173 (frontend)
   npx kill-port 5173
   ```

2. **MongoDB connection error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify network connectivity

3. **Dependencies issues**
   ```bash
   # Clean and reinstall
   npm run clean
   npm run install-all
   ```

4. **Permission errors**
   ```bash
   # Fix npm permissions (Linux/macOS)
   sudo chown -R $(whoami) ~/.npm
   ```

### Debug Mode

Enable debug mode for detailed logging:

```env
DEBUG_MODE=true
LOG_LEVEL=debug
```

### Health Check

Run comprehensive health check:

```bash
npm run health-check
```

## 🚀 Production Deployment

### Environment Setup

1. **Set production environment**
   ```env
   NODE_ENV=production
   ```

2. **Update URLs**
   ```env
   FRONTEND_URL=https://your-domain.com
   BACKEND_URL=https://api.your-domain.com
   ```

3. **Secure secrets**
   - Use strong JWT secret
   - Enable HTTPS
   - Configure proper CORS

### Build and Deploy

1. **Build frontend**
   ```bash
   npm run build
   ```

2. **Deploy backend**
   - Use PM2 or similar process manager
   - Configure reverse proxy (Nginx)
   - Set up SSL certificates

3. **Database**
   - Use MongoDB Atlas or dedicated server
   - Set up regular backups
   - Configure monitoring

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review logs in `logs/` directory
3. Run health check: `npm run health-check`
4. Check GitHub issues
5. Contact support team

## 🔄 Updates

To update the system:

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Update dependencies**
   ```bash
   npm run install-all
   ```

3. **Run migrations (if any)**
   ```bash
   npm run migrate
   ```

4. **Restart services**
   ```bash
   npm start
   ```

---

**Happy coding! 🎉**