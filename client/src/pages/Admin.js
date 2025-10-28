import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Admin = () => {
  const [stats, setStats] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, requestsRes, booksRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getPendingRequests(),
        adminAPI.getBooks(),
        adminAPI.getUsers()
      ]);

      setStats(statsRes.data.data || statsRes.data);
      setPendingRequests(requestsRes.data.data || []);
      setBooks(booksRes.data.data || []);
      setUsers(usersRes.data.data || []);
    } catch (error) {
      setError('Failed to fetch admin data');
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (requestId, status) => {
    try {
      await adminAPI.updateRequest(requestId, status, user._id);
      alert(`Request ${status} successfully`);
      fetchAdminData(); // Refresh data
    } catch (error) {
      alert('Failed to update request');
      console.error('Error updating request:', error);
    }
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
      <div className="row g-4">
        {/* Header Section */}
        <div className="col-12">
          <h2 className="page-title">Admin Dashboard</h2>
        </div>

        {error && (
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="col-12">
          <h3 className="stats-section-title">Library Statistics</h3>
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card text-center h-100 stats-card">
                <div className="card-body">
                  <div className="stats-icon">
                    <i className="fas fa-users text-primary"></i>
                  </div>
                  <h5 className="card-title">Total Users</h5>
                  <h3 className="text-primary">{stats.totalUsers || 0}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center h-100 stats-card">
                <div className="card-body">
                  <div className="stats-icon">
                    <i className="fas fa-book text-success"></i>
                  </div>
                  <h5 className="card-title">Total Books</h5>
                  <h3 className="text-success">{stats.totalBooks || 0}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center h-100 stats-card">
                <div className="card-body">
                  <div className="stats-icon">
                    <i className="fas fa-clock text-warning"></i>
                  </div>
                  <h5 className="card-title">Pending Requests</h5>
                  <h3 className="text-warning">{stats.pendingRequests || 0}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center h-100 stats-card">
                <div className="card-body">
                  <div className="stats-icon">
                    <i className="fas fa-hand-holding text-info"></i>
                  </div>
                  <h5 className="card-title">Borrowed Books</h5>
                  <h3 className="text-info">{stats.borrowedBooks || 0}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests Section */}
        <div className="col-12">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="card-title mb-0">
                <i className="fas fa-clock text-warning me-2"></i>
                Pending Borrow Requests
              </h3>
            </div>
            <div className="card-body">
              {(pendingRequests || []).length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-check-circle text-success fa-3x mb-3"></i>
                  <h5 className="text-muted">No pending requests</h5>
                  <p className="text-muted">All requests have been processed!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Student Name</th>
                        <th>Book Title</th>
                        <th>Author</th>
                        <th>Request Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(pendingRequests || []).map((request) => (
                        <tr key={request._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                                <i className="fas fa-user"></i>
                              </div>
                              <div>
                                <div className="fw-bold">{request.student?.fullName || 'N/A'}</div>
                                <small className="text-muted">{request.student?.email || ''}</small>
                              </div>
                            </div>
                          </td>
                          <td className="fw-bold">{request.book?.title || 'N/A'}</td>
                          <td>{request.book?.author || 'N/A'}</td>
                          <td>
                            <small className="text-muted">
                              {new Date(request.requestDate).toLocaleDateString()}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-warning text-dark">
                              <i className="fas fa-clock me-1"></i>
                              {request.status}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-success btn-sm"
                                onClick={() => updateRequest(request._id, 'Approved')}
                                title="Approve Request"
                              >
                                <i className="fas fa-check me-1"></i>
                                Approve
                              </button>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => updateRequest(request._id, 'Rejected')}
                                title="Reject Request"
                              >
                                <i className="fas fa-times me-1"></i>
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Book Database Section */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="card-title mb-0">
                <i className="fas fa-book text-primary me-2"></i>
                Book Database
                <span className="badge bg-primary ms-2">{(books || []).length}</span>
              </h3>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-sm table-hover mb-0">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th>Book</th>
                      <th>Author</th>
                      <th>Status</th>
                      <th>Borrower</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(books || []).map((book) => (
                      <tr key={book._id}>
                        <td>
                          <div className="fw-bold">{book.title}</div>
                          <small className="text-muted">{book.category}</small>
                        </td>
                        <td>{book.author}</td>
                        <td>
                          <span className={`badge ${
                            book.status === 'Available' ? 'bg-success' :
                            book.status === 'Borrowed' ? 'bg-info' :
                            book.status === 'Requested' ? 'bg-warning' : 'bg-secondary'
                          }`}>
                            {book.status}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {book.currentBorrower?.fullName || '-'}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* User Database Section */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="card-title mb-0">
                <i className="fas fa-users text-info me-2"></i>
                User Database
                <span className="badge bg-info ms-2">{(users || []).length}</span>
              </h3>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-sm table-hover mb-0">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(users || []).map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                              <i className="fas fa-user"></i>
                            </div>
                            <div className="fw-bold">{user.fullName}</div>
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">{user.email}</small>
                        </td>
                        <td>
                          <span className={`badge ${
                            user.role === 'admin' ? 'bg-danger' :
                            user.role === 'donor' ? 'bg-success' :
                            user.role === 'student' ? 'bg-primary' : 'bg-secondary'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Admin;