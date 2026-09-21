const router = require('express').Router();
const ContactMessage = require('../models/ContactMessage');

router.post('/', async (req, res) => {
  try {
    const { topic, name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required.' });
    }
    await ContactMessage.create({ topic, name, email, message });
    res.status(201).json({ message: 'Message received' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;