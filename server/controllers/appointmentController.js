const Appointment = require('../models/Appointment');
const PartnerLibrary = require('../models/PartnerLibrary');
const User = require('../models/User');
const Book = require('../models/Book');
const Request = require('../models/Request');

// Create new appointment
const createAppointment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const appointmentData = {
      ...req.body,
      user: req.user._id
    };

    // Validate library exists
    const library = await PartnerLibrary.findById(appointmentData.library);
    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
      });
    }

    // Check if library is active
    if (!library.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This library is currently not accepting appointments'
      });
    }

    // Validate appointment date is in the future
    const appointmentDate = new Date(appointmentData.scheduledDate);
    if (appointmentDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date must be in the future'
      });
    }

    const appointment = await Appointment.create(appointmentData);

    // Populate the appointment with library, user, and book details
    await appointment.populate([
      { path: 'library', select: 'name address contactInfo operatingHours' },
      { path: 'user', select: 'fullName email' },
      { path: 'books.book', select: 'title author category condition' }
    ]);

    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

// Get user's appointments
const getUserAppointments = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const appointments = await Appointment.find({ user: req.user._id })
      .populate('library', 'name address contactInfo')
      .populate('books.book', 'title author category condition')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

// Get library's appointments (for library staff)
const getLibraryAppointments = async (req, res) => {
  try {
    const { libraryId } = req.params;
    const { date, status } = req.query;

    let query = { library: libraryId };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.scheduledDate = { $gte: startDate, $lt: endDate };
    }

    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('user', 'fullName email phone')
      .populate('library', 'name address')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching library appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch library appointments',
      error: error.message
    });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const appointment = await Appointment.findById(id).populate([
      { path: 'library', select: 'name address contactInfo' },
      { path: 'user', select: 'fullName email' },
      { path: 'books.book', select: 'title author status currentBorrower' }
    ]);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Update appointment status
    appointment.status = status;
    if (notes) {
      appointment.notes = notes;
    }
    await appointment.save();

    // Handle pickup completion - update book and request statuses
    if (status === 'completed' && appointment.appointmentType === 'book_pickup') {
      console.log('Processing pickup completion for appointment:', appointment._id);

      for (const appointmentBook of appointment.books) {
        const book = appointmentBook.book;
        if (book) {
          // Update book status to indicate it's currently borrowed
          book.status = 'Borrowed';
          book.currentBorrower = appointment.user._id;
          await book.save();

          console.log(`Updated book ${book.title} status to Borrowed for user ${appointment.user.fullName}`);

          // Find and update the corresponding request
          const request = await Request.findOne({
            student: appointment.user._id,
            book: book._id,
            status: { $in: ['Approved', 'Pending'] }
          });

          if (request) {
            request.status = 'Borrowed';
            request.returnDate = new Date(); // Set pickup date
            await request.save();

            console.log(`Updated request ${request._id} status to Borrowed`);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message
    });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { status: 'cancelled' },
      { new: true }
    ).populate([
      { path: 'library', select: 'name address contactInfo' },
      { path: 'user', select: 'fullName email' }
    ]);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or you do not have permission to cancel it'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
};

// Get available time slots for a library on a specific date
const getAvailableTimeSlots = async (req, res) => {
  try {
    const { libraryId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const library = await PartnerLibrary.findById(libraryId);
    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
      });
    }

    // Get existing appointments for the date
    const appointmentDate = new Date(date);
    const nextDay = new Date(appointmentDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingAppointments = await Appointment.find({
      library: libraryId,
      scheduledDate: { $gte: appointmentDate, $lt: nextDay },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Generate available time slots based on library hours
    const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const libraryHours = library.operatingHours[dayOfWeek];

    if (!libraryHours || !libraryHours.open || !libraryHours.close) {
      return res.status(400).json({
        success: false,
        message: 'Library is closed on this day'
      });
    }

    // Generate 30-minute time slots
    const timeSlots = [];
    const openTime = libraryHours.open;
    const closeTime = libraryHours.close;

    // Convert 12-hour format to 24-hour format
    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      const [hour, minute] = time.split(':').map(Number);
      let hour24 = hour;

      if (period === 'PM' && hour !== 12) {
        hour24 += 12;
      } else if (period === 'AM' && hour === 12) {
        hour24 = 0;
      }

      return hour24 * 60 + minute;
    };

    const openMinutes = parseTime(openTime);
    const closeMinutes = parseTime(closeTime);

    for (let minutes = openMinutes; minutes < closeMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

      // Check if this time slot is available
      const isBooked = existingAppointments.some(apt => apt.scheduledTime === timeString);

      timeSlots.push({
        time: timeString,
        available: !isBooked
      });
    }

    res.status(200).json({
      success: true,
      data: {
        library: library.name,
        date: date,
        operatingHours: libraryHours,
        timeSlots: timeSlots
      }
    });
  } catch (error) {
    console.error('Error getting available time slots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available time slots',
      error: error.message
    });
  }
};

module.exports = {
  createAppointment,
  getUserAppointments,
  getLibraryAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableTimeSlots
};
