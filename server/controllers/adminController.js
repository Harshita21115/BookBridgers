const User = require('../models/User');
const Book = require('../models/Book');
const Request = require('../models/Request');

// Get admin statistics
const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBooks,
      pendingRequests,
      borrowedBooks
    ] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      Request.countDocuments({ status: 'Pending' }),
      Book.countDocuments({ status: 'Borrowed' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBooks,
        pendingRequests,
        borrowedBooks
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch stats',
      error: error.message 
    });
  }
};

// Get pending requests
const getPendingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: 'Pending' })
      .populate('student', 'fullName email')
      .populate('book', 'title author category')
      .sort({ requestDate: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch pending requests',
      error: error.message 
    });
  }
};

// Get all books for admin
const getBooks = async (req, res) => {
  try {
    const books = await Book.find()
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

// Get all users for admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch users',
      error: error.message 
    });
  }
};

// Update request status
const updateRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    request.approvedBy = req.user._id;
    request.approvalDate = new Date();

    const book = await Book.findById(request.book);

    if (status === 'Approved') {
      book.status = 'Borrowed';
      book.currentBorrower = request.student;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      request.dueDate = dueDate;
    } else if (status === 'Rejected') {
      book.status = 'Available';
    }

    await request.save();
    await book.save();

    await request.populate('student', 'fullName email');
    await request.populate('book', 'title author category');

    res.status(200).json({
      success: true,
      message: `Request ${status.toLowerCase()} successfully`,
      data: request
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update request',
      error: error.message 
    });
  }
};

module.exports = {
  getStats,
  getPendingRequests,
  getBooks,
  getUsers,
  updateRequest
};

