import AdminService from '../services/Admin.service.js';

const AdminController = {
    async AdminSignUp(req, res) {
        const { firstname, lastname, email, password, confirm_password } = req.body;

        try {
            const result = await AdminService.AdminSignUp(
                firstname,
                lastname,
                email,
                password,
                confirm_password
            );

            if (result.error) {
                if (result.error === 'Email already exists' || result.error === 'Phone number already exists' || result.error === 'No matching employee found'
                    || result.error === `Password doesn't Match!`
                ) {
                    return res.status(400).json({ error: result.error });
                }
            }


            const adminInfo = {
                firstname: result.firstName,
                lastname: result.lastName,
                email: result.email,
            };

            return res.status(201).json({ message: "Admin sign up successful", admin: adminInfo });

        } catch (error) {
            console.error(`Unexpected error: ${error.message}`);
            return res.status(500).send('Internal Server Error');
        }
    },
    async AdminLogIn(req, res) {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        try {
            const result = await AdminService.AdminLogIn(email, password);

            if (result.error) {
                const status = (result.error === 'Email not found' || result.error === 'Invalid Password') ? 401 : 500;
                return res.status(status).json({ error: result.error });
            }

            return res.json({ token: result.token });
        } catch (error) {
            console.error(`Unexpected error during login: ${error.message}`);
            return res.status(500).send('Internal Server Error');
        }
    }
};

export default AdminController;
