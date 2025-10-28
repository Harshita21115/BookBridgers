const express = require('express');
const router = express.Router();
const {
  getStats,
  getPendingRequests,
  getBooks,
  getUsers,
  updateRequest
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getStats);
router.get('/pending-requests', getPendingRequests);
router.get('/books', getBooks);
router.get('/users', getUsers);
router.put('/requests/:id', updateRequest);

module.exports = router;

