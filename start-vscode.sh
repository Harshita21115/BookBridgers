#!/bin/bash

# BookBridgers VS Code Launcher
echo "🚀 Starting BookBridgers in VS Code..."

# Check if VS Code is installed
if ! command -v code &> /dev/null; then
    echo "❌ VS Code not found. Installing..."
    brew install --cask visual-studio-code
    echo "✅ VS Code installed. Please restart your terminal and run this script again."
    exit 1
fi

# Check if MongoDB is running
if ! brew services list | grep mongodb-community | grep started &> /dev/null; then
    echo "🔄 Starting MongoDB..."
    brew services start mongodb-community
    sleep 2
fi

# Open project in VS Code
echo "📁 Opening project in VS Code..."
code .

echo "✅ Project opened in VS Code!"
echo ""
echo "📋 Next steps:"
echo "1. Install recommended extensions when prompted"
echo "2. Open terminal in VS Code (Ctrl+`)"
echo "3. Run: cd server && npm run dev"
echo "4. Open new terminal and run: cd client && npm start"
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "🔑 Login credentials:"
echo "Student: john.student@email.com / password123"
echo "Donor: sarah.donor@email.com / password123"
echo "Admin: mike.librarian@email.com / password123"

