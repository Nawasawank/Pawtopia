import bcrypt from 'bcryptjs';
import Developer from '../models/Developer.model.js';

const DeveloperService = {
    async DeveloperSignUp(firstname, lastname, email, password,role) {
        try {
            console.log(role)
            // Check if a developer with the given email already exists
            const existingDeveloper = await Developer.findDeveloperByEmail(email,role);
            if (existingDeveloper) {
                console.warn(`Developer with email already exists: ${email}`);
                return { error: 'Developer with this email already exists' };
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create the developer
            const newDeveloper = await Developer.createDeveloper({
                first_name: firstname,
                last_name: lastname,
                email,
                password: hashedPassword,
                role
            });

            return newDeveloper;
        } catch (error) {
            console.error(`Error creating developer: ${error.message}`);
            return { error: 'Error creating developer' };
        }
    },
};

export default DeveloperService;
