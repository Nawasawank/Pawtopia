import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.model.js';
import User from '../models/User.model.js';
import Developer from '../models/Developer.model.js';

const LoginService = {
    async loginUser(email, password) {
        try {
            let user;
            let role;

            // Check for user
            const userRecord = await User.findUserByEmail(email,'default');
            if (userRecord) {
                user = userRecord;
                role = 'user'; // Role is user
            }

            if (!user) {
                const adminRecord = await Admin.findAdminByEmail(email,'default'); 
                if (adminRecord) {
                    user = adminRecord;
                    role = 'admin'; 
                }
            }

            if (!user) {
                const developerRecord = await Developer.findDeveloperByEmail(email,'default');
                if (developerRecord) {
                    user = developerRecord;
                    role = 'developer';
                }
            }

            if (!user) {
                return { error: 'Email not found' };
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { error: 'Invalid Password' };
            }
            const token = jwt.sign(
                { id: user.user_id || user.employee_id || user.developer_id, role },
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
