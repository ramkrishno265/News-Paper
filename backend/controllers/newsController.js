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

module.exports = { createNews, getUserNews, getAllNews };