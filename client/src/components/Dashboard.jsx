import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage or auth token if used
    localStorage.clear(); 
    navigate('/login'); // redirect to login page
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome to SkillSwap <span className="waving-hand">👋</span></h1>
          <p className="subtext">
            Discover talents, exchange skills, and grow together with our community!
          </p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <span className="button-text">Logout</span>
          <span className="button-icon">→</span>
        </button>
      </div>

      <div className="dashboard-cards">
        <Link to="/skills" className="dashboard-card">
          <div className="card-icon">🔍</div>
          <h3>Explore Skills</h3>
          <p>Browse and learn new skills shared by others.</p>
          <div className="card-hover-effect"></div>
        </Link>

        <Link to="/profile" className="dashboard-card">
          <div className="card-icon">👤</div>
          <h3>Your Profile</h3>
          <p>Update your information and showcase your skills.</p>
          <div className="card-hover-effect"></div>
        </Link>

        <Link to="/exchanges" className="dashboard-card">
          <div className="card-icon">🔄</div>
          <h3>My Exchanges</h3>
          <p>Manage skill exchange requests and collaborations.</p>
          <div className="card-hover-effect"></div>
        </Link>

        <Link to="/all-chats" className="dashboard-card">
          <div className="card-icon">💬</div>
          <h3>Messages</h3>
          <p>Chat with your connections and share files or ideas.</p>
          <div className="card-hover-effect"></div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;