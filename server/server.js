const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const exchangeRoutes = require('./routes/exchangeRoutes');

dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://skillswap-client-7d45.onrender.com'],
  credentials: true,
}));

app.use(express.json());

app.get('/api/test', (req, res) => {
  res.send('Backend is working!');
});

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    app.listen(process.env.PORT, () => 
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.log('❌ MongoDB connection error:', err));
