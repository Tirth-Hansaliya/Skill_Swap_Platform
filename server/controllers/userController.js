const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  res.json(user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).send("Invalid credentials");
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user });
};

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
  res.json(user);
};

exports.rateUser = async (req, res) => {
  const { targetUserId, rating } = req.body;
  const target = await User.findById(targetUserId);
  if (!target.ratedBy.includes(req.user.id)) {
    target.rating = (target.rating * target.ratedBy.length + rating) / (target.ratedBy.length + 1);
    target.ratedBy.push(req.user.id);
    await target.save();
    res.send("Rated successfully");
  } else {
    res.status(400).send("Already rated");
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user.id } }, // Exclude logged-in user
      'name skillsOffered skillsWanted'
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name skillsOffered skillsWanted');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
