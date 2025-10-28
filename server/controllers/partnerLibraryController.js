const PartnerLibrary = require('../models/PartnerLibrary');
const User = require('../models/User');

// Get all partner libraries
const getAllPartnerLibraries = async (req, res) => {
  try {
    const { city, state, limit = 50 } = req.query;
    let query = { isActive: true };

    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }
    if (state) {
      query['address.state'] = new RegExp(state, 'i');
    }

    const libraries = await PartnerLibrary.find(query)
      .populate('addedBy', 'fullName email')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: libraries.length,
      data: libraries
    });
  } catch (error) {
    console.error('Error fetching partner libraries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partner libraries',
      error: error.message
    });
  }
};

// Get partner library by ID
const getPartnerLibraryById = async (req, res) => {
  try {
    const library = await PartnerLibrary.findById(req.params.id)
      .populate('addedBy', 'fullName email');

    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Partner library not found'
      });
    }

    res.status(200).json({
      success: true,
      data: library
    });
  } catch (error) {
    console.error('Error fetching partner library:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partner library',
      error: error.message
    });
  }
};

// Create new partner library
const createPartnerLibrary = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    req.body.addedBy = req.user._id;
    const library = await PartnerLibrary.create(req.body);

    res.status(201).json({
      success: true,
      data: library
    });
  } catch (error) {
    console.error('Error creating partner library:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create partner library',
      error: error.message
    });
  }
};

// Update partner library
const updatePartnerLibrary = async (req, res) => {
  try {
    const library = await PartnerLibrary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('addedBy', 'fullName email');

    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Partner library not found'
      });
    }

    res.status(200).json({
      success: true,
      data: library
    });
  } catch (error) {
    console.error('Error updating partner library:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update partner library',
      error: error.message
    });
  }
};

// Delete partner library
const deletePartnerLibrary = async (req, res) => {
  try {
    const library = await PartnerLibrary.findByIdAndDelete(req.params.id);

    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Partner library not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Partner library deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting partner library:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete partner library',
      error: error.message
    });
  }
};

// Find nearest partner libraries
const findNearestLibraries = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 50, limit = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const distance = parseFloat(maxDistance);

    // Get all active libraries and filter by distance
    const libraries = await PartnerLibrary.find({
      isActive: true
    })
      .populate('addedBy', 'fullName email');

    // Calculate exact distances and filter by maxDistance
    const librariesWithDistance = libraries
      .map(library => {
        const distanceKm = library.calculateDistance(lat, lng);
        return {
          ...library.toObject(),
          distance: Math.round(distanceKm * 100) / 100 // Round to 2 decimal places
        };
      })
      .filter(library => library.distance <= distance) // Filter by exact distance
      .sort((a, b) => a.distance - b.distance) // Sort by distance
      .slice(0, parseInt(limit)); // Limit results

    res.status(200).json({
      success: true,
      count: librariesWithDistance.length,
      data: librariesWithDistance
    });
  } catch (error) {
    console.error('Error finding nearest libraries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to find nearest libraries',
      error: error.message
    });
  }
};

// Get libraries for user's location
const getLibrariesForUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user.location || !user.location.coordinates ||
      user.location.coordinates.latitude === null ||
      user.location.coordinates.longitude === null ||
      user.location.coordinates.latitude === undefined ||
      user.location.coordinates.longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'User location not set. Please update your profile with location information.'
      });
    }

    const { latitude, longitude } = user.location.coordinates;
    const { maxDistance = 25, limit = 10 } = req.query;

    // Validate coordinates are numbers
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user coordinates. Please update your profile with valid location information.'
      });
    }

    // Find nearby libraries
    const libraries = await PartnerLibrary.find({
      isActive: true,
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: parseFloat(maxDistance) * 1000
        }
      }
    })
      .populate('addedBy', 'fullName email')
      .limit(parseInt(limit));

    // Calculate distances and add user's city/state info
    const librariesWithDistance = libraries.map(library => {
      const distanceKm = library.calculateDistance(latitude, longitude);
      return {
        ...library.toObject(),
        distance: Math.round(distanceKm * 100) / 100,
        userLocation: {
          city: user.location.address.city,
          state: user.location.address.state
        }
      };
    });

    librariesWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      count: librariesWithDistance.length,
      userLocation: user.location.address,
      data: librariesWithDistance
    });
  } catch (error) {
    console.error('Error getting libraries for user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get libraries for user',
      error: error.message
    });
  }
};

module.exports = {
  getAllPartnerLibraries,
  getPartnerLibraryById,
  createPartnerLibrary,
  updatePartnerLibrary,
  deletePartnerLibrary,
  findNearestLibraries,
  getLibrariesForUser
};
