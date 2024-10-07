export default function (sequelize, Sequelize) {
    const User = sequelize.define('User', {
        user_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        tel: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
    }, {
        timestamps: true,
        paranoid: true,
        freezeTableName: true
    });

    // Define the association in a static method
    User.associate = function (models) {
        User.hasMany(models.Pet, {
            foreignKey: 'user_id',
            as: 'pets',
            onDelete: 'CASCADE'
        });
    };

    return User;
}
