const express = require('express');
const router = express.Router();
const { 
  createNews, 
  getUserNews, 
  getAllNews, 
  updateNews, 
  getNewsById,
  deleteNews 
} = require('../controllers/newsController');
const protect = require('../middleware/authMiddleware');

router.get('/', getAllNews);
router.get('/user', protect, getUserNews);
router.post('/', protect, createNews);
router.put('/:id', protect, updateNews);
router.delete('/:id', protect, deleteNews);
router.get('/:id', getNewsById);

module.exports = router;