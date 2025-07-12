const mongoose = require('mongoose');
const exchangeSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ExchangeRequest', exchangeSchema);