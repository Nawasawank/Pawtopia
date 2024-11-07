import jwt from 'jsonwebtoken';

export const isAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Auth Header:", authHeader); // Log the authorization header
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("No token provided"); // Log if no token is found
        return res.status(401).send('No token, authorization denied');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded User:", decoded); // Log the decoded user
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err); // Log error details
        if (err.name === 'TokenExpiredError') {
            return res.status(403).send('Token expired');
        }
        return res.status(401).send('Token is not valid');
    }
};

