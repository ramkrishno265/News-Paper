import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";

export default function NewsDetails() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="text-center py-20 text-lg font-medium text-gray-600">Loading...</div>;
  }

  if (!news) {
    return <div className="text-center py-20 text-lg font-medium text-red-500">News not found!</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{news.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        Published on: {news.createdAt ? new Date(news.createdAt).toLocaleDateString() : 'N/A'} | By: {news.author?.name || 'Admin'}
      </p>
      <img 
        src={news.image || fallbackImage} 
        alt={news.title} 
        className="w-full h-96 object-cover rounded-xl mb-8 shadow bg-gray-100" 
        onError={(e) => { e.target.src = fallbackImage; }}
      />
      <div className="prose max-w-none text-gray-700 leading-relaxed text-lg whitespace-pre-line">
        {news.content}
      </div>
    </div>
  );
}