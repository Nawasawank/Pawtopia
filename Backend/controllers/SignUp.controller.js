import SignUpService from '../services/SignUp.services.js';

const SignUpController = {
    async register(req, res) {
        const { firstname, lastname, email, password, tel, name, type, gender, weight, vaccination, health_condition } = req.body;

        try {
            const result = await SignUpService.registerUser(
                firstname,
                lastname,
                email,
                password,
                tel,
                name,
                type,
                gender,
                weight,
                vaccination,
                health_condition
            );

            if (result.error) {
                if (result.error === 'Email already exists' || result.error === 'Phone number already exists') {
                    return res.status(400).json({ error: result.error });
                }
            }

            const userInfo = {
                id: result.user_id,
                firstname: result.firstName,
                lastname: result.lastName,
                email: result.email,
                tel: result.tel,
                pet: {
                    name,
                    type,
                    gender,
                    weight,
                    vaccination,
                    health_condition
                }
            };

            return res.status(201).json({ message: "Sign up successful", user: userInfo });

        } catch (error) {
            console.error(`Unexpected error: ${error.message}`);
            return res.status(500).send('Internal Server Error');
        }
    }
};

export default SignUpController;
