const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Get token
    const authHeader = req.headers['authorization'];
    
    // Cek apakah authorization header ada atau tidak
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Ambil token dan cek apakah menggunakan format "Bearer"
    const token = authHeader.replace('Bearer ', '');

    // Cek apakah token kosong atau tidak setelah diparsing
    if (!token) {
        return res.status(401).json({ message: 'Unauthenticated.' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;
