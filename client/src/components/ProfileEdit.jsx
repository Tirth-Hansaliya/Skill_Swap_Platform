import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/ProfileEdit.css';

const ProfileEdit = () => {
  const [profile, setProfile] = useState({
    bio: '',
    skillsOffered: [],
    skillsWanted: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`/api/users/profile/${userId}`);
      const data = response.data;
      setProfile({
        bio: data.bio || '',
        skillsOffered: data.skillsOffered || [],
        skillsWanted: data.skillsWanted || []
      });
    } catch (error) {
      console.error(error);
      setError('Failed to load profile');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send PUT request with updated profile data
      await axios.put(
        '/api/users/profile',
        profile,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
        }
      );

      // Clear form and redirect after successful update
      setProfile({
        bio: '',
        skillsOffered: [],
        skillsWanted: []
      });

      alert('Profile updated successfully!');
      navigate('/profile'); // Redirect to profile page
    } catch (error) {
      console.error(error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-edit-container">
      <div className="header-section">
        <button 
          onClick={() => navigate('/profile')} 
          className="back-button"
        >
          &larr; Back to Profile
        </button>
        <h2>Edit Profile</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            rows="3"
            value={profile.bio}
            onChange={e => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Tell others about yourself"
          />
        </div>
        
        <div className="form-group">
          <label>Skills Offered (comma separated)</label>
          <input
            type="text"
            value={profile.skillsOffered ? profile.skillsOffered.join(', ') : ''}
            onChange={e => setProfile({ ...profile, skillsOffered: e.target.value.split(',').map(s => s.trim()) })}
            placeholder="e.g., Web Design, Photography, Tutoring"
          />
        </div>
        
        <div className="form-group">
          <label>Skills Wanted (comma separated)</label>
          <input
            type="text"
            value={profile.skillsWanted ? profile.skillsWanted.join(', ') : ''}
            onChange={e => setProfile({ ...profile, skillsWanted: e.target.value.split(',').map(s => s.trim()) })}
            placeholder="e.g., Cooking, Car Repair, Coding"
          />
        </div>
        
        <div className="button-group">
          <button
            type="submit"
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
