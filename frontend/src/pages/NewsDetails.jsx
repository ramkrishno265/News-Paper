import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function NewsDetails() {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/news/${id}`)
      .then(res => setNews(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!news) return <div className="text-center py-20 text-lg">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{news.title}</h1>
      <p className="text-gray-500 text-sm mb-6">Published on: {new Date(news.createdAt).toLocaleDateString()} | By: {news.author?.name || 'Admin'}</p>
      <img src={news.image || "https://via.placeholder.com/800x400"} alt={news.title} className="w-full h-96 object-cover rounded-xl mb-8 shadow" />
      <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
        {news.content}
      </div>
    </div>
  );
}