# BookBridgers - VS Code Setup Guide

## 🚀 Quick Start in VS Code

### Prerequisites
- VS Code installed
- Node.js (v16 or higher)
- MongoDB running locally
- Git

### 1. Open Project in VS Code
```bash
# Navigate to project directory
cd /Users/harshitabagwe/bookbridgers-app

# Open in VS Code
code .
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Start MongoDB
```bash
# Start MongoDB service
brew services start mongodb-community

# Or use VS Code task: Ctrl+Shift+P → "Tasks: Run Task" → "Start MongoDB"
```

### 4. Seed Database (Optional)
```bash
# Run from server directory
cd server
node insertDataCorrectly.js

# Or use VS Code task: Ctrl+Shift+P → "Tasks: Run Task" → "Seed Database"
```

### 5. Run the Application

#### Option A: Unified Command (Recommended)
```bash
# Single command starts everything
npm start
```

#### Option B: Using VS Code Tasks
1. **Start Full Stack**: `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Full Stack App"
2. **Development Mode**: `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Development Mode"

#### Option C: Using VS Code Debugger
1. **Go to Run and Debug** (Ctrl+Shift+D)
2. **Select "Launch Full Stack"** and click play
3. **Or select "Launch Backend Server"** for backend-only debugging

#### Option D: Using Terminal
```bash
# Start everything at once
npm start

# Or start in development mode
npm run dev
```

## 🔧 VS Code Features

### Debugging
- **Backend Debugging**: Set breakpoints in server files and use "Launch Backend Server" configuration
- **Frontend Debugging**: Use browser dev tools or React Developer Tools

### Tasks Available
- `npm: start:client` - Start React frontend
- `npm: dev:server` - Start Node.js backend with nodemon
- `Start MongoDB` - Start MongoDB service
- `Stop MongoDB` - Stop MongoDB service
- `Seed Database` - Populate database with sample data

### Recommended Extensions
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **MongoDB for VS Code** - Database management
- **Node.js Extension Pack** - Node.js development tools
- **Tailwind CSS IntelliSense** - CSS class suggestions

## 📁 Project Structure
```
bookbridgers-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── services/      # API services
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   └── package.json
└── .vscode/              # VS Code configuration
    ├── launch.json       # Debug configurations
    ├── tasks.json        # Build tasks
    └── settings.json     # Workspace settings
```

## 🌐 Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **MongoDB**: mongodb://localhost:27017/library-management

## 🔑 Login Credentials
- **Student**: john.student@email.com / password123
- **Donor**: sarah.donor@email.com / password123
- **Admin**: mike.librarian@email.com / password123

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 3000 and 5001
lsof -ti:3000 | xargs kill -9
lsof -ti:5001 | xargs kill -9
```

### MongoDB Connection Issues
```bash
# Check MongoDB status
brew services list | grep mongodb

# Restart MongoDB
brew services restart mongodb-community
```

### Clear Database
```bash
# Connect to MongoDB
mongosh library-management

# Clear all collections
db.users.deleteMany({})
db.books.deleteMany({})
db.partnerlibraries.deleteMany({})
db.requests.deleteMany({})
db.appointments.deleteMany({})
```

## 📝 Development Tips

1. **Use VS Code Integrated Terminal**: Split terminals for frontend and backend
2. **Enable Auto-save**: File → Auto Save
3. **Use Git Integration**: Source Control panel for version control
4. **Debug API Calls**: Use Network tab in browser dev tools
5. **Database Queries**: Use MongoDB Compass or VS Code MongoDB extension

## 🎯 Next Steps
1. Open VS Code
2. Install recommended extensions
3. Start MongoDB
4. Run backend and frontend
5. Open http://localhost:3000
6. Start developing! 🚀
