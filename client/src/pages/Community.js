import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Community = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('members');

  const members = [
    { 
      name: 'Akshay Joshi', 
      role: 'Library Volunteer', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      booksDonated: 15,
      joinedDate: '2023-01-15',
      bio: 'Passionate about making education accessible to all students.'
    },
    { 
      name: 'Omsing Pawar', 
      role: 'Book Donor', 
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      booksDonated: 23,
      joinedDate: '2022-11-08',
      bio: 'Believes in the power of books to transform lives.'
    },
    { 
      name: 'Harshita Bagwe', 
      role: 'Student Member', 
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
      booksBorrowed: 8,
      joinedDate: '2023-03-22',
      bio: 'Active learner and community contributor.'
    },
    { 
      name: 'Jhanvi Patil', 
      role: 'Educator', 
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      booksDonated: 12,
      joinedDate: '2022-09-14',
      bio: 'Dedicated teacher promoting literacy in our community.'
    },
    { 
      name: 'Rajesh Kumar', 
      role: 'Library Staff', 
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      booksManaged: 156,
      joinedDate: '2022-06-01',
      bio: 'Library coordinator ensuring smooth operations.'
    },
    { 
      name: 'Priya Sharma', 
      role: 'Student Member', 
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      booksBorrowed: 12,
      joinedDate: '2023-05-10',
      bio: 'Book lover and active community participant.'
    }
  ];

  const discussions = [
    { 
      title: 'How can we help students access more books?', 
      author: 'Harshita Bagwe', 
      time: '2 hours ago',
      replies: 8,
      category: 'General',
      excerpt: 'I was thinking about ways to make books more accessible to students who might not have easy access to libraries...'
    },
    { 
      title: 'Ideas for community reading events', 
      author: 'Saraha Bamane', 
      time: '5 hours ago',
      replies: 12,
      category: 'Events',
      excerpt: 'Let\'s organize monthly reading sessions where community members can share their favorite books...'
    },
    { 
      title: 'Best ways to organize book donations', 
      author: 'Omsing Pawar', 
      time: '1 day ago',
      replies: 15,
      category: 'Donations',
      excerpt: 'I\'ve been donating books for years. Here are some tips for effective book donation drives...'
    },
    { 
      title: 'Sharing online learning resources', 
      author: 'Akshita Shah', 
      time: '2 days ago',
      replies: 6,
      category: 'Resources',
      excerpt: 'With digital learning becoming more important, let\'s share useful online resources...'
    },
    { 
      title: 'Book recommendation thread', 
      author: 'Jhanvi Patil', 
      time: '3 days ago',
      replies: 23,
      category: 'Books',
      excerpt: 'Share your favorite books and help others discover new reads!'
    }
  ];

  const events = [
    {
      title: 'Community Book Fair',
      date: '2024-01-15',
      time: '10:00 AM - 4:00 PM',
      location: 'Central Library',
      description: 'Join us for our monthly book fair with discounted books and donation drives.',
      attendees: 45
    },
    {
      title: 'Reading Circle Meeting',
      date: '2024-01-20',
      time: '6:00 PM - 7:30 PM',
      location: 'Community Center',
      description: 'Monthly reading circle discussing "The Alchemist" by Paulo Coelho.',
      attendees: 12
    },
    {
      title: 'Book Donation Drive',
      date: '2024-01-25',
      time: '9:00 AM - 2:00 PM',
      location: 'Multiple Locations',
      description: 'Help us collect books for underprivileged students in our community.',
      attendees: 28
    }
  ];

  const stats = {
    totalMembers: 156,
    booksDonated: 1247,
    booksBorrowed: 892,
    activeDiscussions: 23
  };

  return (
    <main className="page-wrap">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title">Join Our Community</h1>
              <p className="hero-subtitle">
                Connect with students, donors, and libraries. Share knowledge, discuss books, 
                and help education reach everyone in our community.
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary btn-lg me-3">
                  <i className="fas fa-plus me-2"></i>
                  Start Contributing
                </button>
                <button className="btn btn-outline-primary btn-lg">
                  <i className="fas fa-comments me-2"></i>
                  Join Discussion
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-stats">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="stat-card">
                      <div className="stat-number">{stats.totalMembers}</div>
                      <div className="stat-label">Active Members</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-card">
                      <div className="stat-number">{stats.booksDonated}</div>
                      <div className="stat-label">Books Donated</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-card">
                      <div className="stat-number">{stats.booksBorrowed}</div>
                      <div className="stat-label">Books Borrowed</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-card">
                      <div className="stat-number">{stats.activeDiscussions}</div>
                      <div className="stat-label">Active Discussions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="tabs-section">
        <div className="container">
          <div className="tabs-nav">
            <button 
              className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              <i className="fas fa-users me-2"></i>
              Community Members
            </button>
            <button 
              className={`tab-btn ${activeTab === 'discussions' ? 'active' : ''}`}
              onClick={() => setActiveTab('discussions')}
            >
              <i className="fas fa-comments me-2"></i>
              Discussions
            </button>
            <button 
              className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <i className="fas fa-calendar me-2"></i>
              Events
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="tab-content-section">
        <div className="container">
          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="members-tab">
              <div className="section-header">
                <h2>Community Members</h2>
                <p>Meet the amazing people who make our community thrive</p>
              </div>
              <div className="row g-4">
                {members.map((member, index) => (
                  <div key={index} className="col-lg-4 col-md-6">
                    <div className="member-card">
                      <div className="member-avatar">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0zMCA5MEMzMCA3NS42NDE1IDQxLjY0MTUgNjQgNTYgNjRINjRDNzguMzU4NSA2NCA5MCA3NS42NDE1IDkwIDkwVjEwMEgzMFY5MFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+';
                          }}
                        />
                        <div className="member-status online"></div>
                      </div>
                      <div className="member-info">
                        <h5 className="member-name">{member.name}</h5>
                        <p className="member-role">{member.role}</p>
                        <p className="member-bio">{member.bio}</p>
                        <div className="member-stats">
                          {member.booksDonated && (
                            <div className="stat">
                              <span className="stat-number">{member.booksDonated}</span>
                              <span className="stat-label">Books Donated</span>
                            </div>
                          )}
                          {member.booksBorrowed && (
                            <div className="stat">
                              <span className="stat-number">{member.booksBorrowed}</span>
                              <span className="stat-label">Books Borrowed</span>
                            </div>
                          )}
                          {member.booksManaged && (
                            <div className="stat">
                              <span className="stat-number">{member.booksManaged}</span>
                              <span className="stat-label">Books Managed</span>
                            </div>
                          )}
                        </div>
                        <div className="member-joined">
                          Joined {new Date(member.joinedDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discussions Tab */}
          {activeTab === 'discussions' && (
            <div className="discussions-tab">
              <div className="section-header">
                <h2>Community Discussions</h2>
                <p>Join conversations and share your thoughts</p>
                <button className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>
                  Start New Discussion
                </button>
              </div>
              <div className="discussions-list">
                {discussions.map((discussion, index) => (
                  <div key={index} className="discussion-card">
                    <div className="discussion-header">
                      <div className="discussion-category">
                        <span className={`category-badge category-${discussion.category.toLowerCase()}`}>
                          {discussion.category}
                        </span>
                      </div>
                      <div className="discussion-time">{discussion.time}</div>
                    </div>
                    <h5 className="discussion-title">{discussion.title}</h5>
                    <p className="discussion-excerpt">{discussion.excerpt}</p>
                    <div className="discussion-footer">
                      <div className="discussion-author">
                        <i className="fas fa-user me-1"></i>
                        {discussion.author}
                      </div>
                      <div className="discussion-replies">
                        <i className="fas fa-comments me-1"></i>
                        {discussion.replies} replies
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="events-tab">
              <div className="section-header">
                <h2>Upcoming Events</h2>
                <p>Join our community events and activities</p>
                <button className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>
                  Create Event
                </button>
              </div>
              <div className="events-list">
                {events.map((event, index) => (
                  <div key={index} className="event-card">
                    <div className="event-date">
                      <div className="event-day">{new Date(event.date).getDate()}</div>
                      <div className="event-month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                    </div>
                    <div className="event-info">
                      <h5 className="event-title">{event.title}</h5>
                      <div className="event-details">
                        <div className="event-detail">
                          <i className="fas fa-clock me-2"></i>
                          {event.time}
                        </div>
                        <div className="event-detail">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          {event.location}
                        </div>
                        <div className="event-detail">
                          <i className="fas fa-users me-2"></i>
                          {event.attendees} attending
                        </div>
                      </div>
                      <p className="event-description">{event.description}</p>
                      <button className="btn btn-outline-primary btn-sm">
                        <i className="fas fa-calendar-plus me-1"></i>
                        Attend Event
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Community;