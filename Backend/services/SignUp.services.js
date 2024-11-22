import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import Pet from '../models/Pet.model.js';

const SignUpService = {
    async registerUser(firstname, lastname, email, password, tel, name, type, gender, weight, health_condition_id) {
        try {
            const existingUserByEmail = await User.findUserByEmail(email, 'default');
            if (existingUserByEmail) {
                console.warn(`Email already exists: ${email}`);
                return { error: 'Email already exists' };
            }

            const existingUserByTel = await User.findUserByTel(tel, 'default');
            if (existingUserByTel) {
                console.warn(`Phone number already exists: ${tel}`);
                return { error: 'Phone number already exists' };
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const defaultImagePath = '/uploads/default.png';

            const newUser = await User.createUser({
                firstName: firstname,
                lastName: lastname,
                email,
                tel,
                password: hashedPassword,
                image: defaultImagePath
            }, 'default');

            const newPet = await Pet.createPet({
                user_id: newUser.insertId,
                name,
                type,
                gender,
                weight,
                health_condition_id
            }, 'default');

            console.log(newPet)

            return { ...newUser, image: defaultImagePath };
        } catch (error) {
            console.log(`Error creating user: ${error.message}`);
            return { error: 'Error creating user' };
        }
    }
};

export default SignUpService;
