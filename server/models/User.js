const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  bio: String,
  location: String,
  skillsOffered: [String],
  skillsWanted: [String],
  rating: { type: Number, default: 0 },
  ratedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
module.exports = mongoose.model('User', userSchema);