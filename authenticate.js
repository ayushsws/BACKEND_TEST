const jwt = require('jsonwebtoken');
const SECRET = 'your-secret-key';

const authenticate = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, SECRET);
        return decoded.userId;
    } catch (err) {
        return null;
    }
};

module.exports = authenticate;
