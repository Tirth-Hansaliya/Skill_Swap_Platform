// server/routes/exchangeRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  sendRequest,
  getRequests,
  updateRequest,
  checkAccepted
} = require('../controllers/exchangeController');

router.post('/', auth, sendRequest);
router.get('/', auth, getRequests);
router.put('/:id', auth, updateRequest);
router.get('/accepted/:userId', auth, checkAccepted);

module.exports = router;
