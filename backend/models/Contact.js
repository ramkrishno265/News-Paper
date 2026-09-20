const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'Unread' } // Unread / Read
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);