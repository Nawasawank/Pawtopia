import bcrypt from 'bcrypt';
import db from '../database.js';

const { User, Pet } = db;

export const registerUser = async (firstname, lastname, email, password, tel, name, type, gender, weight, vaccination, health_condition) => {
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.warn(`Email already exists: ${email}`);
            return { error: 'Email already exists' };
        }

        const existingUserByTel = await User.findOne({ where: { tel } });
        if (existingUserByTel) {
            console.warn(`Phone number already exists: ${tel}`);
            return { error: 'Phone number already exists' };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstName: firstname,
            lastName: lastname,
            email,
            tel,
            password: hashedPassword
        });

        const newPet = await Pet.create({
            user_id: newUser.user_id,
            name,
            type,
            gender,
            weight,
            vaccination,
            health_condition
        });

        return newUser;

    } catch (error) {
        console.log(`Error creating user: ${error.message}`);
        return { error: 'Error creating user' };
    }
};
