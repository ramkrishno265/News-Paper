import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";

export default function NewsDetails() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const cleanUrl = (url) => {
    if (!url || url.includes('placeholder') || url.includes('placenoider')) {
      return '';
    }
    if (url.startsWith('/uploads')) {
      return `http://localhost:5000${url}`;
    }
    return url;
  };

  useEffect(() => {
    window.scrollTo(0, 0); // পেজ লোড হলে সবার উপরে নিয়ে যাবে
    API.get(`/api/news/${id}`)
      .then(res => {
        const newsData = res.data.news || res.data;
        setNews({
          ...newsData,
          image: cleanUrl(newsData.image)
        });
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-500 font-medium text-lg">
        Loading article details...
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-xl font-semibold text-red-500">News article not found!</p>
        <Link to="/news" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
          &larr; Back to All News
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4">
      <article className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden p-6 md:p-12 space-y-8">
        
        {/* Navigation & Category Bar */}
        <div className="flex items-center justify-between">
          <Link 
            to="/news" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            &larr; Back to News
          </Link>
          <span className="bg-blue-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            {news.category || 'General'}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight tracking-tight">
          {news.title}
        </h1>

        {/* Meta Details: Author, Date & Share */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-slate-100 text-slate-500 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
              {(news.author?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{news.author?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400">
                {news.createdAt ? new Date(news.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent'}
              </p>
            </div>
          </div>

          <button 
            onClick={handleShare}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition text-xs flex items-center gap-2 self-start sm:self-auto"
          >
            {copied ? 'Link Copied! ✓' : 'share Article 🔗'}
          </button>
        </div>

        {/* Featured Image */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-md">
          <img 
            src={news.image || fallbackImage} 
            alt={news.title} 
            className="w-full h-[320px] md:h-[450px] object-cover" 
            onError={(e) => { e.target.src = fallbackImage; }}
          />
        </div>

        {/* Article Body Content */}
        <div className="prose max-w-none text-slate-700 leading-relaxed text-lg space-y-6 whitespace-pre-line font-normal">
          {news.content}
        </div>

        {/* Footer Navigation */}
        <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
          <Link 
            to="/news" 
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-sm"
          >
            &larr; Explore More News
          </Link>
        </div>

      </article>
    </div>
  );
}