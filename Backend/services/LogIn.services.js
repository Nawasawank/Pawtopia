import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, Admin, Developer } from '../database.js';

const LoginService = {
    async loginUser(email, password) {
        try {
            let user = await User.findUserByEmail(email);
            let role = 'user';

            if (!user) {
                user = await Admin.findAdminByEmail(email);
                role = 'admin';
            }
            
            if (!user) {
                user = await Developer.findDeveloperByEmail(email);
                role = 'developer';
            }

            if (!user) {
                return { error: 'Email not found' };
            }

            console.log(user);
            console.log(role)
            

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { error: 'Invalid Password' };
            }

            const token = jwt.sign(
                { id: user.user_id || user.employee_id || user.developer_id, username: user.firstName || user.first_name, role },
                process.env.JWT_SECRET,
                { expiresIn: '3h' }
            );

            return { token, role };

        } catch (error) {
            console.error('Login Service Error:', error);
            return { error: 'Something went wrong during login' };
        }
    }
};

export default LoginService;
