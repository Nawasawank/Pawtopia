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

            // Create the user and fetch the insertId
            const newUser = await User.createUser({
                firstName: firstname,
                lastName: lastname,
                email,
                tel,
                password: hashedPassword,
                image: defaultImagePath
            }, 'default');

            console.log("user_id: newUser.insertId", newUser.insertId);

            // Create the pet with the new user ID
            const newPet = await Pet.createPet({
                user_id: newUser.insertId, // Correctly use the insertId here
                name,
                type,
                gender,
                weight,
                health_condition_id
            }, 'default');

            console.log("Pet creation result:", newPet);

            console.log(newPet)

            return { ...newUser, image: defaultImagePath };
        } catch (error) {
            console.error(`Error creating user: ${error.message}`);
            return { error: 'Error creating user' };
        }
    }
};

export default SignUpService;

