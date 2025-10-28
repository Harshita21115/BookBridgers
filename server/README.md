# Library Management System - Backend

A Node.js/Express backend API for the Library Management System with MongoDB.

## Features

- Authentication with JWT
- Role-based access control (Student, Donor, Admin)
- Book management
- Borrow request management
- User management
- Admin dashboard with statistics

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/library-management
PORT=5000
JWT_SECRET=your-secret-key
NODE_ENV=development
```

3. Make sure MongoDB is running on your system

4. Create an admin user (optional):
```bash
npm run create-admin
```

5. Seed sample data (optional):
```bash
npm run seed
```

## Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (donor/admin only)
- `PUT /api/books/:id` - Update book (donor/admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

### Requests
- `GET /api/requests` - Get all requests (protected)
- `POST /api/requests` - Create borrow request (student only)
- `PUT /api/requests/:id/status` - Update request status (admin only)
- `PUT /api/requests/:id/return` - Return book (student only)

### Admin
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/pending-requests` - Get pending requests
- `GET /api/admin/books` - Get all books
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/requests/:id` - Update request

## Database Models

### User
- fullName
- email (unique)
- password (hashed)
- role (student/donor/admin)

### Book
- title
- author
- category
- description
- imageUrl
- status (Available/Borrowed/Requested)
- donor (reference to User)
- currentBorrower (reference to User)
- condition
- isbn

### Request
- student (reference to User)
- book (reference to Book)
- status (Pending/Approved/Rejected/Returned)
- requestDate
- approvalDate
- returnDate
- dueDate
- approvedBy (reference to User)

