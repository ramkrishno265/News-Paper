import React, { useEffect, useState } from 'react';
import API from '../api/axios'; // Centralized axios instance import করা হলো
import { Link } from 'react-router-dom';

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // লোকাল বা রেন্ডার লাইভ URL অনুযায়ী স্বয়ংক্রিয়ভাবে কল হবে
    API.get('/api/news')
      .then(res => {
        // ব্যাকএন্ডের রেসপন্স স্ট্রাকচার অনুযায়ী ডাটা সেট করা
        setNewsList(res.data.news || res.data);
      })
      .catch(err => {
        console.error('Error fetching news:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-medium text-gray-600">
        Loading news articles...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">All News Articles</h1>
      
      {newsList.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No news articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsList.map(news => (
            <div key={news._id} className="bg-white rounded-xl shadow overflow-hidden flex flex-col justify-between">
              <img 
                src={news.image || "https://via.placeholder.com/400x250"} 
                alt={news.title} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {news.category}
                  </span>
                  <h3 className="text-xl font-bold mt-2 mb-2 text-gray-900">{news.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {news.content ? `${news.content.substring(0, 90)}...` : ''}
                  </p>
                </div>
                <Link to={`/news/${news._id}`} className="text-blue-600 font-semibold hover:underline mt-auto">
                  Read Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}