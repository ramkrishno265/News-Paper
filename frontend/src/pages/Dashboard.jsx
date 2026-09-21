import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

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

  const categories = ['Technology', 'Business', 'Sports', 'Entertainment', 'Politics', 'Health', 'General'];

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
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

  const handleOpenEditModal = (news) => {
    setCurrentNewsId(news._id);
    setEditFormData({
      title: news.title || '',
      category: news.category || categories[0],
      content: news.content || '',
      image: cleanUrl(news.image)
    });
    setIsEditModalOpen(true);
  };

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
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium text-sm">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 1. Profile Settings Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Profile Settings & Overview</h3>
          
          <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Avatar Preview Box */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="relative w-28 h-28 mb-4 bg-slate-200 rounded-full overflow-hidden shadow-md border-4 border-white flex items-center justify-center">
                <img 
                  src={profile.avatar || fallbackAvatar} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = fallbackAvatar; }}
                />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">{profile.name || 'User'}</h4>
              <p className="text-xs text-slate-500 mt-0.5 break-all">{profile.email}</p>
            </div>

            {/* Profile Form Fields */}
            <div className="lg:col-span-2 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm font-medium"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address (Locked)</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed outline-none text-sm font-medium"
                    value={profile.email}
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Avatar Image URL</label>
                <input 
                  type="url" 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm font-medium"
                  value={profile.avatar}
                  onChange={(e) => setProfile({...profile, avatar: e.target.value})}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Short Bio</label>
                <textarea 
                  rows="2"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm font-normal"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder="Write something about yourself..."
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4">
                <div className="text-sm font-medium text-slate-600">
                  Total Articles: <span className="font-bold text-blue-600">{userNews.length}</span>
                </div>
                <button 
                  type="submit" 
                  disabled={savingProfile}
                  className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-600/25 disabled:opacity-50 text-sm"
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* 2. User News List Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-xl font-bold text-slate-900">Your Published News</h3>
            <Link 
              to="/create-news" 
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-600/25"
            >
              + Create New Article
            </Link>
          </div>

          {userNews.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <p className="text-slate-500 mb-3 text-sm">You haven't published any news yet.</p>
              <Link to="/create-news" className="text-blue-600 font-semibold hover:underline text-sm">
                Publish your first news &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userNews.map(news => (
                <div 
                  key={news._id} 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/80 transition gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img 
                      src={news.image || fallbackAvatar} 
                      alt={news.title} 
                      className="w-20 h-16 object-cover rounded-xl shadow-sm bg-slate-100 flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackAvatar;
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {news.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-1 truncate">{news.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Published on: {news.createdAt ? new Date(news.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => handleOpenEditModal(news)} 
                      className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-200 transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(news._id)} 
                      className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-rose-100 transition"
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
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 relative border border-slate-100">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">Edit News Article</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-xl leading-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">News Title</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm font-medium" 
                    value={editFormData.title}
                    onChange={e => setEditFormData({...editFormData, title: e.target.value})} 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm font-medium"
                    value={editFormData.category}
                    onChange={e => setEditFormData({...editFormData, category: e.target.value})}
                    required
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Image URL</label>
                  <input 
                    type="url" 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm font-medium" 
                    value={editFormData.image}
                    onChange={e => setEditFormData({...editFormData, image: e.target.value})} 
                    placeholder="https://example.com/image.jpg"
                  />
                  {editFormData.image && (
                    <div className="mt-2 relative h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img 
                        src={editFormData.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Content</label>
                  <textarea 
                    rows="5" 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm font-normal" 
                    value={editFormData.content}
                    onChange={e => setEditFormData({...editFormData, content: e.target.value})} 
                    required
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="submit" 
                    disabled={updating}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-600/25 disabled:opacity-50 text-sm"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)}
                    className="bg-slate-100 text-slate-700 px-5 py-3 rounded-xl font-semibold hover:bg-slate-200 transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}