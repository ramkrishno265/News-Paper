import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; // Centralized axios instance import করা হলো

export default function CreateNews() {
  const [news, setNews] = useState({ title: '', category: '', content: '', image: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debugging purpose
    try {
      await API.post('/api/news', news, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('News published successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Publish Error:', err);
      alert(err.response?.data?.message || 'Failed to publish news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create and Publish News</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">News Title</label>
          <input 
            type="text" 
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={news.title}
            onChange={e => setNews({...news, title: e.target.value})} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input 
            type="text" 
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={news.category}
            onChange={e => setNews({...news, category: e.target.value})} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input 
            type="text" 
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={news.image}
            onChange={e => setNews({...news, image: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea 
            rows="6" 
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={news.content}
            onChange={e => setNews({...news, content: e.target.value})} 
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish News'}
        </button>
      </form>
    </div>
  );
}