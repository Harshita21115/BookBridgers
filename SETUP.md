# Library Management System - Setup Guide

This is a complete guide to set up and run the Library Management System with MongoDB backend.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local installation or MongoDB Atlas account)
- npm or yarn

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```env
MONGODB_URI=mongodb://localhost:27017/library-management
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Note:** If using MongoDB Atlas, replace the MONGODB_URI with your Atlas connection string.

4. Start the backend server:
```bash
# Development mode (with nodemon for auto-reload)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the root directory (if not already there):
```bash
cd ..
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## MongoDB Setup

### Option 1: Local MongoDB

1. Install MongoDB on your system:
   - macOS: `brew install mongodb-community`
   - Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

2. Start MongoDB service:
```bash
# macOS/Linux
mongod

# Windows
net start MongoDB
```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (use 0.0.0.0/0 for development)
5. Get your connection string and update the MONGODB_URI in backend/.env

## Creating an Admin User

To create an admin user, you can either:

1. **Use the signup page** - Sign up with role "admin" (you'll need to modify the signup page or database to allow this)
2. **Use MongoDB directly**:
```bash
# Open MongoDB shell
mongosh

# Select database
use library-management

# Create admin user
db.users.insertOne({
  fullName: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$YourHashedPasswordHere",
  role: "admin"
})
```

**Note:** To get the hashed password, you can temporarily use the signup endpoint or use an online bcrypt generator.

## Default Credentials (for testing)

After setting up the backend and creating a user, you can use:
- Email: (Your registered email)
- Password: (Your password)

## Running the Application

1. Start MongoDB (if using local installation)
2. Start the backend server (in `backend/` directory)
3. Start the frontend server (in root directory)
4. Open `http://localhost:3000` in your browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (donor/admin only)
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book (admin only)

### Requests
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create borrow request
- `PUT /api/requests/:id/status` - Update request status (admin)
- `PUT /api/requests/:id/return` - Return book

### Admin
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/pending-requests` - Get pending requests
- `GET /api/admin/books` - Get all books
- `GET /api/admin/users` - Get all users

## Project Structure

```
library-management/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Entry point
│   └── package.json
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── contexts/        # React contexts
│   ├── services/        # API services
│   └── index.js
└── package.json         # Frontend dependencies
```

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify the MONGODB_URI in `.env` file
- Check if port 5000 is available

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in root `.env` file
- Check CORS settings in backend/server.js

### Authentication errors
- Verify JWT_SECRET is set in backend/.env
- Clear browser localStorage
- Check if user exists in database

## Next Steps

1. Replace sample data with real API calls in frontend components
2. Add proper error handling and validation
3. Implement admin dashboard with real statistics
4. Add book images and better UI
5. Deploy to production (Heroku, AWS, etc.)

## Support

If you encounter any issues, please check:
- MongoDB is running and accessible
- All environment variables are set correctly
- All dependencies are installed
- Ports 3000 and 5000 are available

