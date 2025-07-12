// server/controllers/exchangeController.js
const Exchange = require('../models/ExchangeRequest');


exports.sendRequest = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized: User info missing' });
  }

 
  if (req.body.from && req.body.from !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden: Cannot spoof sender ID' });
  }

  try {
    const request = await Exchange.create({
      from: req.user.id,  
      to: req.body.to,
    });
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending request');
  }
};




// controllers/exchangeController.js
exports.getRequests = async (req, res) => {
  try {
    const requests = await Exchange.find({
      $or: [
        { to: req.user.id },
        { from: req.user.id }
      ]
    })
    .populate('from', 'name skillsOffered skillsWanted')
    .populate('to', 'name skillsOffered skillsWanted');
     console.log(requests);
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching requests');
  }
};


exports.updateRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Exchange.findById(req.params.id);

    if (!request) return res.status(404).json({ message: 'Request not found' });

    // ✅ Only allow recipient to update
    if (request.to.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update requests sent to you' });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating request');
  }
};

exports.checkAccepted = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id;

    const exchange = await Exchange.findOne({
      $or: [
        { from: currentUserId, to: userId, status: 'accepted' },
        { from: userId, to: currentUserId, status: 'accepted' }
      ]
    });

    res.json({ accepted: !!exchange });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
