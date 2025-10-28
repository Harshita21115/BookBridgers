const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { protect, restrictTo } = require('../middleware/auth');

router.route('/')
  .get(getAllBooks)
  .post(protect, restrictTo('donor', 'admin'), createBook);

router.route('/:id')
  .get(getBook)
  .put(protect, restrictTo('donor', 'admin'), updateBook)
  .delete(protect, restrictTo('admin'), deleteBook);

module.exports = router;

