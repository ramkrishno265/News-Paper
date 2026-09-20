import React from 'react';

export default function Contact() {
  return (
    <div className="max-w-xl mx-auto my-12 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
      <form onSubmit={e => { e.preventDefault(); alert('Message sent successfully!'); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Your Name</label>
          <input type="text" className="w-full mt-1 p-3 border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Your Email</label>
          <input type="email" className="w-full mt-1 p-3 border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea rows="4" className="w-full mt-1 p-3 border rounded-lg" required></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700">Send Message</button>
      </form>
    </div>
  );
}