const Request = require('../models/Request');
const Book = require('../models/Book');

// Get all requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('student', 'fullName email')
      .populate('book', 'title author category')
      .populate('approvedBy', 'fullName')
      .sort({ requestDate: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch requests',
      error: error.message 
    });
  }
};

// Get requests by user
const getMyRequests = async (req, res) => {
  try {
    // Use userId from params if provided, otherwise use authenticated user
    const userId = req.params.userId || req.user._id;
    
    const requests = await Request.find({ student: userId })
      .populate('book', 'title author category status')
      .populate('approvedBy', 'fullName')
      .sort({ requestDate: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch requests',
      error: error.message 
    });
  }
};

// Create borrow request
const createRequest = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.status !== 'Available') {
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }

    // Check if user already has a pending request for this book
    const existingRequest = await Request.findOne({
      student: req.user._id,
      book: bookId,
      status: 'Pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this book' });
    }

    // Create request
    const request = await Request.create({
      student: req.user._id,
      book: bookId
    });

    // Update book status
    book.status = 'Requested';
    await book.save();

    await request.populate('book', 'title author category');
    await request.populate('student', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: request
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to create request',
      error: error.message 
    });
  }
};

// Update request status
const updateRequestStatus = async (req, res) => {
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
      dueDate.setDate(dueDate.getDate() + 14); // 14 days from approval
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

// Return book
const returnBook = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'Approved') {
      return res.status(400).json({ message: 'Book is not currently borrowed' });
    }

    const book = await Book.findById(request.book);
    book.status = 'Available';
    book.currentBorrower = null;
    await book.save();

    request.status = 'Returned';
    request.returnedDate = new Date();
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to return book',
      error: error.message 
    });
  }
};

module.exports = {
  getAllRequests,
  getMyRequests,
  createRequest,
  updateRequestStatus,
  returnBook
};

