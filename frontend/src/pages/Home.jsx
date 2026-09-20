import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios'; // আপনার প্রজেক্টের প্রি-কনফিগারড axios ইনস্ট্যান্স

export default function Home() {
  const [topNews, setTopNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Top 6 news API call using configured API
    API.get('/api/news/top6')
      .then(res => {
        const data = res.data.news || res.data;
        setTopNews(data);
      })
      .catch(err => console.log('Home News Fetch Error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      
      {/* 1. Breaking News Ticker Bar */}
      <div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-4 rounded-r-xl shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
            Breaking
          </span>
          <p className="text-sm font-medium">
            Welcome to Daily News Portal — Get the latest updates, breaking stories, and global headlines instantly.
          </p>
        </div>
      </div>

      {/* 2. Hero Banner Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-10 md:p-16 rounded-3xl overflow-hidden shadow-xl text-center md:text-left flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-2xl z-10 space-y-4">
          <span className="bg-blue-500/30 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-400/30">
            Trusted Source
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Stay Updated with Global News & Stories
          </h1>
          <p className="text-blue-100 text-base md:text-lg">
            Discover breaking news, insightful articles, and trending categories curated just for you.
          </p>
          <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
            <Link 
              to="/news" 
              className="bg-white text-blue-700 px-7 py-3.5 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition transform hover:-translate-y-0.5"
            >
              Explore All News
            </Link>
            <Link 
              to="/contact" 
              className="bg-transparent border-2 border-white/80 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-white/10 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
        {/* Optional decorative abstract shape or graphic representation */}
        <div className="mt-8 md:mt-0 z-10 hidden lg:block">
          <div className="w-72 h-72 bg-white/10 rounded-full backdrop-blur-2xl border border-white/20 flex items-center justify-center p-6 text-center shadow-2xl">
            <span className="text-xl font-semibold text-white/90">📰 Daily News Live Insights</span>
          </div>
        </div>
      </section>

      {/* 3. Trending Categories Quick Filter Bar */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Trending Categories</h2>
          <Link to="/news" className="text-blue-600 font-semibold text-sm hover:underline">View All &rarr;</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {['Technology', 'Business', 'Sports', 'Entertainment', 'Politics', 'Health'].map((cat, idx) => (
            <Link 
              key={idx} 
              to={`/news?category=${cat.toLowerCase()}`}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md hover:border-blue-200 transition group"
            >
              <span className="font-semibold text-gray-800 group-hover:text-blue-600 text-sm block">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Breaking & Top News Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Breaking & Top News</h2>
          <span className="text-xs text-gray-500 font-medium">Updated few minutes ago</span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500 font-medium">Loading top news...</div>
        ) : topNews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-500">
            No breaking news available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topNews.map(news => (
              <div 
                key={news._id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative overflow-hidden h-52 bg-gray-100">
                  <img 
                    src={news.image || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&auto=format&fit=crop"} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&auto=format&fit=crop";
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow">
                    {news.category || 'General'}
                  </span>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                    {news.content}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      {news.createdAt ? new Date(news.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                    <Link 
                      to={`/news/${news._id}`} 
                      className="text-blue-600 font-bold text-sm hover:text-blue-800 transition inline-flex items-center gap-1"
                    >
                      Read More &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Newsletter / Subscription Banner */}
      <section className="bg-gray-900 text-white p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Subscribe to our Newsletter</h3>
          <p className="text-gray-400 text-sm">Get the top headlines and breaking news delivered straight to your inbox.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="p-3.5 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-72" 
          />
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3.5 rounded-xl font-bold transition whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </section>

    </div>
  );
}