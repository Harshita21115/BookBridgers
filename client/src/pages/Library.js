import React, { useState, useEffect, useCallback } from 'react';
import { booksAPI, requestsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { getDefaultBookImage, handleImageError } from '../utils/imageUtils';

const Library = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    status: 'All',
    author: 'All'
  });

  const { user } = useAuth();

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      let filteredBooks = response.data.data || [];
      
      if (filters.category !== 'All') {
        filteredBooks = filteredBooks.filter(book => book.category === filters.category);
      }
      
      if (filters.status !== 'All') {
        filteredBooks = filteredBooks.filter(book => book.status === filters.status);
      }
      
      setBooks(filteredBooks);
    } catch (error) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const selectBook = (book) => {
    setSelectedBook(book);
  };

  const borrowBook = async (book) => {
    if (!user) {
      alert('Please login to borrow books');
      return;
    }

    try {
      await requestsAPI.create({ bookId: book._id });
      alert(`Request sent for "${book.title}"! You will be notified when approved.`);
      
      // Refresh the books list to show updated status
      fetchBooks();
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to send request. Please try again.');
    }
  };

  const addWishlist = (bookName) => {
    alert(`"${bookName}" has been added to your wishlist.`);
  };

  if (loading) {
    return (
      <main className="library-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading books...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="library-page">
      <div className="container">
        <h2>Books Collection</h2>
        <p>Select the book you wish to borrow or add to your wishlist.</p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="filter-section">
        <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})}>
          <option value="All">All Categories</option>
          <option value="Science">Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Literature">Literature</option>
          <option value="Technology">Technology</option>
          <option value="Other">Other</option>
        </select>

        <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
          <option value="All">All Status</option>
          <option value="Available">Available</option>
          <option value="Borrowed">Borrowed</option>
          <option value="Requested">Requested</option>
        </select>
      </div>

      <div className="books-grid">
        {books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-book-open fa-3x text-muted"></i>
            </div>
            <h4 className="mt-3">No Books Found</h4>
            <p className="text-muted">Try adjusting your filters or check back later for new books.</p>
          </div>
        ) : (
          books.map((book) => (
          <div key={book._id} className="book-item" onClick={() => selectBook(book)}>
            <img 
              src={book.imageUrl || getDefaultBookImage()} 
              alt="Book" 
              onError={(e) => handleImageError(e)}
            />
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Category: {book.category}</p>
            <p className={`status ${book.status.toLowerCase()}`}>Status: {book.status}</p>
            
            <div className="book-actions">
              {book.status === 'Available' && (
                <button 
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    borrowBook(book);
                  }}
                >
                  Borrow
                </button>
              )}
              <button 
                className="btn btn-outline-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  addWishlist(book.title);
                }}
              >
                Add to Wishlist
              </button>
            </div>
          </div>
          ))
        )}
      </div>

      {selectedBook && (
        <div className="book-details-modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedBook(null)}>&times;</span>
            <h2>{selectedBook.title}</h2>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Category:</strong> {selectedBook.category}</p>
            <p><strong>Status:</strong> {selectedBook.status}</p>
            {selectedBook.description && (
              <p><strong>Description:</strong> {selectedBook.description}</p>
            )}
          </div>
        </div>
      )}
      </div>
    </main>
  );
};

export default Library;