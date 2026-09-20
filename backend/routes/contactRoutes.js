const router = require('express').Router();
const { submitContactForm, getAllContacts } = require('../controllers/contactController');
const protect = require('../middleware/authMiddleware');

// 1. Public route (লগইন ছাড়াই যে কেউ মেসেজ পাঠাতে পারবে, তাই 'protect' বাদ দেওয়া হয়েছে)
router.post('/', submitContactForm);

// 2. Protected route (শুধু লগইন করা ইউজার/অ্যাডমিন ড্যাশবোর্ড থেকে মেসেজগুলো দেখতে পাবে)
router.get('/', protect, getAllContacts);

module.exports = router;