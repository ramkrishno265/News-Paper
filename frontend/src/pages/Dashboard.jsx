import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [userNews, setUserNews] = useState([]);
  const [profile, setProfile] = useState({ name: '', email: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Fetch profile & user specific news
    axios.get('http://localhost:5000/api/users/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProfile(res.data));

    axios.get('http://localhost:5000/api/news/user-news', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUserNews(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this news?')) {
      await axios.delete(`http://localhost:5000/api/news/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUserNews(userNews.filter(item => item._id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome, {profile.name}</h2>
        <p className="text-gray-600">Email: {profile.email}</p>
      </div>

      <h3 className="text-xl font-bold mb-4">Your Published News</h3>
      <div className="space-y-4">
        {userNews.map(news => (
          <div key={news._id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <h4 className="font-bold text-lg">{news.title}</h4>
              <span className="text-xs text-gray-500">{news.category}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleDelete(news._id)} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}