const express = require('express');
const router = express.Router();
const { createNews, getUserNews, getAllNews } = require('../controllers/newsController');
const protect = require('../middleware/authMiddleware');

// GET: /api/news (Public - সবার জন্য সব নিউজ দেখানোর জন্য)
router.get('/', getAllNews);

// GET: /api/news/user (Protected - লগইন করা ইউজারের ড্যাশবোর্ডের জন্য)
// *নোট: এটি ডাইনামিক আইডি রাউটের উপরে রাখবেন যাতে 'user' কে আইডি হিসেবে কাউন্ট না করে*
router.get('/user', protect, getUserNews);

// POST: /api/news (Protected - নিউজ ক্রিয়েট করার জন্য)
router.post('/', protect, createNews);

module.exports = router;