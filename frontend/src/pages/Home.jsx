import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function Home() {
  const [topNews, setTopNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/news')
      .then(res => {
        const data = res.data.news || res.data;
        
        // আজকের তারিখের বা সবচেয়ে সাম্প্রতিক নিউজ ফিল্টার করার লজিক
        const todayStr = new Date().toDateString();
        const todaysNews = data.filter(news => {
          if (!news.createdAt) return true; // তারিখ না থাকলে রেখে দেবো
          const newsDate = new Date(news.createdAt).toDateString();
          // আপনি যদি কেবল একদম আজকের নিউজ দেখাতে চান, তবে নিচের কন্ডিশনটি অন রাখতে পারেন:
          // return newsDate === todayStr;
          return true; // অথবা সব টপ নিউজ দেখানোর জন্য
        });

        // যদি আজকের কোনো নিউজ না থাকে, তবে অন্তত সাম্প্রতিক টপ নিউজগুলো দেখাবে
        setTopNews(todaysNews.length > 0 ? todaysNews : data);
      })
      .catch(err => console.log('Home News Fetch Error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-16 space-y-12">
      
      {/* 1. Breaking News Ticker Bar */}
      <div className="bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border-b border-red-100 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shrink-0">
              Breaking News
            </span>
            <p className="text-sm font-medium text-slate-700 truncate">
              আজকের তাজা খবর ও লাইভ আপডেট পেতে সাথেই থাকুন।
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* 2. Hero Banner Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 md:p-14 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-2xl z-10 space-y-5 text-center md:text-left">
            <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-blue-400/30">
              ✨ আজকের শিরোনাম
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight leading-tight">
              আজকের সকল গুরুত্বপূর্ণ ও সর্বশেষ খবর
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              দেশের ও দশের আজকের তাজা আপডেট, ব্রেকিং স্টোরি এবং এক্সক্লুসিভ প্রতিবেদন।
            </p>
            <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link 
                to="/news" 
                className="bg-blue-600 text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition"
              >
                সব খবর দেখুন
              </Link>
              <Link 
                to="/contact" 
                className="bg-white/15 border border-white/20 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/25 transition"
              >
                যোগাযোগ করুন
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Trending Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">জনপ্রিয় ক্যাটাগরি</h2>
            <Link to="/news" className="text-blue-600 font-semibold text-sm hover:underline">সব দেখুন &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {['Technology', 'Business', 'Sports', 'Entertainment', 'Politics', 'Health'].map((cat, idx) => (
              <Link 
                key={idx} 
                to={`/news?category=${cat.toLowerCase()}`}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 text-center hover:shadow-md hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
              >
                <span className="font-semibold text-slate-700 group-hover:text-blue-600 text-sm block">
                  {cat}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Breaking & Today's Top News Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">আজকের ব্রেকিং ও শীর্ষ সংবাদ</h2>
            <span className="text-xs text-slate-500 font-medium bg-white px-3 py-1 rounded-full border border-slate-200">
              আপডেট: {new Date().toLocaleDateString()}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-500 font-medium">আজকের নিউজ লোড হচ্ছে...</div>
          ) : topNews.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
              আজকে এখনো কোনো নতুন সংবাদ প্রকাশিত হয়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topNews.map(news => (
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
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-md">
                      {news.category || 'Today'}
                    </span>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-2.5 group-hover:text-blue-600 transition line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                      {news.content}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-400 font-medium">
                        {news.createdAt ? new Date(news.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'আজ'}
                      </span>
                      <Link 
                        to={`/news/${news._id}`} 
                        className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition inline-flex items-center gap-1"
                      >
                        বিস্তারিত পড়ুন &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. Newsletter Subscription Banner */}
        <section className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold">প্রতিদিনের খবর ইমেইলে নিন</h3>
            <p className="text-slate-400 text-sm max-w-md">আমাদের নিউজলেটারে সাবস্ক্রাইব করে প্রতিদিনের সব শীর্ষ সংবাদ সরাসরি আপনার ইনবক্সে পান।</p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <input 
              type="email" 
              placeholder="আপনার ইমেইল লিখুন" 
              className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80 text-sm" 
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3.5 rounded-xl font-semibold text-sm transition whitespace-nowrap shadow-lg shadow-blue-600/30">
              সাবস্ক্রাইব
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}