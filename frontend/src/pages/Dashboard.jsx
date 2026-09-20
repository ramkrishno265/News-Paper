import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

// Local SVG Fallback to completely eliminate external placeholder network errors
const fallbackAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";

export default function Dashboard() {
  const [userNews, setUserNews] = useState([]);
  const [profile, setProfile] = useState({ name: '', email: '', bio: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  
  const [savingProfile, setSavingProfile] = useState(false);

  // Edit News Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentNewsId, setCurrentNewsId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', category: '', content: '', image: '' });
  const [updating, setUpdating] = useState(false);

  // Helper function to clean and format image URLs properly
  const cleanUrl = (url) => {
    if (!url || url.includes('placeholder') || url.includes('placenoider')) {
      return '';
    }
    // If it's a local backend upload path, prepend backend base URL
    if (url.startsWith('/uploads')) {
      return `http://localhost:5000${url}`;
    }
    return url;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    Promise.all([
      API.get('/api/users/profile', config).catch(() => ({ data: { name: 'User', email: '', bio: '', avatar: '' } })),
      API.get('/api/news/user', config)
    ])
      .then(([profileRes, newsRes]) => {
        const userData = profileRes.data.user || profileRes.data;
        setProfile({
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || 'News Contributor & Writer',
          avatar: cleanUrl(userData.avatar)
        });
        
        const rawNews = newsRes.data.news || newsRes.data;
        const cleanedNews = rawNews.map(item => ({
          ...item,
          image: cleanUrl(item.image)
        }));
        setUserNews(cleanedNews);
      })
      .catch(err => {
        console.error('Dashboard Data Fetch Error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Handle Profile Update (Using JSON payload for direct URL submission)
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const token = localStorage.getItem('token');

      const res = await API.put('/api/users/profile', {
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Updated successfully:', res.data);
      const updatedUser = res.data.user || res.data;
      setProfile(prev => ({
        ...prev,
        name: updatedUser.name || prev.name,
        bio: updatedUser.bio || prev.bio,
        avatar: cleanUrl(updatedUser.avatar) || prev.avatar
      }));
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Profile Update Error:', err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  // Delete News Handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      const token = localStorage.getItem('token');
      try {
        await API.delete(`/api/news/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserNews(userNews.filter(item => item._id !== id));
        alert('News deleted successfully!');
      } catch (err) {
        console.error('Delete Error:', err);
        alert(err.response?.data?.message || 'Failed to delete news');
      }
    }
  };

  // Open Edit Modal & Load Data
  const handleOpenEditModal = (news) => {
    setCurrentNewsId(news._id);
    setEditFormData({
      title: news.title || '',
      category: news.category || '',
      content: news.content || '',
      image: cleanUrl(news.image)
    });
    setIsEditModalOpen(true);
  };

  // Handle Edit Form Submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const token = localStorage.getItem('token');

    try {
      const res = await API.put(`/api/news/${currentNewsId}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedNewsItem = res.data.news;
      setUserNews(userNews.map(item => item._id === currentNewsId ? { ...updatedNewsItem, image: cleanUrl(updatedNewsItem.image) } : item));
      setIsEditModalOpen(false);
      alert('News updated successfully!');
    } catch (err) {
      console.error('Update Error:', err);
      alert(err.response?.data?.message || 'Failed to update news');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-lg font-medium text-gray-600">Loading Dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      
      {/* 1. Profile & Settings Section with Image URL Input */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Settings & Overview</h3>
        
        <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Left: Avatar Preview */}
          <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="relative w-28 h-28 mb-4 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center shadow-md border-4 border-white">
              <img 
                src={profile.avatar || fallbackAvatar} 
                alt="Profile Preview" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = fallbackAvatar; }}
              />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">{profile.name || 'User'}</h4>
            <p className="text-xs text-gray-500 mt-1">{profile.email}</p>
          </div>

          {/* Right: Info Form & Avatar URL Input */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Locked)</label>
                <input 
                  type="email" 
                  className="w-full p-3 border rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                  value={profile.email}
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avatar Image URL</label>
              <input 
                type="url" 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={profile.avatar}
                onChange={(e) => setProfile({...profile, avatar: e.target.value})}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
              <textarea 
                rows="2"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                placeholder="Write something about yourself..."
              ></textarea>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-sm font-medium text-gray-600">
                Total Articles: <span className="font-bold text-blue-600">{userNews.length}</span>
              </div>
              <button 
                type="submit" 
                disabled={savingProfile}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow disabled:opacity-50"
              >
                {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>

        </form>
      </div>

      {/* 2. User News List Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Your Published News</h3>
          <Link 
            to="/create-news" 
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow"
          >
            + Create New Article
          </Link>
        </div>

        {userNews.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-500 mb-4">You haven't published any news yet.</p>
            <Link to="/create-news" className="text-blue-600 font-semibold hover:underline">
              Publish your first news &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userNews.map(news => (
              <div 
                key={news._id} 
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition gap-4"
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={news.image || fallbackAvatar} 
                    alt={news.title} 
                    className="w-20 h-16 object-cover rounded-lg shadow-sm bg-gray-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackAvatar;
                    }}
                  />
                  <div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                      {news.category}
                    </span>
                    <h4 className="font-bold text-gray-900 text-lg mt-1 line-clamp-1">{news.title}</h4>
                    <p className="text-xs text-gray-400">
                      Published on: {news.createdAt ? new Date(news.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Actions: Edit & Delete */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button 
                    onClick={() => handleOpenEditModal(news)} 
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(news._id)} 
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Edit News Modal Pop-up */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-xl font-bold text-gray-800">Edit News Article</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">News Title</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={editFormData.title}
                  onChange={e => setEditFormData({...editFormData, title: e.target.value})} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={editFormData.category}
                  onChange={e => setEditFormData({...editFormData, category: e.target.value})} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={editFormData.image}
                  onChange={e => setEditFormData({...editFormData, image: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea 
                  rows="4" 
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={editFormData.content}
                  onChange={e => setEditFormData({...editFormData, content: e.target.value})} 
                  required
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={updating}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}