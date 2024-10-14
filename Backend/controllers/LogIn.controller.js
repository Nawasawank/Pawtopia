import {loginUser} from '../services/LogIn.services.js' 

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await loginUser(email, password);
        if (result.error) {
            const status = (result.error === 'User not found' || result.error === 'Invalid credentials') ? 401 : 500;
            return res.send(result.error);
        }
        return res.json({ token: result.token });
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
}; 