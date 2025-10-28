const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('../models/Book');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library-management';

async function updateBooks() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const updates = [
      { 
        title: 'Introduction to Algorithms', 
        rating: 5, 
        price: 'Free', 
        condition: 'Like New',
        imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400'
      },
      { 
        title: 'Modern Physics', 
        rating: 4, 
        price: 'Free', 
        condition: 'Good',
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
      },
      { 
        title: 'Clean Code', 
        rating: 5, 
        price: 'Free', 
        condition: 'New',
        imageUrl: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400'
      },
      { 
        title: 'The Alchemist', 
        rating: 4, 
        price: 'Free', 
        condition: 'Good',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
      },
      { 
        title: 'JavaScript: The Good Parts', 
        rating: 4, 
        price: 'Free', 
        condition: 'Fair',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'
      }
    ];

    for (const update of updates) {
      await Book.updateOne({ title: update.title }, { 
        $set: { 
          rating: update.rating, 
          price: update.price, 
          condition: update.condition,
          imageUrl: update.imageUrl
        } 
      });
      console.log(`Updated: ${update.title}`);
    }

    console.log('\nAll books updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating books:', error);
    process.exit(1);
  }
}

updateBooks();
