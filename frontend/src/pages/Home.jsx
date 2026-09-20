import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [topNews, setTopNews] = useState([]);

  useEffect(() => {
    // Top 6 news API call
    axios.get('http://localhost:5000/api/news/top6')
      .then(res => setTopNews(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Section 1: Hero Banner */}
      <section className="bg-blue-600 text-white p-12 rounded-2xl mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Daily News Portal</h1>
        <p className="text-lg mb-6">Stay updated with the latest news from around the world.</p>
        <Link to="/news" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100">Explore All News</Link>
      </section>

      {/* Section 2: Top 6 News */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Breaking & Top News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topNews.map(news => (
            <div key={news._id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">
              <img src={news.image || "https://via.placeholder.com/400x250"} alt={news.title} className="w-full h-48 object-cover" />
              <div className="p-5">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-semibold">{news.category}</span>
                <h3 className="text-xl font-bold mt-2 mb-3 text-gray-900">{news.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{news.content.substring(0, 80)}...</p>
                <Link to={`/news/${news._id}`} className="text-blue-600 font-semibold hover:underline">Read More &rarr;</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3, 4, 5 (Optional categories or trending features) */}
      <section className="bg-gray-100 p-8 rounded-xl mb-12">
        <h2 className="text-xl font-bold mb-3">Trending Categories</h2>
        <p className="text-gray-600">Explore news by Technology, Sports, Business, Entertainment and more.</p>
      </section>
    </div>
  );
}