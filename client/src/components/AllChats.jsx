import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AllChats.css';

const AllChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('/api/messages/mychats', {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setChats(res.data);
      } catch (err) {
        console.error('Error fetching chats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

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
    <div className="all-chats-container">
      {/* Navigation Bar */}
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
          <Link to="/exchanges" className="nav-link">
            <i className="fas fa-exchange-alt"></i> Exchanges
          </Link>
          <Link to="/all-chats" className="nav-link active">
            <i className="fas fa-envelope"></i> All Chats
          </Link>
          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="chat-list-content">
        <h2><i className="fas fa-comments"></i> Your Conversations</h2>
        
        {chats.length === 0 ? (
          <div className="no-chats">
            <i className="fas fa-comment-slash"></i>
            <p>No conversations yet. Start chatting!</p>
            <Link to="/skills" className="browse-link">
              Browse skills to connect with others
            </Link>
          </div>
        ) : (
          <ul className="chat-list">
            {chats.map((chat) => {
              const otherUser = chat.user;
              const lastMsg = chat.lastMessage;

              return (
                <li key={chat._id} className="chat-item">
                  <Link to={`/messages/${otherUser._id}`} className="chat-link">
                    <div className="user-avatar">
                      {otherUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="chat-info">
                      <div className="user-name">{otherUser.name}</div>
                      <div className="last-message">
                        {lastMsg?.content || 'No messages yet'}
                      </div>
                    </div>
                    <div className="message-meta">
                      <span className="timestamp">
                        {lastMsg && new Date(lastMsg.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {lastMsg?.from === userId && (
                        <span className="sent-indicator">
                          <i className="fas fa-check"></i>
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllChats;