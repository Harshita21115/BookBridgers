const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');
const PartnerLibrary = require('./models/PartnerLibrary');
const Request = require('./models/Request');
const Appointment = require('./models/Appointment');
require('dotenv').config();

async function insertDataCorrectly() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await PartnerLibrary.deleteMany({});
    await Request.deleteMany({});
    await Appointment.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // 1. Insert Users
    console.log('👥 Creating users...');
    const users = await User.insertMany([
      {
        fullName: 'John Student',
        email: 'john.student@email.com',
        password: 'password123',
        role: 'student',
        phone: '+1234567890',
        location: {
          address: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'India'
          }
        }
      },
      {
        fullName: 'Sarah Donor',
        email: 'sarah.donor@email.com',
        password: 'password123',
        role: 'donor',
        phone: '+1234567891',
        location: {
          address: {
            street: '456 Oak Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10002',
            country: 'India'
          }
        }
      },
      {
        fullName: 'David Donor',
        email: 'david.donor@email.com',
        password: 'password123',
        role: 'donor',
        phone: '+1234567892',
        location: {
          address: {
            street: '789 Pine St',
            city: 'New York',
            state: 'NY',
            zipCode: '10003',
            country: 'India'
          }
        }
      },
      {
        fullName: 'Mike Librarian',
        email: 'mike.librarian@email.com',
        password: 'password123',
        role: 'admin',
        phone: '+1234567893',
        location: {
          address: {
            street: '321 Elm St',
            city: 'New York',
            state: 'NY',
            zipCode: '10004',
            country: 'India'
          }
        }
      }
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Get user IDs
    const studentUser = users.find(u => u.role === 'student');
    const donorUsers = users.filter(u => u.role === 'donor');
    const adminUser = users.find(u => u.role === 'admin');

    // 2. Insert Books
    console.log('📚 Creating books...');
    const books = await Book.insertMany([
      {
        title: 'Introduction to Computer Science',
        author: 'Dr. Jane Smith',
        category: 'Technology',
        description: 'A comprehensive introduction to computer science concepts and programming fundamentals.',
        imageUrl: null,
        status: 'Available',
        donor: donorUsers[0]._id,
        currentBorrower: null,
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
        imageUrl: null,
        status: 'Available',
        donor: donorUsers[1]._id,
        currentBorrower: null,
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
        imageUrl: null,
        status: 'Available',
        donor: donorUsers[0]._id,
        currentBorrower: null,
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
        imageUrl: null,
        status: 'Available',
        donor: donorUsers[1]._id,
        currentBorrower: null,
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
        imageUrl: null,
        status: 'Available',
        donor: donorUsers[0]._id,
        currentBorrower: null,
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
        imageUrl: null,
        status: 'Available',
        donor: donorUsers[1]._id,
        currentBorrower: null,
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
        imageUrl: null,
        status: 'Available',
        donor: donorUsers[0]._id,
        currentBorrower: null,
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
        imageUrl: null,
        status: 'Available',
        donor: donorUsers[1]._id,
        currentBorrower: null,
        condition: 'Good',
        isbn: '978-0078029521',
        rating: 4.4,
        price: '0'
      }
    ]);
    console.log(`✅ Created ${books.length} books`);

    // 3. Insert Partner Libraries
    console.log('🏛️ Creating partner libraries...');
    const libraries = await PartnerLibrary.insertMany([
      {
        name: 'Central Public Library',
        address: {
          street: '456 Library Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          country: 'India'
        },
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        contactInfo: {
          phone: '+1234567890',
          email: 'info@centrallibrary.org',
          website: 'https://centrallibrary.org'
        },
        operatingHours: {
          monday: { open: '9:00 AM', close: '9:00 PM' },
          tuesday: { open: '9:00 AM', close: '9:00 PM' },
          wednesday: { open: '9:00 AM', close: '9:00 PM' },
          thursday: { open: '9:00 AM', close: '9:00 PM' },
          friday: { open: '9:00 AM', close: '6:00 PM' },
          saturday: { open: '10:00 AM', close: '5:00 PM' },
          sunday: { open: '12:00 PM', close: '5:00 PM' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space'],
        capacity: {
          maxBooks: 1000,
          currentBooks: 0
        },
        isActive: true,
        addedBy: adminUser._id
      },
      {
        name: 'Community Learning Center',
        address: {
          street: '789 Education Blvd',
          city: 'New York',
          state: 'NY',
          zipCode: '10005',
          country: 'India'
        },
        coordinates: {
          latitude: 40.7589,
          longitude: -73.9851
        },
        contactInfo: {
          phone: '+1234567891',
          email: 'info@communitylearning.org',
          website: 'https://communitylearning.org'
        },
        operatingHours: {
          monday: { open: '8:00 AM', close: '8:00 PM' },
          tuesday: { open: '8:00 AM', close: '8:00 PM' },
          wednesday: { open: '8:00 AM', close: '8:00 PM' },
          thursday: { open: '8:00 AM', close: '8:00 PM' },
          friday: { open: '8:00 AM', close: '6:00 PM' },
          saturday: { open: '9:00 AM', close: '4:00 PM' },
          sunday: { open: '10:00 AM', close: '4:00 PM' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'computer_access'],
        capacity: {
          maxBooks: 800,
          currentBooks: 0
        },
        isActive: true,
        addedBy: adminUser._id
      }
    ]);
    console.log(`✅ Created ${libraries.length} partner libraries`);

    // 4. Insert Requests
    console.log('📋 Creating requests...');
    const requests = await Request.insertMany([
      {
        student: studentUser._id,
        book: books[0]._id,
        status: 'Pending',
        requestDate: new Date(),
        approvalDate: null,
        returnDate: null,
        dueDate: null,
        approvedBy: null,
        returnedDate: null
      },
      {
        student: studentUser._id,
        book: books[1]._id,
        status: 'Approved',
        requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        approvalDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        returnDate: null,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        approvedBy: adminUser._id,
        returnedDate: null
      },
      {
        student: studentUser._id,
        book: books[2]._id,
        status: 'Pending',
        requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        approvalDate: null,
        returnDate: null,
        dueDate: null,
        approvedBy: null,
        returnedDate: null
      }
    ]);
    console.log(`✅ Created ${requests.length} requests`);

    // 5. Insert Appointments
    console.log('📅 Creating appointments...');
    const appointments = await Appointment.insertMany([
      {
        user: studentUser._id,
        library: libraries[0]._id,
        appointmentType: 'book_pickup',
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        scheduledTime: '2:00 PM',
        status: 'pending',
        notes: 'Student will pick up requested book',
        books: [],
        contactInfo: {
          phone: studentUser.phone,
          email: studentUser.email
        }
      },
      {
        user: donorUsers[0]._id,
        library: libraries[1]._id,
        appointmentType: 'book_drop_off',
        scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        scheduledTime: '10:00 AM',
        status: 'confirmed',
        notes: 'Donor will drop off additional books',
        books: [],
        contactInfo: {
          phone: donorUsers[0].phone,
          email: donorUsers[0].email
        }
      }
    ]);
    console.log(`✅ Created ${appointments.length} appointments`);

    // Display summary
    console.log('\n📊 Data Insertion Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Books: ${books.length}`);
    console.log(`- Libraries: ${libraries.length}`);
    console.log(`- Requests: ${requests.length}`);
    console.log(`- Appointments: ${appointments.length}`);

    console.log('\n🎉 All data inserted successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Student: john.student@email.com / password123');
    console.log('Donor: sarah.donor@email.com / password123');
    console.log('Admin: mike.librarian@email.com / password123');

  } catch (error) {
    console.error('❌ Error inserting data:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the function
insertDataCorrectly();

