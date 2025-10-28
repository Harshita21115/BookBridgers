const Book = require('../models/Book');
const Request = require('../models/Request');

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const { category, status, donor } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (donor) {
      query.donor = donor;
    }

    const books = await Book.find(query)
      .populate('donor', 'fullName email')
      .populate('currentBorrower', 'fullName email')
      .sort({ addedAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch books',
      error: error.message 
    });
  }
};

// Get single book
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('donor', 'fullName email')
      .populate('currentBorrower', 'fullName email');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch book',
      error: error.message 
    });
  }
};

// Create book
const createBook = async (req, res) => {
  try {
    console.log('Creating book with data:', req.body);
    console.log('User:', req.user);
    
    // Ensure donor is set
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }
    
    req.body.donor = req.user._id;
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create book',
      error: error.message || 'Internal server error'
    });
  }
};

// Update book
const updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to update book',
      error: error.message 
    });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.remove();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to delete book',
      error: error.message 
    });
  }
};

module.exports = {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
};

