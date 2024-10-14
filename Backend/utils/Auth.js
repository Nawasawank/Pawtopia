import jwt from 'jsonwebtoken';  // Ensure this is imported

export const isAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('No token, authorization denied');  // Use res.status().send()
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('User ID:', req.user.id);
        next();
    } catch (err) {
        console.log('Token verification failed:', err.message);
        return res.status(401).send('Token is not valid');  // Use res.status().send()
    }
};
