import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import axios from '../api/axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/login');
          return;
        }
        
        // Changed fetch to axios here
        const response = await axios.get(`/api/users/profile/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error">Failed to load profile data</div>;
  }

  return (
    <div className="profile-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">SkillSwap</div>
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/profile" className="nav-link active">Profile</Link>
          <Link to="/skills" className="nav-link">Skills</Link>
          <Link to="/exchanges" className="nav-link">Exchanges</Link>
          <Link to="/all-chats" className="nav-link">  All chats</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="profile-header">
          <h1>{user.name}'s Profile</h1>
          <Link to="/profileEdit" className="edit-button">Edit Profile</Link>
        </div>

        <div className="profile-details">
          <div className="profile-section">
            <h2>About Me</h2>
            <p>{user.bio || 'No bio provided'}</p>
          </div>

          <div className="profile-skills">
            <div className="skills-column">
              <h3>Skills I Offer</h3>
              <ul>
                {user.skillsOffered && user.skillsOffered.length > 0 ? (
                  user.skillsOffered.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))
                ) : (
                  <li>No skills listed</li>
                )}
              </ul>
            </div>

            <div className="skills-column">
              <h3>Skills I Want</h3>
              <ul>
                {user.skillsWanted && user.skillsWanted.length > 0 ? (
                  user.skillsWanted.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))
                ) : (
                  <li>No skills listed</li>
                )}
              </ul>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Profile;
