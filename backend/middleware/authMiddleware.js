const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer')) {
    try {
      // 'Bearer <token>' থেকে শুধু টোকেন অংশটুকু আলাদা করা
      token = token.split(' ')[1];

      // টোকেন ভেরিফাই করা
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // ডিকোড করা ইউজার ইনফো request অবজেক্টে সেভ করা
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token Verification Error:', error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = protect;