const mongoose = require('mongoose');
const Book = require('./models/Book');
require('dotenv').config();

async function addBookImages() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Sample book cover images (using placeholder services)
        const bookImages = {
            'Introduction to Computer Science': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop',
            'Data Structures and Algorithms': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=400&fit=crop',
            'The Great Gatsby': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
            'Calculus: Early Transcendentals': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=400&fit=crop',
            'Introduction to Psychology': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=400&fit=crop',
            'Organic Chemistry': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&h=400&fit=crop',
            'World History: A Comprehensive Guide': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
            'Business Management Fundamentals': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'
        };

        // Update books with images
        console.log('🖼️ Adding book cover images...');

        for (const [title, imageUrl] of Object.entries(bookImages)) {
            const result = await Book.updateOne(
                { title: title },
                { imageUrl: imageUrl }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ Updated: ${title}`);
            } else {
                console.log(`⚠️ Not found: ${title}`);
            }
        }

        // Verify updates
        console.log('\n📚 Updated books with images:');
        const booksWithImages = await Book.find({ imageUrl: { $ne: null } }, { title: 1, imageUrl: 1 });
        booksWithImages.forEach(book => {
            console.log(`- ${book.title}: ${book.imageUrl ? '✅ Has image' : '❌ No image'}`);
        });

        console.log('\n🎉 Book images added successfully!');
        console.log('🔄 Refresh your browser to see the images.');

    } catch (error) {
        console.error('❌ Error adding book images:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the function
addBookImages();

