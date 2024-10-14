import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../database.js'; 

export const loginUser = async (email, password) => {
    try {
        const user = await User.findUserByEmail(email);

        if (!user) {
            return { error: 'Email not found' };
        }

        console.log(password)
        console.log(user.password)
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch)
        if (!isMatch) {
            return { error: 'Invalid Password' };
        }

        const token = jwt.sign(
            { id: user.user_id, username: user.firstName },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } 
        );

        return { token };

    } catch (error) {
        console.error('Login Service Error:', error);
        return { error: 'Something went wrong during login' };
    }
};
