# Quick Start Guide - Library Management System

Follow these steps to get your Library Management System up and running.

## Prerequisites Installation

### 1. Install Node.js and npm
Download from: https://nodejs.org/

### 2. Install MongoDB
**Option A - Local Installation:**
- macOS: `brew install mongodb-community`
- Linux: Follow MongoDB installation guide
- Windows: Download from MongoDB website

**Option B - MongoDB Atlas (Cloud):**
- Sign up at: https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string

### 3. Start MongoDB (if using local installation)
```bash
mongod  # macOS/Linux
# or
net start MongoDB  # Windows
```

## Setup Steps

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# On macOS/Linux:
cp .env.example .env

# On Windows:
copy .env.example .env

# Edit .env file with your MongoDB connection string
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/library-management
PORT=5000
JWT_SECRET=change-this-to-a-random-secret-key
NODE_ENV=development
```

### Step 2: Frontend Setup

```bash
# From root directory
cd ..

# Install dependencies (if not done)
npm install

# Create .env file in root
# On macOS/Linux:
cp .env.example .env

# On Windows:
copy .env.example .env

# The .env file should contain:
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Create Sample Data

```bash
# Navigate to backend directory
cd backend

# Create admin user
npm run create-admin

# Seed sample data
npm run seed
```

This will create:
- **Admin**: admin@library.com / admin123
- **Student**: student@library.com / student123  
- **Donor**: donor@library.com / donor123

## Running the Application

### Terminal 1 - Start Backend
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

### Terminal 2 - Start Frontend
```bash
npm start
```
Frontend will run on: http://localhost:3000

## Testing the Application

1. Open http://localhost:3000 in your browser
2. Sign up as a new user or use:
   - Login as admin: admin@library.com / admin123
   - Login as student: student@library.com / student123
   - Login as donor: donor@library.com / donor123

3. Test different features:
   - **As Student**: Browse books, make borrow requests
   - **As Donor**: Add/remove books to donate
   - **As Admin**: View statistics, approve/reject requests

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify MONGODB_URI in backend/.env
- Make sure port 5000 is available

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in root .env
- Try restarting both servers

### Authentication errors
- Clear browser localStorage
- Check JWT_SECRET in backend/.env
- Verify user exists in database

## Project Structure

```
.
├── backend/               # Node.js backend
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts
│   └── server.js        # Entry point
├── src/                 # React frontend
│   ├── components/     # Reusable components
│   ├── contexts/       # React contexts
│   ├── pages/          # Page components
│   └── services/       # API services
├── .env.example        # Environment template
└── SETUP.md           # Detailed setup
```

## Next Steps

1. ✅ Backend and database setup
2. ✅ Frontend fixes applied
3. 🔲 Replace placeholder data with real API calls
4. 🔲 Add proper error handling
5. 🔲 Implement book images
6. 🔲 Deploy to production

## API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/books` - Get books
- `POST /api/requests` - Create request
- `GET /api/admin/stats` - Get stats (admin only)

For full API documentation, see `backend/README.md`

## Support

For detailed information:
- Backend docs: `backend/README.md`
- Setup guide: `SETUP.md`
- Project summary: `PROJECT_SUMMARY.md`

