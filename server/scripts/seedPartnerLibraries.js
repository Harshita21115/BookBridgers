const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PartnerLibrary = require('../models/PartnerLibrary');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library-management';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    seedPartnerLibraries();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

const seedPartnerLibraries = async () => {
  try {
    // Clear existing partner libraries
    await PartnerLibrary.deleteMany({});
    console.log('Cleared existing partner libraries');

    // Find an admin user to assign as the creator
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    // Sample partner libraries data
    const partnerLibraries = [
      {
        name: 'Central Public Library',
        address: {
          street: '123 MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        coordinates: {
          latitude: 19.0760,
          longitude: 72.8777
        },
        contactInfo: {
          phone: '+91-22-12345678',
          email: 'central@mumbai.gov.in',
          website: 'https://mumbai.gov.in/library'
        },
        operatingHours: {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '10:00', close: '16:00' },
          sunday: { open: '10:00', close: '16:00' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'computer_access', 'printing'],
        capacity: {
          maxBooks: 5000,
          currentBooks: 3200
        },
        addedBy: adminUser._id
      },
      {
        name: 'Mumbai University Library',
        address: {
          street: 'Vidyanagari Campus',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400098',
          country: 'India'
        },
        coordinates: {
          latitude: 19.0225,
          longitude: 72.8554
        },
        contactInfo: {
          phone: '+91-22-26526000',
          email: 'library@mu.ac.in',
          website: 'https://mu.ac.in/library'
        },
        operatingHours: {
          monday: { open: '08:30', close: '19:30' },
          tuesday: { open: '08:30', close: '19:30' },
          wednesday: { open: '08:30', close: '19:30' },
          thursday: { open: '08:30', close: '19:30' },
          friday: { open: '08:30', close: '19:30' },
          saturday: { open: '09:00', close: '17:00' },
          sunday: { open: '09:00', close: '17:00' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'computer_access', 'printing', 'events'],
        capacity: {
          maxBooks: 8000,
          currentBooks: 6200
        },
        addedBy: adminUser._id
      },
      {
        name: 'Bandra West Community Library',
        address: {
          street: 'Hill Road, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400050',
          country: 'India'
        },
        coordinates: {
          latitude: 19.0544,
          longitude: 72.8406
        },
        contactInfo: {
          phone: '+91-22-26401234',
          email: 'bandra@mumbai.gov.in',
          website: 'https://mumbai.gov.in/bandra-library'
        },
        operatingHours: {
          monday: { open: '10:00', close: '18:00' },
          tuesday: { open: '10:00', close: '18:00' },
          wednesday: { open: '10:00', close: '18:00' },
          thursday: { open: '10:00', close: '18:00' },
          friday: { open: '10:00', close: '18:00' },
          saturday: { open: '10:00', close: '16:00' },
          sunday: { open: '10:00', close: '16:00' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'events'],
        capacity: {
          maxBooks: 2000,
          currentBooks: 1450
        },
        addedBy: adminUser._id
      },
      {
        name: 'Andheri East Public Library',
        address: {
          street: 'JP Road, Andheri East',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400069',
          country: 'India'
        },
        coordinates: {
          latitude: 19.1136,
          longitude: 72.8697
        },
        contactInfo: {
          phone: '+91-22-26801234',
          email: 'andheri@mumbai.gov.in',
          website: 'https://mumbai.gov.in/andheri-library'
        },
        operatingHours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: { open: '10:00', close: '15:00' },
          sunday: { open: '10:00', close: '15:00' }
        },
        services: ['book_borrowing', 'study_space', 'computer_access', 'printing'],
        capacity: {
          maxBooks: 1500,
          currentBooks: 980
        },
        addedBy: adminUser._id
      },
      {
        name: 'Delhi University Library',
        address: {
          street: 'North Campus',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110007',
          country: 'India'
        },
        coordinates: {
          latitude: 28.7041,
          longitude: 77.1025
        },
        contactInfo: {
          phone: '+91-11-27667891',
          email: 'library@du.ac.in',
          website: 'https://du.ac.in/library'
        },
        operatingHours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '20:00' },
          saturday: { open: '09:00', close: '17:00' },
          sunday: { open: '09:00', close: '17:00' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'computer_access', 'printing', 'events'],
        capacity: {
          maxBooks: 10000,
          currentBooks: 8500
        },
        addedBy: adminUser._id
      },
      {
        name: 'Bangalore City Library',
        address: {
          street: '456 Brigade Road',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India'
        },
        coordinates: {
          latitude: 12.9716,
          longitude: 77.5946
        },
        contactInfo: {
          phone: '+91-80-25588123',
          email: 'info@bangalorelibrary.gov.in',
          website: 'https://bangalore.gov.in/library'
        },
        operatingHours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '19:00' },
          saturday: { open: '10:00', close: '17:00' },
          sunday: { open: '10:00', close: '17:00' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'computer_access'],
        capacity: {
          maxBooks: 3000,
          currentBooks: 2100
        },
        addedBy: adminUser._id
      },
      {
        name: 'Chennai Central Library',
        address: {
          street: '789 Anna Salai',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipCode: '600002',
          country: 'India'
        },
        coordinates: {
          latitude: 13.0827,
          longitude: 80.2707
        },
        contactInfo: {
          phone: '+91-44-28554433',
          email: 'central@chennai.gov.in',
          website: 'https://chennai.gov.in/library'
        },
        operatingHours: {
          monday: { open: '08:30', close: '18:30' },
          tuesday: { open: '08:30', close: '18:30' },
          wednesday: { open: '08:30', close: '18:30' },
          thursday: { open: '08:30', close: '18:30' },
          friday: { open: '08:30', close: '18:30' },
          saturday: { open: '09:00', close: '16:00' },
          sunday: { open: '09:00', close: '16:00' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'printing', 'events'],
        capacity: {
          maxBooks: 4000,
          currentBooks: 2800
        },
        addedBy: adminUser._id
      },
      {
        name: 'Kolkata Public Library',
        address: {
          street: '321 Park Street',
          city: 'Kolkata',
          state: 'West Bengal',
          zipCode: '700016',
          country: 'India'
        },
        coordinates: {
          latitude: 22.5726,
          longitude: 88.3639
        },
        contactInfo: {
          phone: '+91-33-22234567',
          email: 'public@kolkata.gov.in',
          website: 'https://kolkata.gov.in/library'
        },
        operatingHours: {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '10:00', close: '16:00' },
          sunday: { open: '10:00', close: '16:00' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'computer_access'],
        capacity: {
          maxBooks: 2500,
          currentBooks: 1800
        },
        addedBy: adminUser._id
      },
      {
        name: 'Hyderabad City Library',
        address: {
          street: '654 Charminar Road',
          city: 'Hyderabad',
          state: 'Telangana',
          zipCode: '500002',
          country: 'India'
        },
        coordinates: {
          latitude: 17.3850,
          longitude: 78.4867
        },
        contactInfo: {
          phone: '+91-40-23456789',
          email: 'city@hyderabad.gov.in',
          website: 'https://hyderabad.gov.in/library'
        },
        operatingHours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '19:00' },
          saturday: { open: '10:00', close: '17:00' },
          sunday: { open: '10:00', close: '17:00' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'computer_access', 'printing'],
        capacity: {
          maxBooks: 3500,
          currentBooks: 2400
        },
        addedBy: adminUser._id
      },
      // Additional Mumbai Libraries
      {
        name: 'Powai Community Library',
        address: {
          street: 'Hiranandani Gardens, Powai',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400076',
          country: 'India'
        },
        coordinates: {
          latitude: 19.1176,
          longitude: 72.9060
        },
        contactInfo: {
          phone: '+91-22-25701234',
          email: 'powai@mumbai.gov.in',
          website: 'https://mumbai.gov.in/powai-library'
        },
        operatingHours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '19:00' },
          saturday: { open: '10:00', close: '18:00' },
          sunday: { open: '10:00', close: '18:00' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'computer_access', 'printing', 'events'],
        capacity: {
          maxBooks: 3000,
          currentBooks: 2200
        },
        addedBy: adminUser._id
      },
      {
        name: 'Thane Municipal Library',
        address: {
          street: 'Naupada, Thane West',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400602',
          country: 'India'
        },
        coordinates: {
          latitude: 19.2183,
          longitude: 72.9781
        },
        contactInfo: {
          phone: '+91-22-25331234',
          email: 'thane@mumbai.gov.in',
          website: 'https://mumbai.gov.in/thane-library'
        },
        operatingHours: {
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { open: '08:00', close: '18:00' },
          saturday: { open: '09:00', close: '17:00' },
          sunday: { open: '09:00', close: '17:00' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'computer_access'],
        capacity: {
          maxBooks: 2500,
          currentBooks: 1800
        },
        addedBy: adminUser._id
      },
      // Libraries from other Indian cities
      {
        name: 'Pune Central Library',
        address: {
          street: 'Shivajinagar, Pune',
          city: 'Pune',
          state: 'Maharashtra',
          zipCode: '411005',
          country: 'India'
        },
        coordinates: {
          latitude: 18.5204,
          longitude: 73.8567
        },
        contactInfo: {
          phone: '+91-20-25501234',
          email: 'central@pune.gov.in',
          website: 'https://pune.gov.in/library'
        },
        operatingHours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '19:00' },
          saturday: { open: '10:00', close: '17:00' },
          sunday: { open: '10:00', close: '17:00' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'computer_access', 'printing', 'events'],
        capacity: {
          maxBooks: 4000,
          currentBooks: 3200
        },
        addedBy: adminUser._id
      },
      {
        name: 'Ahmedabad City Library',
        address: {
          street: 'Ellis Bridge, Ahmedabad',
          city: 'Ahmedabad',
          state: 'Gujarat',
          zipCode: '380006',
          country: 'India'
        },
        coordinates: {
          latitude: 23.0225,
          longitude: 72.5714
        },
        contactInfo: {
          phone: '+91-79-26551234',
          email: 'city@ahmedabad.gov.in',
          website: 'https://ahmedabad.gov.in/library'
        },
        operatingHours: {
          monday: { open: '08:30', close: '18:30' },
          tuesday: { open: '08:30', close: '18:30' },
          wednesday: { open: '08:30', close: '18:30' },
          thursday: { open: '08:30', close: '18:30' },
          friday: { open: '08:30', close: '18:30' },
          saturday: { open: '09:00', close: '17:00' },
          sunday: { open: '09:00', close: '17:00' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'computer_access', 'printing'],
        capacity: {
          maxBooks: 3500,
          currentBooks: 2600
        },
        addedBy: adminUser._id
      },
      {
        name: 'Jaipur Public Library',
        address: {
          street: 'C-Scheme, Jaipur',
          city: 'Jaipur',
          state: 'Rajasthan',
          zipCode: '302001',
          country: 'India'
        },
        coordinates: {
          latitude: 26.9124,
          longitude: 75.7873
        },
        contactInfo: {
          phone: '+91-141-2371234',
          email: 'public@jaipur.gov.in',
          website: 'https://jaipur.gov.in/library'
        },
        operatingHours: {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '10:00', close: '16:00' },
          sunday: { open: '10:00', close: '16:00' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'computer_access', 'events'],
        capacity: {
          maxBooks: 2800,
          currentBooks: 2100
        },
        addedBy: adminUser._id
      },
      {
        name: 'Kochi Central Library',
        address: {
          street: 'Marine Drive, Kochi',
          city: 'Kochi',
          state: 'Kerala',
          zipCode: '682031',
          country: 'India'
        },
        coordinates: {
          latitude: 9.9312,
          longitude: 76.2673
        },
        contactInfo: {
          phone: '+91-484-2381234',
          email: 'central@kochi.gov.in',
          website: 'https://kochi.gov.in/library'
        },
        operatingHours: {
          monday: { open: '08:00', close: '19:00' },
          tuesday: { open: '08:00', close: '19:00' },
          wednesday: { open: '08:00', close: '19:00' },
          thursday: { open: '08:00', close: '19:00' },
          friday: { open: '08:00', close: '19:00' },
          saturday: { open: '09:00', close: '18:00' },
          sunday: { open: '09:00', close: '18:00' }
        },
        services: ['book_borrowing', 'digital_resources', 'study_space', 'computer_access', 'printing', 'events'],
        capacity: {
          maxBooks: 3200,
          currentBooks: 2400
        },
        addedBy: adminUser._id
      }
    ];

    // Insert partner libraries
    const createdLibraries = await PartnerLibrary.insertMany(partnerLibraries);
    console.log(`Created ${createdLibraries.length} partner libraries`);

    console.log('Partner libraries seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding partner libraries:', error);
    process.exit(1);
  }
};
