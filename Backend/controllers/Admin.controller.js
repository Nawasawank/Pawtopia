import AdminService from '../services/Admin.service.js';

const AdminController = {
    async AdminSignUp(req, res) {
        const { firstname, lastname, email, password } = req.body;
        const role  = 'default'; 

        try {
            const result = await AdminService.AdminSignUp(
                firstname,
                lastname,
                email,
                password,
                role  
            );

            if (result.error) {
                return res.status(400).json({ error: result.error });
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
};

export default AdminController;
