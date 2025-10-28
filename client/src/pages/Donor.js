import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { booksAPI } from '../services/api';
import { getDefaultBookImage, handleImageError, compressImage, validateImageFile } from '../utils/imageUtils';

const Donor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: 'Other',
    description: '',
    condition: 'Good',
    price: 'Free',
    rating: 3,
    imageUrl: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      // Filter books for current user (donor)
      const myBooks = (response.data.data || []).filter(book => 
        book.donor?._id === user?._id || book.donor === user?._id
      );
      setBooks(myBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate the image file
      const validation = validateImageFile(file, 2);
      if (!validation.isValid) {
        alert(validation.message);
        e.target.value = ''; // Clear the input
        return;
      }

      setSelectedImage(file);
      
      try {
        // Compress the image
        const compressedImage = await compressImage(file, 800, 0.7);
        setImagePreview(compressedImage);
        setNewBook({ ...newBook, imageUrl: compressedImage });
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process image. Please try again.');
        e.target.value = ''; // Clear the input
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: value
    });
  };

  const handleRatingChange = (rating) => {
    setNewBook({ ...newBook, rating });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating book with data:', newBook);
      const response = await booksAPI.create(newBook);
      console.log('Book created successfully:', response.data);
      if (response.data) {
        alert('Book added successfully!');
        setShowAddModal(false);
        resetForm();
        fetchBooks();
      }
    } catch (error) {
      console.error('Error creating book:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Unknown error';
      alert('Failed to add book: ' + errorMsg);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to remove this book?')) {
      try {
        await booksAPI.delete(bookId);
        alert('Book removed successfully!');
        fetchBooks();
      } catch (error) {
        alert('Failed to remove book');
      }
    }
  };

  const resetForm = () => {
    setNewBook({
      title: '',
      author: '',
      category: 'Other',
      description: '',
      condition: 'Good',
      price: 'Free',
      rating: 3,
      imageUrl: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleAccountUpdate = (e) => {
    e.preventDefault();
    alert('Account updated successfully!');
  };

  const handleAccountChange = (e) => {
    // This function can be implemented later for profile updates
  };

  const getStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <main className="page-wrap my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
      <h2 className="page-title">Donor Dashboard</h2>
      <p className="page-subtitle">Donate books and help students access learning materials.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add New Book
        </button>
      </div>

      <div className="row">
        {/* Left Column: Filter + Account */}
        <div className="col-md-3">
          {/* Stats Box */}
          <div className="card filter-box mb-4">
            <div className="card-body">
              <h5 className="card-title">My Books</h5>
              <p className="text-muted">Total: {books.length} books</p>
              <hr />

              <button 
                className="btn btn-primary w-100"
                onClick={() => navigate('/partner-libraries?type=book_drop_off&from=donor')}
              >
                Donate
              </button>
            </div>
          </div>

          {/* Account Details */}
          <div className="card account-card">
            <div className="card-body">
              <h4 className="card-title">Account Details</h4>
              <div className="text-center mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1740252117070-7aa2955b25f8?q=80&w=100&h=100&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Profile" 
                  className="rounded-circle" 
                  style={{width: '80px', height: '80px', objectFit: 'cover'}}
                />
              </div>
              <p className="text-center"><strong>{user?.fullName}</strong></p>
              <p className="text-center text-muted">{user?.email}</p>
              <hr />
              <button className="btn btn-outline-secondary w-100">Edit Profile</button>
            </div>
          </div>
        </div>

        {/* Right Column: Books Grid */}
        <div className="col-md-9">
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center my-5">
              <p>No books added yet. Click "Add New Book" to start donating!</p>
            </div>
          ) : (
          <div className="row g-4">
            {books.map(book => (
                <div key={book._id} className="col-md-4">
                <div className="card book-card donor-book-card h-100">
                    <img 
                      src={book.imageUrl || getDefaultBookImage()} 
                      className="card-img-top" 
                      alt={book.title} 
                      onError={(e) => handleImageError(e)}
                    />
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{book.title}</h6>
                    <p className="card-text text-muted">{book.author}</p>
                      {book.price && <p className="text-primary fw-bold">{book.price}</p>}
                      {book.rating > 0 && (
                        <div className="mb-2">
                          <span className="text-warning">{getStars(book.rating)}</span>
                          <span className="text-muted ms-1">({book.rating}/5)</span>
                        </div>
                      )}
                    <span className="badge bg-secondary mb-2">{book.category}</span>
                      <span className="badge bg-info mb-2">{book.condition}</span>
                    <div className="mt-auto">
                      <button className="btn btn-outline-primary btn-sm me-2">Edit</button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteBook(book._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Book</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddBook}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Book Title *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="title"
                          value={newBook.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Author *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="author"
                          value={newBook.author}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Category *</label>
                        <select 
                          className="form-select"
                          name="category"
                          value={newBook.category}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="Science">Science</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Literature">Literature</option>
                          <option value="Technology">Technology</option>
                          <option value="History">History</option>
                          <option value="Philosophy">Philosophy</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Condition *</label>
                        <select 
                          className="form-select"
                          name="condition"
                          value={newBook.condition}
                          onChange={handleInputChange}
                        >
                          <option value="New">New</option>
                          <option value="Like New">Like New</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Poor">Poor</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="price"
                          value={newBook.price}
                          onChange={handleInputChange}
                          placeholder="₹100"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Book Rating</label>
                        <div>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="btn btn-link p-0 me-1"
                              onClick={() => handleRatingChange(star)}
                              onMouseEnter={(e) => e.target.style.color = '#ffc107'}
                              onMouseLeave={(e) => e.target.style.color = star <= newBook.rating ? '#ffc107' : '#ddd'}
                              style={{ color: star <= newBook.rating ? '#ffc107' : '#ddd', fontSize: '1.5rem' }}
                            >
                              ★
                            </button>
                          ))}
                          <span className="ms-2 text-muted">({newBook.rating}/5)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      name="description"
                      value={newBook.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Book Image <small className="text-muted">(Max 2MB)</small></label>
                    <input 
                      type="file" 
                      className="form-control" 
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                    <small className="text-muted">Supported formats: JPG, PNG, GIF. Large images will be automatically compressed.</small>
                    {imagePreview ? (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                          className="border rounded"
                        />
                      </div>
                    ) : (
                      <div className="mt-2">
                        <img 
                          src={getDefaultBookImage()} 
                          alt="Default Book Cover" 
                          style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                          className="border rounded"
                        />
                        <p className="text-muted mt-1 small">No image selected - default cover will be used</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Add Book</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Donor;
