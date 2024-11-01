import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../database.js';

const LoginService = {
    async loginUser(email, password) {
        try {
            const user = await User.findUserByEmail(email);

            if (!user) {
                return { error: 'Email not found' };
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { error: 'Invalid Password' };
            }

            const token = jwt.sign(
                { id: user.user_id, username: user.firstName },
                process.env.JWT_SECRET,
                { expiresIn: '3h' }
            );

            return { token };

        } catch (error) {
            console.error('Login Service Error:', error);
            return { error: 'Something went wrong during login' };
        }
    }
};

export default LoginService;
