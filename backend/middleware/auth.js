const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is invalid' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.warn(`AUTH DENIED: User ${req.user.username} has role "${req.user.role}", but needs one of: ${roles.join(', ')}`);
            return res.status(403).json({ message: `User role ${req.user.role} is not authorized` });
        }
        next();
    };
};
