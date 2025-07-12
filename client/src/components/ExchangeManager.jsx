import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ExchangeManager.css';

const ExchangeManager = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get('/api/exchange', {
          headers: {
            Authorization: token,
          },
        });

        setRequests(res.data || []);
      } catch (err) {
        console.error('Error fetching exchange requests:', err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [navigate]);

  const respond = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.put(
        `/api/exchange/${id}`,
        { status },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setRequests(prev =>
        prev.map(req => (req._id === id ? { ...req, status } : req))
      );
    } catch (err) {
      console.error('Error updating exchange request:', err);
      alert('Failed to update request. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="exchange-manager-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">SkillSwap</div>
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">
            <i className="fas fa-home"></i> Dashboard
          </Link>
          <Link to="/profile" className="nav-link">
            <i className="fas fa-user"></i> Profile
          </Link>
          <Link to="/skills" className="nav-link">
            <i className="fas fa-lightbulb"></i> Skills
          </Link>
          <Link to="/exchanges" className="nav-link active">
            <i className="fas fa-exchange-alt"></i> Exchanges
          </Link>
          <Link to="/all-chats" className="nav-link">
            All chats
          </Link>
          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="exchange-content">
        <div className="header-section">
          <h1>
            <i className="fas fa-exchange-alt"></i> Exchange Requests
          </h1>
        </div>

        {requests.length === 0 ? (
          <div className="no-requests">
            <i className="fas fa-inbox"></i>
            <p>No exchange requests found</p>
          </div>
        ) : (
          <div className="requests-grid">
            {requests.map(req => {
              const isSender = req.from?._id === userId;
              const isRecipient = req.to?._id === userId;
              const otherUser = isSender ? req.to : req.from;
              const labelText = isSender
                ? `To: ${otherUser?.name}`
                : `From: ${otherUser?.name}`;

              return (
                <div key={req._id} className="request-card">
                  {/* Header */}
                  <div className="request-header">
                    <div className="user-info">
                      <div className="avatar">
                        {otherUser?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <h3>{labelText}</h3>
                        <p className="request-date">
                          {req.createdAt
                            ? new Date(req.createdAt).toLocaleDateString()
                            : 'No date'}
                        </p>
                      </div>
                    </div>
                    <div className={`status-badge ${req.status || 'pending'}`}>
                      {(req.status || 'pending').charAt(0).toUpperCase() +
                        (req.status || 'pending').slice(1)}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="request-details">
                    <div className="detail-item">
                      <label>Offers:</label>
                      <div className="skills-list">
                        {req.from?.skillsOffered?.length > 0 ? (
                          req.from.skillsOffered.map((skill, i) => (
                            <span key={i} className="skill-tag">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="no-skills">No skills offered</span>
                        )}
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Requests:</label>
                      <div className="skills-list">
{req.to?.skillsWanted?.length > 0 ? (
  req.to.skillsWanted.map((skill, i) => (
    <span key={i} className="skill-tag wanted">
      {skill}
    </span>
  ))
) : (
  <span className="no-skills">No skills requested</span>
)}
                      </div>
                    </div>
                  </div>

                  {/* Actions - Only show accept/reject buttons if logged-in user is recipient and status is pending */}
                  {isRecipient && (req.status === 'pending' || !req.status) && (
                    <div className="action-buttons">
                      <button
                        onClick={() => respond(req._id, 'accepted')}
                        className="accept-btn"
                      >
                        <i className="fas fa-check"></i> Accept
                      </button>
                      <button
                        onClick={() => respond(req._id, 'rejected')}
                        className="reject-btn"
                      >
                        <i className="fas fa-times"></i> Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangeManager;
