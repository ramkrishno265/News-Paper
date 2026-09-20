const News = require('../models/News');

// 1. Create News Logic (Protected)
const createNews = async (req, res) => {
  try {
    const { title, category, content, image } = req.body;

    const newNews = new News({
      title,
      category,
      content,
      image,
      author: req.user.id // protect middleware থেকে আসা user id
    });

    await newNews.save();

    res.status(201).json({
      success: true,
      message: 'News published successfully!',
      news: newNews
    });
  } catch (error) {
    console.error('Create News Error:', error);
    res.status(500).json({ success: false, message: 'Server error while publishing news' });
  }
};

// 2. Get Logged-in User's News (For Dashboard - Protected)
const getUserNews = async (req, res) => {
  try {
    const news = await News.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, news });
  } catch (error) {
    console.error('Get User News Error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching news' });
  }
};

// 3. Get All News (Public - Home / All News Page)
const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }).populate('author', 'name email');
    res.status(200).json({ success: true, news });
  } catch (error) {
    console.error('Get All News Error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching news' });
  }
};

// 4. Update News Logic (Protected - Only Author Can Update)
const updateNews = async (req, res) => {
  try {
    const newsId = req.params.id;
    let news = await News.findById(newsId);

    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    // চেক করা যে ইউজার নিউজটি তৈরি করেছে কিনা (Security check)
    if (news.author.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this news' });
    }

    // ডেটা আপডেট করা
    const { title, category, content, image } = req.body;
    news.title = title || news.title;
    news.category = category || news.category;
    news.content = content || news.content;
    news.image = image !== undefined ? image : news.image;

    const updatedNews = await news.save();

    res.status(200).json({
      success: true,
      message: 'News updated successfully!',
      news: updatedNews
    });
  } catch (error) {
    console.error('Update News Error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating news' });
  }
};

// 5. Delete News Logic (Protected - Only Author Can Delete)
const deleteNews = async (req, res) => {
  try {
    const newsId = req.params.id;
    const news = await News.findById(newsId);

    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    // চেক করা যে ইউজার নিউজটি তৈরি করেছে কিনা
    if (news.author.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this news' });
    }

    await news.deleteOne();

    res.status(200).json({
      success: true,
      message: 'News deleted successfully!'
    });
  } catch (error) {
    console.error('Delete News Error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting news' });
  }
};
const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'name email');
    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }
    res.status(200).json({ success: true, news });
  } catch (error) {
    console.error('Get Single News Error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching news' });
  }
};

module.exports = { 
  createNews, 
  getUserNews, 
  getAllNews, 
  updateNews, 
  getNewsById, 
  deleteNews 
};