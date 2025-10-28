import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Student from './pages/Student';
import Donor from './pages/Donor';
import Library from './pages/Library';
import Community from './pages/Community';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import PartnerLibraries from './pages/PartnerLibraries';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/student" element={
                <ProtectedRoute requiredRole="student">
                  <Student />
                </ProtectedRoute>
              } />
              <Route path="/donor" element={
                <ProtectedRoute requiredRole="donor">
                  <Donor />
                </ProtectedRoute>
              } />
              <Route path="/library" element={<Library />} />
              <Route path="/community" element={<Community />} />
              <Route path="/partner-libraries" element={<PartnerLibraries />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;