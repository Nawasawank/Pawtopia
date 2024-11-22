import DeveloperService from '../services/Developer.service.js';

const DeveloperController = {
    async DeveloperSignUp(req, res) {
        const { firstname, lastname, email, password } = req.body;
        const role  = 'default';

        try {
            const result = await DeveloperService.DeveloperSignUp(
                firstname,
                lastname,
                email,
                password,
                role
            );

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            const developerInfo = {
                firstname: result.first_name,
                lastname: result.last_name,
                email: result.email,
            };

            return res.status(201).json({ message: 'Developer sign up successful', developer: developerInfo });
        } catch (error) {
            console.error(`Unexpected error: ${error.message}`);
            return res.status(500).send('Internal Server Error');
        }
    },
};

export default DeveloperController;
