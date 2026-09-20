const Contact = require('../models/Contact');

// Save Contact Message from Frontend
exports.submitContactForm = async (req, res) => {
  try {
    const { topic, name, email, message } = req.body;

    // Basic validation check on backend as well
    if (!topic || !name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required!' });
    }

    const newContact = new Contact({
      topic,
      name,
      email,
      message
    });

    await newContact.save();

    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
  } catch (err) {
    console.error('Contact Form Error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// Get All Messages (For Admin Dashboard)
exports.getAllContacts = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};