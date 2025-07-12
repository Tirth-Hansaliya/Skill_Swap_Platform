const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');

const {
  sendMessage,
  getMessages,
  uploadFile,
  getMyChats,  // ✅ You forgot this import
} = require('../controllers/messageController');

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.get('/mychats', auth, getMyChats);
router.post('/', auth, sendMessage);
router.get('/:userId', auth, getMessages);
router.post('/upload', auth, upload.single('file'), uploadFile);


module.exports = router;
