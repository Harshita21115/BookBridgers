import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { requestsAPI, booksAPI } from '../services/api';

const Student = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [approvedBooks, setApprovedBooks] = useState([]);
  const [currentBorrowedBooks, setCurrentBorrowedBooks] = useState([]);
  const [pastBorrowedBooks, setPastBorrowedBooks] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [accountData, setAccountData] = useState({
    username: user?.fullName || 'Student User',
    email: user?.email || 'student@example.com',
    password: ''
  });

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // Fetch all requests for this student
      const response = await requestsAPI.getByUser(user._id);
      const requests = response.data.data || [];

      // Separate requests by status
      const approved = requests.filter(req => req.status === 'Approved');
      const borrowed = requests.filter(req => req.status === 'Borrowed');
      const returned = requests.filter(req => req.status === 'Returned');

      setApprovedBooks(approved);
      setCurrentBorrowedBooks(borrowed);
      setPastBorrowedBooks(returned);

    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAccountUpdate = (e) => {
    e.preventDefault();
    alert('Account updated successfully!');
  };

  const handleAccountChange = (e) => {
    setAccountData({
      ...accountData,
      [e.target.name]: e.target.value
    });
  };

  const handleSchedulePickup = (bookId) => {
    navigate(`/partner-libraries?type=book_pickup&bookId=${bookId}&from=student`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <main className="page-wrap my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrap my-5">
      <div className="row g-4">
        {/* Left Column */}
        <div className="col-md-8">
          <h2 className="page-title">Student Dashboard</h2>
          <p className="page-subtitle">Manage your book requests and pickups.</p>

          {/* Approved Books for Pickup */}
          <div className="approved-books mb-4">
            <h6 className="text-muted">Approved Books for Pickup</h6>
            {approvedBooks.length > 0 ? (
              <div className="row g-4">
                {approvedBooks.map((request) => (
                  <div key={request._id} className="col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{request.book?.title || 'Book Title'}</h5>
                        <p className="card-text">Author: {request.book?.author || 'Unknown Author'}</p>
                        <p className="text-success fw-bold">✅ Status: Approved</p>
                        <p className="text-muted">Approved on: {formatDate(request.approvalDate)}</p>
                        <p className="text-info">Due Date: {formatDate(request.dueDate)}</p>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleSchedulePickup(request.book?._id)}
                        >
                          📅 Schedule Pickup
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info">
                <h5>No approved books yet</h5>
                <p>Your book requests are still pending approval. Check back later!</p>
                <Link to="/library" className="btn btn-primary">Browse Available Books</Link>
              </div>
            )}
          </div>

          {/* Currently Borrowed Books */}
          <div className="current-borrowed mb-4">
            <h6 className="text-muted">Currently Borrowed Books</h6>
            {currentBorrowedBooks.length > 0 ? (
              <div className="row g-4">
                {currentBorrowedBooks.map((request) => (
                  <div key={request._id} className="col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{request.book?.title || 'Book Title'}</h5>
                        <p className="card-text">Author: {request.book?.author || 'Unknown Author'}</p>
                        <p className="text-warning fw-bold">Due Date: {formatDate(request.dueDate)}</p>
                        <p className="text-muted">Borrowed on: {formatDate(request.approvalDate)}</p>
                        <button className="btn btn-outline-primary btn-sm">View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-light">
                <p>No books currently borrowed.</p>
              </div>
            )}
          </div>

          {/* Past Borrowed Books */}
          <div className="past-borrowed mb-4">
            <h6 className="text-muted">Past Borrowed Books</h6>
            {pastBorrowedBooks.length > 0 ? (
              <div className="row g-4">
                {pastBorrowedBooks.map((request) => (
                  <div key={request._id} className="col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{request.book?.title || 'Book Title'}</h5>
                        <p className="card-text">Author: {request.book?.author || 'Unknown Author'}</p>
                        <p className="text-success fw-bold">Returned on: {formatDate(request.returnedDate)}</p>
                        <button className="btn btn-outline-secondary btn-sm">Request Again</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-light">
                <p>No past borrowed books.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Account Details */}
        <div className="col-md-4">
          <div className="card account-card">
            <div className="card-body">
              <h4 className="card-title">👤 Account Details</h4>
              <div className="text-center mb-3">
                <img
                  src="https://images.unsplash.com/photo-1707396174323-dd31d3dd4a97?w=100&h=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHByb2ZpbGUlMjBwaWN0dXJlJTIwbm8lMjBmYWNlJTIwZHVtbXklMjBnaXJsfGVufDB8fDB8fHww"
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
              </div>
              <form onSubmit={handleAccountUpdate}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={accountData.username}
                    onChange={handleAccountChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={accountData.email}
                    onChange={handleAccountChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Change Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="New Password"
                    value={accountData.password}
                    onChange={handleAccountChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">Update Account</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Student;