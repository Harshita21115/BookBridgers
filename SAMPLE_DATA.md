# 📚 BookBridgers Sample Data

## 🎯 Overview
This document describes the sample data created for testing the BookBridgers application.

## 👥 Users Created

### Student User
- **Email**: `john.student@email.com`
- **Password**: `password123`
- **Role**: Student
- **Phone**: +91 98765 43210
- **Location**: Mumbai, Maharashtra

### Donor Users
- **Email**: `sarah.donor@email.com`
- **Password**: `password123`
- **Role**: Donor
- **Phone**: +91 98765 43211

- **Email**: `david.donor@email.com`
- **Password**: `password123`
- **Role**: Donor
- **Phone**: +91 98765 43212

### Admin User
- **Email**: `mike.librarian@email.com`
- **Password**: `password123`
- **Role**: Admin
- **Phone**: +91 98765 43213

## 📖 Books Created (8 total)

1. **Introduction to Computer Science** by Dr. Jane Smith (Technology)
2. **Data Structures and Algorithms** by Prof. Michael Johnson (Technology)
3. **The Great Gatsby** by F. Scott Fitzgerald (Literature)
4. **Calculus: Early Transcendentals** by James Stewart (Mathematics)
5. **Introduction to Psychology** by Dr. Robert Wilson (Science)
6. **Organic Chemistry** by Dr. Patricia Brown (Science)
7. **World History: A Comprehensive Guide** by Dr. Elizabeth Davis (History)
8. **Business Management Fundamentals** by Prof. James Miller (Other)

## 📋 Book Requests Created (5 total)

### For John Student:
1. **Introduction to Computer Science** - Status: Pending
2. **Data Structures and Algorithms** - Status: Approved ✅ (Ready for pickup)
3. **The Great Gatsby** - Status: Pending
4. **Calculus** - Status: Approved ✅ (Currently borrowed)
5. **Psychology** - Status: Returned ✅ (Past borrowed)

## 🏛️ Partner Libraries (2 total)

1. **Mumbai Central Library**
   - Address: MG Road, Fort Area, Mumbai, Maharashtra 400001
   - Coordinates: Mumbai Fort area

2. **Bandra Community Learning Center**
   - Address: Bandra Kurla Complex, Mumbai, Maharashtra 400051
   - Coordinates: Bandra Kurla Complex

## 📅 Appointments Created (2 total)

1. **Book Pickup Appointment**
   - User: John Student
   - Library: Mumbai Central Library
   - Book: Data Structures and Algorithms
   - Date: Tomorrow at 10:00 AM
   - Status: Pending

2. **Book Drop-off Appointment**
   - User: Sarah Donor
   - Library: Bandra Community Learning Center
   - Date: Day after tomorrow at 2:00 PM
   - Status: Confirmed

## 🚀 How to Test

### Student Pickup Flow:
1. Login as `john.student@email.com` / `password123`
2. Go to Student Dashboard
3. You'll see **2 approved books** for pickup:
   - Data Structures and Algorithms
   - Calculus
4. Click "Schedule Pickup" on any approved book
5. You'll be redirected to Partner Libraries page
6. Select a library, date, and time
7. Complete the appointment scheduling

### Donor Drop-off Flow:
1. Login as `sarah.donor@email.com` / `password123`
2. Go to Donor Dashboard
3. Add books or schedule drop-off appointments

### Admin Management:
1. Login as `mike.librarian@email.com` / `password123`
2. Go to Admin Dashboard
3. Manage pending requests, approve/reject books

## 🔄 Regenerating Sample Data

To regenerate the sample data:

```bash
# From root directory
npm run seed

# Or from server directory
cd server && node seedSampleData.js
```

This will clear all existing data and create fresh sample data.

## 📊 Data Summary
- **Users**: 4 (1 student, 2 donors, 1 admin)
- **Books**: 8 (all available)
- **Requests**: 5 (2 approved, 2 pending, 1 returned)
- **Libraries**: 2 (Mumbai-based)
- **Appointments**: 2 (1 pickup, 1 drop-off)

