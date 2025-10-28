const express = require('express');
const router = express.Router();
const {
  getAllRequests,
  getMyRequests,
  createRequest,
  updateRequestStatus,
  returnBook
} = require('../controllers/requestController');
const { protect, restrictTo } = require('../middleware/auth');

router.route('/')
  .get(protect, getAllRequests)
  .post(protect, restrictTo('student'), createRequest);

router.get('/user/:userId', protect, getMyRequests);

router.route('/:id/status')
  .put(protect, restrictTo('admin'), updateRequestStatus);

router.route('/:id/return')
  .put(protect, restrictTo('student'), returnBook);

module.exports = router;

