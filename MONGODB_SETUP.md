# MongoDB Database Setup Guide

## Setting up MongoDB for Library Management System

### Option 1: MongoDB Atlas (Cloud Database) - Recommended

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (choose the free tier)

2. **Configure Database Access**
   - Go to "Database Access" in your Atlas dashboard
   - Create a new database user with read/write permissions
   - Note down the username and password

3. **Configure Network Access**
   - Go to "Network Access" in your Atlas dashboard
   - Add your IP address or use 0.0.0.0/0 for development (not recommended for production)

4. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

5. **Update Environment Variables**
   Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library-management?retryWrites=true&w=majority
   PORT=5001
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   ```

### Option 2: Local MongoDB Installation

1. **Install MongoDB Community Edition**
   - Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your operating system

2. **Start MongoDB Service**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Windows
   net start MongoDB
   
   # On Linux
   sudo systemctl start mongod
   ```

3. **Create Environment File**
   Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/library-management
   PORT=5001
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   ```

### Database Setup Commands

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create Admin User**
   ```bash
   npm run create-admin
   ```

3. **Seed Database with Sample Data**
   ```bash
   npm run seed
   ```

4. **Seed Partner Libraries**
   ```bash
   npm run seed-libraries
   ```

5. **Start the Server**
   ```bash
   npm run dev
   ```

### Database Collections

The system will create the following collections:
- `users` - User accounts (students, donors, admins)
- `books` - Book inventory
- `requests` - Book borrowing requests
- `partnerlibraries` - Partner library locations

### Partner Library Features

The partner library system includes:
- **Location-based matching**: Finds nearest libraries based on user coordinates
- **Geospatial queries**: Uses MongoDB's 2dsphere index for efficient location searches
- **Distance calculation**: Calculates exact distances between users and libraries
- **Library details**: Contact info, operating hours, services offered
- **Capacity tracking**: Current and maximum book capacity

### API Endpoints

- `GET /api/partner-libraries` - Get all partner libraries
- `GET /api/partner-libraries/nearest?latitude=12.9716&longitude=77.5946` - Find nearest libraries
- `GET /api/partner-libraries/user/nearby` - Get libraries near user's location
- `POST /api/partner-libraries` - Create new partner library (authenticated)
- `PUT /api/partner-libraries/:id` - Update partner library (authenticated)
- `DELETE /api/partner-libraries/:id` - Delete partner library (admin only)

### Testing the Setup

1. Start the backend server: `npm run dev`
2. Check health endpoint: `http://localhost:5001/health`
3. Test partner libraries: `http://localhost:5001/api/partner-libraries`

The system is now ready with location-based partner library matching!
