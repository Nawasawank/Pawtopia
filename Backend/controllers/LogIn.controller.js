import LoginService from '../services/LogIn.services.js';

const LoginController = {
    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        try {
            const result = await LoginService.loginUser(email, password);

            if (result.error) {
                const status = (result.error === 'Email not found' || result.error === 'Invalid Password') ? 401 : 500;
                return res.status(status).json({ error: result.error });
            }

            const { token, role } = result;  
            return res.json({ token, role });
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export default LoginController;
