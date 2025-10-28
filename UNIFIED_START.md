# BookBridgers - Unified Start Guide

## 🚀 Quick Start (One Command)

### **Start Everything at Once:**
```bash
npm start
```

This single command will:
- ✅ Start MongoDB (if not running)
- ✅ Install dependencies (if missing)
- ✅ Seed database (if empty)
- ✅ Start backend server (port 5001)
- ✅ Start frontend server (port 3000)

## 📋 Available Commands

### **Main Commands:**
```bash
npm start          # Start both client and server
npm run dev        # Start in development mode (with hot reload)
npm run setup      # Complete setup (install + start MongoDB + seed + start)
```

### **Individual Commands:**
```bash
npm run server     # Start only backend
npm run client     # Start only frontend
npm run server:dev # Start backend with nodemon
npm run client:dev # Start frontend with hot reload
```

### **Database Commands:**
```bash
npm run seed              # Populate database with sample data
npm run mongodb:start     # Start MongoDB service
npm run mongodb:stop      # Stop MongoDB service
npm run mongodb:restart   # Restart MongoDB service
```

### **Setup Commands:**
```bash
npm run install:all       # Install all dependencies
npm run build            # Build frontend for production
npm run clean            # Remove all node_modules
```

## 🎯 Usage Examples

### **First Time Setup:**
```bash
# Clone and navigate to project
cd bookbridgers-app

# Complete setup (installs everything and starts)
npm run setup
```

### **Daily Development:**
```bash
# Just start the application
npm start

# Or use the startup script
./start.sh
```

### **VS Code Development:**
1. **Open VS Code**: `code .`
2. **Press F5** or go to Run and Debug → "Launch Full Stack"
3. **Or use Tasks**: `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Full Stack App"

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **MongoDB**: mongodb://localhost:27017/library-management

## 🔑 Login Credentials

- **Student**: `john.student@email.com` / `password123`
- **Donor**: `sarah.donor@email.com` / `password123`
- **Admin**: `mike.librarian@email.com` / `password123`

## 🛠️ Troubleshooting

### **Port Already in Use:**
```bash
# Kill processes on ports 3000 and 5001
lsof -ti:3000 | xargs kill -9
lsof -ti:5001 | xargs kill -9
```

### **MongoDB Issues:**
```bash
# Restart MongoDB
npm run mongodb:restart

# Check MongoDB status
brew services list | grep mongodb
```

### **Dependencies Issues:**
```bash
# Clean install all dependencies
npm run clean
npm run install:all
```

### **Database Issues:**
```bash
# Clear and reseed database
mongosh library-management --eval "db.dropDatabase()"
npm run seed
```

## 📁 Project Structure

```
bookbridgers-app/
├── package.json          # Root package with unified commands
├── start.sh              # Startup script
├── client/               # React frontend
│   ├── src/
│   └── package.json
├── server/               # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── package.json
└── .vscode/              # VS Code configuration
    ├── launch.json       # Debug configurations
    ├── tasks.json        # Build tasks
    └── settings.json     # Workspace settings
```

## 🔧 VS Code Integration

### **Debug Configurations:**
- **Launch Backend Server**: Debug backend with breakpoints
- **Launch Full Stack**: Start everything with debugging

### **Tasks Available:**
- **Start Full Stack App**: `npm start` equivalent
- **Start Development Mode**: `npm run dev` equivalent
- **Start MongoDB**: Start MongoDB service
- **Seed Database**: Populate with sample data

### **Recommended Extensions:**
- ESLint
- Prettier
- MongoDB for VS Code
- Node.js Extension Pack

## 🎉 Benefits of Unified Setup

1. **One Command**: `npm start` runs everything
2. **Automatic Setup**: Handles dependencies, MongoDB, and seeding
3. **VS Code Integration**: Debug and tasks configured
4. **Error Handling**: Checks prerequisites and fixes common issues
5. **Development Ready**: Hot reload and debugging support

## 🚀 Next Steps

1. **Run**: `npm start`
2. **Open**: http://localhost:3000
3. **Login**: Use provided credentials
4. **Develop**: Start building your features!

**Your BookBridgers application is now ready with unified startup!** 🎉

