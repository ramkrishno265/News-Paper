import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    API.get('/api/news')
      .then(res => {
        const data = res.data.news || res.data;
        setNewsList(data);
        setFilteredNews(data);
      })
      .catch(err => {
        console.error('Error fetching news:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Category ebong Search filter handle korar logic
  useEffect(() => {
    let result = newsList;

    if (selectedCategory !== 'All') {
      result = result.filter(
        news => news.category && news.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm.trim() !== '') {
      result = result.filter(
        news => 
          news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNews(result);
  }, [selectedCategory, searchTerm, newsList]);

  const categories = ['All', 'Technology', 'Business', 'Sports', 'Entertainment', 'Politics', 'Health'];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-medium text-lg">
        Loading news articles...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Header & Search Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white py-14 px-4 mb-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">All News Articles</h1>
            <p className="text-slate-300 text-sm md:text-base mt-2">
              Explore the latest updates, breaking headlines, and insightful stories.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-inner"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-blue-600/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 text-slate-500 shadow-sm">
            <p className="text-lg font-medium">No news articles found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map(news => (
              <div 
                key={news._id} 
                className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                <div className="relative overflow-hidden h-52 bg-slate-100">
                  <img 
                    src={news.image || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&auto=format&fit=crop"} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&auto=format&fit=crop";
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-md">
                    {news.category || 'General'}
                  </span>
                </div>
                
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-2.5 group-hover:text-blue-600 transition line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {news.content ? `${news.content.substring(0, 100)}...` : ''}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <span className="text-xs text-slate-400 font-medium">
                      {news.createdAt ? new Date(news.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                    <Link 
                      to={`/news/${news._id}`} 
                      className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition inline-flex items-center gap-1"
                    >
                      Read Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}