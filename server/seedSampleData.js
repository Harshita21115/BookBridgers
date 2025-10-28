const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Book = require('./models/Book');
const PartnerLibrary = require('./models/PartnerLibrary');
const Request = require('./models/Request');
const Appointment = require('./models/Appointment');
require('dotenv').config();

async function seedSampleData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await User.deleteMany({});
        await Book.deleteMany({});
        await Request.deleteMany({});
        await Appointment.deleteMany({});
        // Keep libraries as they're already properly configured

        // Create Users
        console.log('👥 Creating users...');
        const hashedPassword = await bcrypt.hash('password123', 12);
        const harshitaPassword = await bcrypt.hash('123456', 12);

        const users = await User.insertMany([
            {
                fullName: 'John Student',
                email: 'john.student@email.com',
                password: hashedPassword,
                role: 'student',
                phone: '+91 98765 43210',
                address: {
                    street: '123 Student Lane',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zipCode: '400001',
                    country: 'India'
                }
            },
            {
                fullName: 'Sarah Donor',
                email: 'sarah.donor@email.com',
                password: hashedPassword,
                role: 'donor',
                phone: '+91 98765 43211',
                address: {
                    street: '456 Donor Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zipCode: '400002',
                    country: 'India'
                }
            },
            {
                fullName: 'David Donor',
                email: 'david.donor@email.com',
                password: hashedPassword,
                role: 'donor',
                phone: '+91 98765 43212',
                address: {
                    street: '789 Book Avenue',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zipCode: '400003',
                    country: 'India'
                }
            },
            {
                fullName: 'Mike Librarian',
                email: 'mike.librarian@email.com',
                password: hashedPassword,
                role: 'admin',
                phone: '+91 98765 43213',
                address: {
                    street: '321 Library Road',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zipCode: '400004',
                    country: 'India'
                }
            },
            {
                fullName: 'Harshita Student',
                email: 'harshita.student@somaiya.edu',
                password: harshitaPassword,
                role: 'student',
                phone: '+91 98765 43214',
                address: {
                    street: 'Somaiya Campus',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zipCode: '400077',
                    country: 'India'
                }
            },
            {
                fullName: 'Harshita Donor',
                email: 'harshita.donor@somaiya.edu',
                password: harshitaPassword,
                role: 'donor',
                phone: '+91 98765 43215',
                address: {
                    street: 'Somaiya Campus',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zipCode: '400077',
                    country: 'India'
                }
            },
            {
                fullName: 'Harshita Admin',
                email: 'harshita.admin@somaiya.edu',
                password: harshitaPassword,
                role: 'admin',
                phone: '+91 98765 43216',
                address: {
                    street: 'Somaiya Campus',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zipCode: '400077',
                    country: 'India'
                }
            }
        ]);

        console.log(`✅ Created ${users.length} users`);

        // Get libraries
        const libraries = await PartnerLibrary.find({});
        console.log(`📚 Found ${libraries.length} libraries`);

        // Create Books
        console.log('📖 Creating books...');
        const books = await Book.insertMany([
            {
                title: 'Introduction to Computer Science',
                author: 'Dr. Jane Smith',
                category: 'Technology',
                description: 'A comprehensive introduction to computer science concepts and programming fundamentals.',
                imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop',
                status: 'Available',
                donor: users[1]._id, // Sarah Donor
                condition: 'Good',
                isbn: '978-0123456789',
                rating: 4.5,
                price: '0'
            },
            {
                title: 'Data Structures and Algorithms',
                author: 'Prof. Michael Johnson',
                category: 'Technology',
                description: 'Essential data structures and algorithms for software development.',
                imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=400&fit=crop',
                status: 'Available',
                donor: users[2]._id, // David Donor
                condition: 'Like New',
                isbn: '978-0123456790',
                rating: 4.8,
                price: '0'
            },
            {
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                category: 'Literature',
                description: 'A classic American novel set in the Jazz Age.',
                imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
                status: 'Available',
                donor: users[1]._id, // Sarah Donor
                condition: 'Good',
                isbn: '978-0743273565',
                rating: 4.2,
                price: '0'
            },
            {
                title: 'Calculus: Early Transcendentals',
                author: 'James Stewart',
                category: 'Mathematics',
                description: 'Comprehensive calculus textbook with clear explanations and examples.',
                imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=400&fit=crop',
                status: 'Available',
                donor: users[2]._id, // David Donor
                condition: 'Fair',
                isbn: '978-1285741550',
                rating: 4.0,
                price: '0'
            },
            {
                title: 'Introduction to Psychology',
                author: 'Dr. Robert Wilson',
                category: 'Science',
                description: 'An engaging introduction to the study of human behavior and mental processes.',
                imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=400&fit=crop',
                status: 'Available',
                donor: users[1]._id, // Sarah Donor
                condition: 'Good',
                isbn: '978-0135182776',
                rating: 4.3,
                price: '0'
            },
            {
                title: 'Organic Chemistry',
                author: 'Dr. Patricia Brown',
                category: 'Science',
                description: 'Comprehensive guide to organic chemistry principles and reactions.',
                imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&h=400&fit=crop',
                status: 'Available',
                donor: users[2]._id, // David Donor
                condition: 'Like New',
                isbn: '978-0321971371',
                rating: 4.6,
                price: '0'
            },
            {
                title: 'World History: A Comprehensive Guide',
                author: 'Dr. Elizabeth Davis',
                category: 'History',
                description: 'A thorough overview of world history from ancient times to present.',
                imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
                status: 'Available',
                donor: users[1]._id, // Sarah Donor
                condition: 'Good',
                isbn: '978-0134686081',
                rating: 4.1,
                price: '0'
            },
            {
                title: 'Business Management Fundamentals',
                author: 'Prof. James Miller',
                category: 'Other',
                description: 'Essential principles of business management and organizational behavior.',
                imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
                status: 'Available',
                donor: users[2]._id, // David Donor
                condition: 'Good',
                isbn: '978-0078029521',
                rating: 4.4,
                price: '0'
            }
        ]);

        console.log(`✅ Created ${books.length} books`);

        // Create Requests
        console.log('📋 Creating requests...');
        const requests = await Request.insertMany([
            {
                student: users[0]._id, // John Student
                book: books[0]._id, // Introduction to Computer Science
                status: 'Pending',
                requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                notes: 'Need this book for my computer science course'
            },
            {
                student: users[0]._id, // John Student
                book: books[1]._id, // Data Structures and Algorithms
                status: 'Approved',
                requestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                approvalDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                approvedBy: users[3]._id, // Mike Librarian
                notes: 'Approved for pickup'
            },
            {
                student: users[0]._id, // John Student
                book: books[2]._id, // The Great Gatsby
                status: 'Pending',
                requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                notes: 'Required for literature class'
            },
            {
                student: users[0]._id, // John Student
                book: books[3]._id, // Calculus
                status: 'Approved',
                requestDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
                approvalDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
                dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
                approvedBy: users[3]._id, // Mike Librarian
                notes: 'Currently borrowed'
            },
            {
                student: users[0]._id, // John Student
                book: books[4]._id, // Psychology
                status: 'Returned',
                requestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                approvalDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
                dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                returnedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                approvedBy: users[3]._id, // Mike Librarian
                notes: 'Successfully returned'
            }
        ]);

        console.log(`✅ Created ${requests.length} requests`);

        // Create Appointments
        console.log('📅 Creating appointments...');
        const appointments = await Appointment.insertMany([
            {
                user: users[0]._id, // John Student
                library: libraries[0]._id, // Mumbai Central Library
                appointmentType: 'book_pickup',
                scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
                scheduledTime: '10:00 AM',
                status: 'pending',
                notes: 'Student will pick up approved book',
                books: [{
                    book: books[1]._id, // Data Structures and Algorithms
                    condition: 'Like New',
                    notes: 'Approved for pickup'
                }],
                contactInfo: {
                    phone: users[0].phone,
                    email: users[0].email
                }
            },
            {
                user: users[1]._id, // Sarah Donor
                library: libraries[1]._id, // Bandra Community Learning Center
                appointmentType: 'book_drop_off',
                scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
                scheduledTime: '2:00 PM',
                status: 'confirmed',
                notes: 'Donor will drop off additional books',
                books: [],
                contactInfo: {
                    phone: users[1].phone,
                    email: users[1].email
                }
            }
        ]);

        console.log(`✅ Created ${appointments.length} appointments`);

        // Display summary
        console.log('\n📊 Sample Data Summary:');
        console.log(`- Users: ${users.length} (2 students, 3 donors, 2 admins)`);
        console.log(`- Books: ${books.length} (all available)`);
        console.log(`- Requests: ${requests.length} (1 approved, 2 pending, 1 borrowed, 1 returned)`);
        console.log(`- Libraries: ${libraries.length} (Mumbai-based)`);
        console.log(`- Appointments: ${appointments.length} (1 pickup, 1 drop-off)`);

        console.log('\n🎉 Sample data created successfully!');
        console.log('\n🔑 Login Credentials:');
        console.log('Student: john.student@email.com / password123');
        console.log('Donor: sarah.donor@email.com / password123');
        console.log('Admin: mike.librarian@email.com / password123');
        console.log('\n🔑 Harshita Accounts (Password: 123456):');
        console.log('Student: harshita.student@somaiya.edu / 123456');
        console.log('Donor: harshita.donor@somaiya.edu / 123456');
        console.log('Admin: harshita.admin@somaiya.edu / 123456');

    } catch (error) {
        console.error('❌ Error creating sample data:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the function
seedSampleData();
