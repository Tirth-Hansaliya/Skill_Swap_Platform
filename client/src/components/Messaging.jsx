import React, { useEffect, useState, useRef } from 'react';
import axios from '../api/axios';

import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/Messaging.css';

const Messaging = () => {
  const { recipientId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!recipientId) {
      alert('No user selected to chat with.');
      navigate('/skills');
      return;
    }

    const checkConnectionAndLoadMessages = async () => {
      try {
        // Check if exchange request is accepted
        const checkRes = await axios.get(
          `/api/exchange/accepted/${recipientId}`,
          { headers: { Authorization: localStorage.getItem('token') } }
        );
        if (!checkRes.data.accepted) {
          alert('You need to be connected (exchange accepted) to message this user.');
          navigate('/skills');
          return;
        }

        // Load messages
        const messagesRes = await axios.get(
          `/api/messages/${recipientId}`,
          { headers: { Authorization: localStorage.getItem('token') } }
        );
        setMessages(messagesRes.data);

        // Load recipient info
        const userRes = await axios.get(`/api/users/${recipientId}`);
        setRecipientName(userRes.data.name);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    checkConnectionAndLoadMessages();
  }, [recipientId, navigate]);
  
 const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };
  const sendMessage = async (content, type = 'text', fileName) => {
    if (!content.trim() && type === 'text') return;
    try {
      const res = await axios.post(
        '/api/messages',
        {
          to: recipientId,
          content,
          type,
          fileName,
        },
        {
          headers: { Authorization: localStorage.getItem('token') },
        }
      );
      setMessages([...messages, res.data]);
      if (type === 'text') setNewMsg('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Determine type for uploaded file by MIME
  const getFileType = (file) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'file';
  };

  // Handle file selection and upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('to', recipientId);

      // Upload file to server
      const res = await axios.post('/api/messages/upload', formData, {
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });

      const fileUrl = res.data.url; // e.g., /uploads/xxxx.jpg
      const fileName = res.data.fileName;

      // Create message with uploaded file info
      await sendMessage(fileUrl, getFileType(file), fileName);
    } catch (err) {
      console.error('File upload failed:', err);
      alert('Failed to upload file. Try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; // reset input
    }
  };

  if (loading) {
    return <div>Loading chat...</div>;
  }

  // Render different message types properly
  const renderMessageContent = (msg) => {
    const baseUrl = process.env.REACT_APP_API_URL;


    switch (msg.type) {
      case 'text':
        return <span>{msg.content}</span>;

      case 'image':
          return (
          <img
            src={`${baseUrl}${msg.content}`}
            alt="sent message"
            style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '8px' }}
          />
        );

      case 'video':
        return (
          <video controls style={{ maxWidth: '300px', borderRadius: '8px' }}>
            <source src={`${baseUrl}${msg.content}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );

      case 'file':
        return (
          <a href={`${baseUrl}${msg.content}`} target="_blank" rel="noopener noreferrer" download>
            📄 {msg.fileName || 'Download File'}
          </a>
        );

      default:
        return <span>{msg.content}</span>;
    }
  };

  return (
    <div className="messaging-app">
      <nav className="navbar">
        <div className="navbar-brand">SkillSwap</div>
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
          <Link to="/skills" className="nav-link">
            Skills
          </Link>
          <Link to="/exchanges" className="nav-link">
            Exchanges
          </Link>
          <Link to="/all-chats" className="nav-link">
          All chats
          </Link>
             <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      <div className="messaging-container">
        <h2>Chat with {recipientName}</h2>
        <div className="chat-box">
          {messages.length === 0 ? (
            <div>No messages yet. Start the conversation!</div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.from === localStorage.getItem('userId') ? 'sent' : 'received'}`}
              >
                <div>{renderMessageContent(msg)}</div>
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="message-input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(newMsg, 'text')}
            disabled={uploading}
          />
          <button onClick={() => sendMessage(newMsg, 'text')} disabled={!newMsg.trim() || uploading}>
            Send
          </button>

          <label htmlFor="file-upload" className="file-upload-label" title="Upload file, image, or video">
            📎
          </label>
          <input
            id="file-upload"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={uploading}
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          />
          {uploading && <span className="uploading-indicator">Uploading...</span>}
        </div>
      </div>
    </div>
  );
};

export default Messaging;
