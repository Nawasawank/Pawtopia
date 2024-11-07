import bcrypt from 'bcryptjs';
import { User, Pet } from '../database.js';

const SignUpService = {
    async registerUser(firstname, lastname, email, password, tel, name, type, gender, weight, health_condition_id) {
        try {
            console.log(health_condition_id);
            const existingUserByEmail = await User.findUserByEmail(email);
            if (existingUserByEmail) {
                console.warn(`Email already exists: ${email}`);
                return { error: 'Email already exists' };
            }

            const existingUserByTel = await User.findUserByTel(tel);
            if (existingUserByTel) {
                console.warn(`Phone number already exists: ${tel}`);
                return { error: 'Phone number already exists' };
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const defaultImagePath = '/uploads/profile-images/default.jpg';

            // Create user with default image if no image is specified
            const newUser = await User.createUser({
                firstName: firstname,
                lastName: lastname,
                email,
                tel,
                password: hashedPassword,
                image: defaultImagePath 
            });

            const newPet = await Pet.createPet({
                user_id: newUser.insertId,
                name,
                type,
                gender,
                weight,
                health_condition_id
            });

            return { ...newUser, image: defaultImagePath }; 
        } catch (error) {
            console.log(`Error creating user: ${error.message}`);
            return { error: 'Error creating user' };
        }
    }
};

export default SignUpService;
