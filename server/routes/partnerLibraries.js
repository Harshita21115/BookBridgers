const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllPartnerLibraries,
  getPartnerLibraryById,
  createPartnerLibrary,
  updatePartnerLibrary,
  deletePartnerLibrary,
  findNearestLibraries,
  getLibrariesForUser
} = require('../controllers/partnerLibraryController');

// Public routes
router.get('/', getAllPartnerLibraries);
router.get('/nearest', findNearestLibraries);
router.get('/:id', getPartnerLibraryById);

// Protected routes
router.use(protect); // All routes below require authentication

router.get('/user/nearby', getLibrariesForUser);
router.post('/', createPartnerLibrary);
router.put('/:id', updatePartnerLibrary);
router.delete('/:id', restrictTo('admin'), deletePartnerLibrary);

module.exports = router;
