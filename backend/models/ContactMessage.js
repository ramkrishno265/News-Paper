const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    topic: String,
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);