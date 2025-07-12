import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/SkillFilter.css';

const SkillFilter = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch users and exchange requests on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, requestsRes] = await Promise.all([
          axios.get('/api/users/all', {
            headers: { Authorization: localStorage.getItem('token') },
          }),
          axios.get('/api/exchange', {
            headers: { Authorization: localStorage.getItem('token') },
          }),
        ]);
        setUsers(usersRes.data);
        setRequests(requestsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper: get exchange request status between current user and other user
  const getRequestStatus = (otherUserId) => {
    const currentUserId = localStorage.getItem('userId');
    const req = requests.find((r) => {
      const fromId = r.from._id || r.from;
      const toId = r.to._id || r.to;
      return (
        (fromId === currentUserId && toId === otherUserId) ||
        (fromId === otherUserId && toId === currentUserId)
      );
    });
    return req ? req.status : null;
  };

  // Send new exchange request and refresh requests list
  const sendExchangeRequest = async (toUserId) => {
    try {
      await axios.post(
        '/api/exchange',
        { to: toUserId },
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      // Refresh requests after sending
      const updatedRequests = await axios.get('/api/exchange', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setRequests(updatedRequests.data);
      alert('Exchange request sent!');
    } catch (error) {
      console.error('Error sending exchange request:', error);
      alert('Failed to send exchange request.');
    }
  };

  const filteredUsers = users.filter((user) => {
    const skills = user.skillsOffered?.join(' ').toLowerCase() || '';
    return skills.includes(query.toLowerCase());
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="skill-filter-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">SkillSwap</div>
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
          <Link to="/skills" className="nav-link active">
            Browse Skills
          </Link>
          <Link to="/exchanges" className="nav-link">
            Exchanges
          </Link>
          <Link to="/messages" className="nav-link">
            Messages
          </Link>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search skills..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="results-container">
        {filteredUsers.length === 0 ? (
          <div className="no-results">
            {query ? 'No users found with these skills' : 'No users available'}
          </div>
        ) : (
          filteredUsers.map((user) => {
            if (user._id === localStorage.getItem('userId')) return null;

            const status = getRequestStatus(user._id);
          

            return (
              <div key={user._id} className="user-card">
                <h3>{user.name}</h3>
                <div className="skills-list">
                  <strong>Offers:</strong> {user.skillsOffered?.join(', ') || 'None'}
                </div>

                {status === 'accepted' ? (
                  <Link to={`/messages/${user._id}`} className="message-button">
                    Message
                  </Link>
                ) : status === 'pending' ? (
                  <button disabled className="message-button pending">
                    Request Pending
                  </button>
                ) : (
                  <button
                    onClick={() => sendExchangeRequest(user._id)}
                    className="message-button"
                  >
                    Request to Connect
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SkillFilter;
