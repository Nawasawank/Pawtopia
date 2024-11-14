import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.model.js';
import Admin from '../models/Admin.model.js';

const AdminService = {
    async AdminSignUp(firstname, lastname, email, password, role) {  // Accept role as parameter
        console.log(role)
        try {
            const existingEmployee = await Employee.findEmployeeByDetails(firstname, lastname, email,role);
            if (!existingEmployee) {
                console.warn(`No matching employee found for ${firstname} ${lastname}, ${email}`);
                return { error: 'No matching employee found' };
            }
            const existingAdminByEmail = await Admin.findAdminByEmail(email, role);  // Pass role
            if (existingAdminByEmail) {
                console.warn(`Admin with email already exists: ${email}`);
                return { error: 'Admin with this email already exists' };
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const emp_id = existingEmployee.employee_id;

            const newAdmin = await Admin.createAdmin({
                firstName: firstname,
                lastName: lastname,
                email,
                password: hashedPassword,
                employee_id: emp_id
            }, role);  // Pass role to Admin model

            return newAdmin;

        } catch (error) {
            console.error(`Error creating admin: ${error.message}`);
            return { error: 'Error creating admin' };
        }
    },

    async AdminLogIn(email, password) {
        try {
            const admin = await Admin.findAdminByEmail(email);
            if (!admin) {
                console.warn(`Email not found: ${email}`);
                return { error: 'Email not found' };
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                console.warn('Invalid Password');
                return { error: 'Invalid Password' };
            }

            const token = jwt.sign(
                { adminId: admin.admin_id, email: admin.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return { token };
        } catch (error) {
            console.error(`Error during admin login: ${error.message}`);
            return { error: 'Error during login' };
        }
    },
};

export default AdminService;
