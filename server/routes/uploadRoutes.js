const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // ensure this folder exists
  },
  filename: (req, file, cb) => {
    // unique filename with timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', auth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Send back the URL to the file
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
