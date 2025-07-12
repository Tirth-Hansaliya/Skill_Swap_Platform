const Message = require('../models/Message');

// Save a new message
exports.sendMessage = async (req, res) => {
  try {
    const { to, content, type, fileName } = req.body;

    if (!to || !content) {
      return res.status(400).json({ error: 'Recipient and content are required.' });
    }

    const message = await Message.create({
      from: req.user.id,
      to,
      content,
      type: type || 'text',
      fileName,
    });

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error sending message' });
  }
};

exports.getMessages = async (req, res) => {
  const user1 = req.user?.id;
  const user2 = req.params?.userId;

  if (!user1 || !user2 || user1 === "undefined" || user2 === "undefined") {
    return res.status(400).json({ error: 'Invalid user ID(s)' });
  }

  try {
    const messages = await Message.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Return URL for frontend to save in message content
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, fileName: req.file.originalname });
};
exports.getMyChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [{ from: userId }, { to: userId }]
    }).sort({ timestamp: -1 });

    const chatMap = new Map();

    for (const msg of messages) {
      if (!msg.from || !msg.to) continue; // ✅ skip if malformed

      const fromId = msg.from.toString();
      const toId = msg.to.toString();

      const otherUserId = fromId === userId ? toId : fromId;

      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, msg); // store the latest message
      }
    }

    const results = [];
    for (const [otherUserId, lastMessage] of chatMap.entries()) {
      const user = await require('../models/User').findById(otherUserId).select('_id name');
      if (user) {
        results.push({ user, lastMessage });
      }
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};
