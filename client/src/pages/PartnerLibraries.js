import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import { partnerLibrariesAPI, appointmentsAPI, booksAPI, requestsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const PartnerLibraries = () => {
  const [searchParams] = useSearchParams();
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState([19.0760, 72.8777]); // Default to Mumbai
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedLibraryForSchedule, setSelectedLibraryForSchedule] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [approvedBooks, setApprovedBooks] = useState([]);
  const [scheduleForm, setScheduleForm] = useState({
    scheduledDate: '',
    scheduledTime: '',
    appointmentType: 'book_drop_off',
    notes: '',
    books: [{ bookId: '', condition: 'Good', notes: '' }]
  });
  const { user } = useAuth();

  // Get context from URL parameters
  const urlAppointmentType = searchParams.get('type');
  const fromDonor = searchParams.get('from') === 'donor';
  const fromStudent = searchParams.get('from') === 'student';

  // Determine appointment type based on user role and URL parameters
  const appointmentType = urlAppointmentType ||
    (user?.role === 'student' ? 'book_pickup' :
      user?.role === 'donor' ? 'book_drop_off' :
        'book_drop_off');

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter([location.latitude, location.longitude]);

          // Automatically fetch nearby libraries when location is obtained
          fetchNearbyLibrariesAutomatically(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          // If location access fails, show all libraries
          fetchLibraries();
        }
      );
    } else {
      // If geolocation is not supported, show all libraries
      fetchLibraries();
    }
  };

  const fetchLibraries = async () => {
    try {
      setLoading(true);
      const response = await partnerLibrariesAPI.getAll();
      // Sort libraries by distance if available, otherwise by name
      const sortedLibraries = response.data.data.sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        return a.name.localeCompare(b.name);
      });
      setLibraries(sortedLibraries);
    } catch (error) {
      setError('Failed to fetch partner libraries');
      console.error('Error fetching libraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBooks = useCallback(async () => {
    if (!user) return;

    try {
      if (user.role === 'donor') {
        // Fetch donor's books for drop-off
        const response = await booksAPI.getAll();
        const myBooks = (response.data.data || []).filter(book =>
          book.donor?._id === user._id || book.donor === user._id
        );
        setUserBooks(myBooks);
      } else if (user.role === 'student') {
        // Fetch approved books for pickup
        const response = await requestsAPI.getByUser(user._id);
        const approvedRequests = (response.data.data || []).filter(request =>
          request.status === 'Approved'
        );
        setApprovedBooks(approvedRequests);
      }
    } catch (error) {
      console.error('Error fetching user books:', error);
    }
  }, [user]);

  useEffect(() => {
    getUserLocation(); // This will automatically fetch nearby libraries or fallback to all libraries
    fetchUserBooks();
    fetchAllBooks();
  }, [user]); // Changed dependency from fetchUserBooks to user

  useEffect(() => {
    // Update appointment type based on URL parameters
    setScheduleForm(prev => ({
      ...prev,
      appointmentType: appointmentType
    }));
  }, [appointmentType]);

  const fetchAllBooks = async () => {
    try {
      const response = await booksAPI.getAll();
      setUserBooks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchNearbyLibrariesAutomatically = async (location) => {
    try {
      setLoading(true);
      const response = await partnerLibrariesAPI.findNearest(
        location.latitude,
        location.longitude,
        200, // 200km radius (increased from 50km)
        20   // limit to 20 results
      );

      if (response.data.data && response.data.data.length > 0) {
        setLibraries(response.data.data);
        setShowNearbyOnly(true);
      } else {
        // If no nearby libraries found, show all libraries
        console.log('No nearby libraries found, showing all libraries');
        fetchLibraries();
      }
    } catch (error) {
      setError('Failed to fetch nearby libraries');
      console.error('Error fetching nearby libraries:', error);
      // Fallback to showing all libraries if nearby fetch fails
      fetchLibraries();
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyLibraries = async () => {
    if (!userLocation) {
      alert('Please enable location access to find nearby libraries');
      return;
    }

    try {
      setLoading(true);
      const response = await partnerLibrariesAPI.findNearest(
        userLocation.latitude,
        userLocation.longitude,
        50, // 50km radius
        20  // limit to 20 results
      );
      setLibraries(response.data.data);
      setShowNearbyOnly(true);
    } catch (error) {
      setError('Failed to fetch nearby libraries');
      console.error('Error fetching nearby libraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserNearbyLibraries = async () => {
    try {
      setLoading(true);
      const response = await partnerLibrariesAPI.getUserNearby(25, 10);
      setLibraries(response.data.data);
      setShowNearbyOnly(true);
    } catch (error) {
      setError('Failed to fetch nearby libraries. Please update your profile with location information.');
      console.error('Error fetching user nearby libraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    fetchLibraries();
    setShowNearbyOnly(false);
  };

  const handleScheduleClick = (library) => {
    if (!user) {
      alert('Please login to schedule an appointment');
      return;
    }
    setSelectedLibraryForSchedule(library);
    setShowScheduleModal(true);
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Set initial books based on appointment type and user role
    let initialBooks = [];
    if (appointmentType === 'book_drop_off' && user.role === 'donor') {
      // Pre-populate with donor's books
      initialBooks = userBooks.slice(0, 3).map(book => ({
        bookId: book._id,
        condition: book.condition || 'Good',
        notes: ''
      }));
    } else if (appointmentType === 'book_pickup' && user.role === 'student') {
      // Pre-populate with approved books for pickup
      initialBooks = approvedBooks.slice(0, 3).map(request => ({
        bookId: request.book?._id || '',
        condition: request.book?.condition || 'Good',
        notes: ''
      }));
    }

    if (initialBooks.length === 0) {
      initialBooks = [{ bookId: '', condition: 'Good', notes: '' }];
    }

    setScheduleForm({
      scheduledDate: tomorrow.toISOString().split('T')[0],
      scheduledTime: '',
      appointmentType: appointmentType,
      notes: '',
      books: initialBooks
    });
  };

  const handleDateChange = async (date) => {
    setScheduleForm({ ...scheduleForm, scheduledDate: date, scheduledTime: '' });
    if (selectedLibraryForSchedule && date) {
      try {
        const response = await appointmentsAPI.getAvailableTimeSlots(selectedLibraryForSchedule._id, date);
        setAvailableTimeSlots(response.data.data.timeSlots);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        setAvailableTimeSlots([]);
      }
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        library: selectedLibraryForSchedule._id,
        appointmentType: scheduleForm.appointmentType,
        scheduledDate: new Date(scheduleForm.scheduledDate),
        scheduledTime: scheduleForm.scheduledTime,
        notes: scheduleForm.notes,
        books: scheduleForm.books.filter(book => book.bookId).map(book => ({
          book: book.bookId,
          condition: book.condition,
          notes: book.notes
        }))
      };

      await appointmentsAPI.create(appointmentData);
      alert('Appointment scheduled successfully!');
      setShowScheduleModal(false);
      setSelectedLibraryForSchedule(null);
      setScheduleForm({
        scheduledDate: '',
        scheduledTime: '',
        appointmentType: 'book_drop_off',
        notes: '',
        books: [{ bookId: '', condition: 'Good', notes: '' }]
      });
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert('Failed to schedule appointment. Please try again.');
    }
  };

  const addBookToSchedule = () => {
    setScheduleForm({
      ...scheduleForm,
      books: [...scheduleForm.books, { bookId: '', condition: 'Good', notes: '' }]
    });
  };

  const removeBookFromSchedule = (index) => {
    const newBooks = scheduleForm.books.filter((_, i) => i !== index);
    setScheduleForm({ ...scheduleForm, books: newBooks });
  };

  const updateBookInSchedule = (index, field, value) => {
    const newBooks = [...scheduleForm.books];
    newBooks[index][field] = value;
    setScheduleForm({ ...scheduleForm, books: newBooks });
  };

  const formatOperatingHours = (hours) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map(day => {
      if (hours[day] && hours[day].open && hours[day].close) {
        return `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours[day].open} - ${hours[day].close}`;
      }
      return null;
    }).filter(Boolean).join(', ');
  };

  if (loading) {
    return (
      <main className="page-wrap my-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrap my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title">Partner Libraries</h2>
          <p className="page-subtitle">
            {showNearbyOnly ? 'Libraries near your location' : 'Find libraries near you for book borrowing and study spaces'}
          </p>
        </div>
        <div className="btn-group">
          <button
            className="btn btn-outline-primary"
            onClick={getUserNearbyLibraries}
            disabled={!user}
          >
            Libraries Near Me
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={fetchNearbyLibraries}
          >
            Use Current Location
          </button>
          <button
            className={`btn ${showMap ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
          {showNearbyOnly && (
            <button
              className="btn btn-secondary"
              onClick={resetFilters}
            >
              Show All
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {userLocation && showNearbyOnly && (
        <div className="alert alert-success">
          <strong>📍 Showing libraries near your location:</strong> {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          <br />
          <small>Libraries are sorted by distance from your location.</small>
        </div>
      )}

      {userLocation && !showNearbyOnly && (
        <div className="alert alert-info">
          <strong>Your Location:</strong> {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
        </div>
      )}

      {/* Map Section */}
      {showMap && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Library Locations Map</h5>
            <div style={{ height: '400px', width: '100%' }}>
              <MapContainer
                center={mapCenter}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User Location Marker */}
                {userLocation && (
                  <Marker position={[userLocation.latitude, userLocation.longitude]}>
                    <Popup>
                      <strong>Your Location</strong><br />
                      {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                    </Popup>
                  </Marker>
                )}

                {/* Library Markers */}
                {libraries.map(library => (
                  <Marker
                    key={library._id}
                    position={[library.coordinates.latitude, library.coordinates.longitude]}
                  >
                    <Popup>
                      <div>
                        <h6>{library.name}</h6>
                        <p className="mb-1">
                          <strong>Address:</strong><br />
                          {library.address.street}<br />
                          {library.address.city}, {library.address.state} {library.address.zipCode}
                        </p>
                        {library.contactInfo.phone && (
                          <p className="mb-1"><strong>Phone:</strong> {library.contactInfo.phone}</p>
                        )}
                        {library.distance && (
                          <p className="mb-1 text-primary">
                            <strong>Distance:</strong> {library.distance} km
                          </p>
                        )}
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setSelectedLibrary(library)}
                        >
                          View Details
                        </button>
                        {user && (
                          <button
                            className="btn btn-success btn-sm ms-1"
                            onClick={() => handleScheduleClick(library)}
                          >
                            {appointmentType === 'book_drop_off' ? 'Schedule Drop-off' :
                              appointmentType === 'book_pickup' ? 'Schedule Pickup' :
                                'Schedule Visit'}
                          </button>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        {libraries.map(library => (
          <div key={library._id} className="col-md-6 col-lg-4">
            <div className="card h-100 library-card">
              <div className="card-body">
                <h5 className="card-title">{library.name}</h5>
                <p className="card-text">
                  <strong>Address:</strong><br />
                  {library.address.street}<br />
                  {library.address.city}, {library.address.state} {library.address.zipCode}
                </p>

                {library.distance && (
                  <p className="text-primary">
                    <strong>Distance:</strong> {library.distance} km away
                  </p>
                )}

                {library.contactInfo && (
                  <div className="mb-2">
                    {library.contactInfo.phone && (
                      <p className="mb-1"><strong>Phone:</strong> {library.contactInfo.phone}</p>
                    )}
                    {library.contactInfo.email && (
                      <p className="mb-1"><strong>Email:</strong> {library.contactInfo.email}</p>
                    )}
                  </div>
                )}

                {library.operatingHours && (
                  <div className="mb-2">
                    <strong>Hours:</strong><br />
                    <small className="text-muted">{formatOperatingHours(library.operatingHours)}</small>
                  </div>
                )}

                {library.services && library.services.length > 0 && (
                  <div className="mb-2">
                    <strong>Services:</strong><br />
                    <div className="d-flex flex-wrap gap-1">
                      {library.services.map((service, index) => (
                        <span key={index} className="badge bg-primary">
                          {service.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto">
                  <small className="text-muted">
                    <strong>Capacity:</strong> {library.capacity.currentBooks}/{library.capacity.maxBooks} books
                  </small>
                </div>
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-primary btn-sm w-100 mb-2"
                  onClick={() => setSelectedLibrary(library)}
                >
                  View Details
                </button>
                {user && (
                  <button
                    className="btn btn-success btn-sm w-100"
                    onClick={() => handleScheduleClick(library)}
                  >
                    {appointmentType === 'book_drop_off' ? 'Schedule Drop-off' :
                      appointmentType === 'book_pickup' ? 'Schedule Pickup' :
                        'Schedule Visit'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {libraries.length === 0 && !loading && (
        <div className="text-center py-5">
          <h4>No libraries found</h4>
          <p className="text-muted">Try adjusting your search criteria or location settings.</p>
        </div>
      )}

      {/* Library Details Modal */}
      {selectedLibrary && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedLibrary.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedLibrary(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Address</h6>
                    <p>
                      {selectedLibrary.address.street}<br />
                      {selectedLibrary.address.city}, {selectedLibrary.address.state} {selectedLibrary.address.zipCode}<br />
                      {selectedLibrary.address.country}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>Contact Information</h6>
                    {selectedLibrary.contactInfo.phone && (
                      <p><strong>Phone:</strong> {selectedLibrary.contactInfo.phone}</p>
                    )}
                    {selectedLibrary.contactInfo.email && (
                      <p><strong>Email:</strong> {selectedLibrary.contactInfo.email}</p>
                    )}
                    {selectedLibrary.contactInfo.website && (
                      <p><strong>Website:</strong> <a href={selectedLibrary.contactInfo.website} target="_blank" rel="noopener noreferrer">{selectedLibrary.contactInfo.website}</a></p>
                    )}
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <h6>Operating Hours</h6>
                    <div className="small">
                      {formatOperatingHours(selectedLibrary.operatingHours).split(', ').map((hours, index) => (
                        <div key={index}>{hours}</div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6>Services Available</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {selectedLibrary.services.map((service, index) => (
                        <span key={index} className="badge bg-primary">
                          {service.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedLibrary.distance && (
                  <div className="mt-3">
                    <h6>Distance</h6>
                    <p className="text-primary"><strong>{selectedLibrary.distance} km</strong> from your location</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedLibrary(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    // You can add navigation to library website or contact functionality here
                    if (selectedLibrary.contactInfo.website) {
                      window.open(selectedLibrary.contactInfo.website, '_blank');
                    }
                  }}
                >
                  Visit Website
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Appointment Modal */}
      {showScheduleModal && selectedLibraryForSchedule && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {appointmentType === 'book_drop_off' ? 'Schedule Book Drop-off' :
                    appointmentType === 'book_pickup' ? 'Schedule Book Pickup' :
                      'Schedule Library Visit'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowScheduleModal(false)}
                ></button>
              </div>
              <form onSubmit={handleScheduleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <h6>Library: {selectedLibraryForSchedule.name}</h6>
                    <p className="text-muted mb-0">
                      {selectedLibraryForSchedule.address.street}, {selectedLibraryForSchedule.address.city}
                    </p>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Appointment Type</label>
                        <select
                          className="form-select"
                          value={scheduleForm.appointmentType}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, appointmentType: e.target.value })}
                          disabled={fromDonor || fromStudent}
                        >
                          <option value="book_drop_off">Book Drop-off</option>
                          <option value="book_pickup">Book Pickup</option>
                          <option value="visit">Library Visit</option>
                        </select>
                        {(fromDonor || fromStudent) && (
                          <small className="text-muted">
                            {fromDonor ? 'Appointment type set to Drop-off from donor dashboard' :
                              fromStudent ? 'Appointment type set to Pickup from student dashboard' : ''}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={scheduleForm.scheduledDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Available Time Slots</label>
                    <div className="row">
                      {availableTimeSlots.map((slot, index) => (
                        <div key={index} className="col-md-3 mb-2">
                          <button
                            type="button"
                            className={`btn btn-sm w-100 ${slot.available ? 'btn-outline-primary' : 'btn-secondary'}`}
                            disabled={!slot.available}
                            onClick={() => setScheduleForm({ ...scheduleForm, scheduledTime: slot.time })}
                            style={{
                              backgroundColor: scheduleForm.scheduledTime === slot.time ? '#007bff' : '',
                              color: scheduleForm.scheduledTime === slot.time ? 'white' : ''
                            }}
                          >
                            {slot.time}
                          </button>
                        </div>
                      ))}
                    </div>
                    {availableTimeSlots.length === 0 && scheduleForm.scheduledDate && (
                      <p className="text-muted">No available time slots for this date.</p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      {appointmentType === 'book_drop_off' ? 'Books to Drop-off' :
                        appointmentType === 'book_pickup' ? 'Books to Pickup' :
                          'Books'}
                    </label>
                    {appointmentType === 'book_drop_off' && user.role === 'donor' && userBooks.length > 0 && (
                      <div className="alert alert-info mb-3">
                        <small>
                          <strong>Your Books:</strong> Pre-populated with your donated books.
                          You can modify or add more books below.
                        </small>
                      </div>
                    )}
                    {appointmentType === 'book_pickup' && user.role === 'student' && approvedBooks.length > 0 && (
                      <div className="alert alert-success mb-3">
                        <small>
                          <strong>Approved Books:</strong> Pre-populated with your approved book requests.
                          You can modify the list below.
                        </small>
                      </div>
                    )}
                    {scheduleForm.books.map((book, index) => (
                      <div key={index} className="row mb-2">
                        <div className="col-md-5">
                          <select
                            className="form-select"
                            value={book.bookId}
                            onChange={(e) => updateBookInSchedule(index, 'bookId', e.target.value)}
                            required
                          >
                            <option value="">Select a book...</option>
                            {appointmentType === 'book_drop_off' && user.role === 'donor' ? (
                              userBooks.map(bookOption => (
                                <option key={bookOption._id} value={bookOption._id}>
                                  {bookOption.title} by {bookOption.author}
                                </option>
                              ))
                            ) : appointmentType === 'book_pickup' && user.role === 'student' ? (
                              approvedBooks.length > 0 ? (
                                approvedBooks.map(request => (
                                  <option key={request.book?._id} value={request.book?._id}>
                                    {request.book?.title} by {request.book?.author}
                                  </option>
                                ))
                              ) : (
                                <option disabled>No approved books found</option>
                              )
                            ) : (
                              userBooks.map(bookOption => (
                                <option key={bookOption._id} value={bookOption._id}>
                                  {bookOption.title} by {bookOption.author}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <select
                            className="form-select"
                            value={book.condition}
                            onChange={(e) => updateBookInSchedule(index, 'condition', e.target.value)}
                          >
                            <option value="New">New</option>
                            <option value="Like New">Like New</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Notes (optional)"
                            value={book.notes}
                            onChange={(e) => updateBookInSchedule(index, 'notes', e.target.value)}
                          />
                        </div>
                        <div className="col-md-1">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeBookFromSchedule(index)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={addBookToSchedule}
                    >
                      + Add Another Book
                    </button>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Additional Notes</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Any special instructions or notes..."
                      value={scheduleForm.notes}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowScheduleModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={!scheduleForm.scheduledDate || !scheduleForm.scheduledTime}
                  >
                    {appointmentType === 'book_drop_off' ? 'Schedule Drop-off' :
                      appointmentType === 'book_pickup' ? 'Schedule Pickup' :
                        'Schedule Appointment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PartnerLibraries;
