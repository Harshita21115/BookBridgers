import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    // Initialize Bootstrap carousel after component mounts
    const carouselElement = document.getElementById('bookCarousel');
    if (carouselElement && window.bootstrap) {
      const carousel = new window.bootstrap.Carousel(carouselElement, {
        interval: 5000, // Auto-advance every 5 seconds
        wrap: true,
        touch: true
      });
    }
  }, []);

  return (
    <div className="home-page">
      {/* Carousel Section */}
      <section className="carousel-section">
        <div className="container-fluid px-0">
          {/* Title Overlay */}
          <div className="title-overlay">
            <div className="container">
              <div className="text-center">
                <h1 className="overlay-title">Book Bridgers</h1>
                <p className="overlay-subtitle">Connecting Students with Knowledge</p>
              </div>
            </div>
          </div>
          
          <div id="bookCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#bookCarousel" data-bs-slide-to="0" className="active"></button>
              <button type="button" data-bs-target="#bookCarousel" data-bs-slide-to="1"></button>
              <button type="button" data-bs-target="#bookCarousel" data-bs-slide-to="2"></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba" className="d-block w-100" alt="Books on Shelf" />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Bridge the Gap to Knowledge</h5>
                  <p>Connect students with books through libraries, institutions, and community donations.</p>
                  <Link to="/student" className="btn btn-primary">Start Requesting Books →</Link>
                  <Link to="/community" className="btn btn-outline">Join Community</Link>
                </div>
              </div>
              <div className="carousel-item">
                <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f" className="d-block w-100" alt="Our Mission" />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Our Mission</h5>
                  <p>To create equal access to education by connecting students with libraries, donors, and communities willing to share knowledge.</p>
                </div>
              </div>
              <div className="carousel-item">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" className="d-block w-100" alt="Students Learning" />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Empowering Students</h5>
                  <p>BookBridgers ensures every student has access to the right learning resources by connecting communities, libraries, and donors.</p>
                </div>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#bookCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#bookCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="container">
          <h2 className="page-title">About Us</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="about-card">
                <img src="https://images.unsplash.com/photo-1553729784-e91953dec042?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym9vayUyMHJlYWRpbmd8ZW58MHx8MHx8fDA%3D" alt="Our Mission" />
                <h5>Our Mission</h5>
                <p>To create equal access to education by connecting students with libraries, donors, and communities willing to share books and knowledge.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="about-card">
                <img src="https://images.unsplash.com/photo-1742552186060-f865f0e9a789?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9vayUyMHNoYXJpbmd8ZW58MHx8MHx8fDA%3D" alt="Our Community" />
                <h5>Our Community</h5>
                <p>A global network of students, donors, and institutions working together to bridge the gap between those who have books and those who need them.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="about-card">
                <img src="https://images.unsplash.com/photo-1727947248592-77b80a8d3a3a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGhhcHB5JTIwa2lkcyUyMHdpdGglMjBib29rc3xlbnwwfHwwfHx8MA%3D%3D" alt="Our Impact" />
                <h5>Our Impact</h5>
                <p>Thousands of students have gained access to educational resources, empowering them to learn, grow, and achieve their dreams.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight Section */}
      <section className="highlight-section">
        <div className="container">
          <div className="row g-5">
            <div className="col-md-6">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" alt="Students Learning" />
            </div>
            <div className="col-md-6">
              <h3>Empowering Students Everywhere</h3>
              <p>BookBridgers goes beyond donations — we build a stronger future by ensuring every student has access to the right learning resources. By connecting communities, libraries, and donors, we are making quality education more inclusive and impactful.</p>
              <p>Join us in building bridges of knowledge that empower the next generation of leaders and innovators.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


