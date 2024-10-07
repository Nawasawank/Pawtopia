export default function (sequelize, Sequelize) {
    const Pet = sequelize.define('Pets', {
        pet_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        vaccination: {
            type: Sequelize.STRING,
            allowNull: false
        },
        gender: {
            type: Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Health_Condition: {
            type: Sequelize.STRING,
            allowNull: true
        },
        weight: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        timestamps: true,
        paranoid: true,
        freezeTableName: true
    });

    Pet.associate = function (models) {
        Pet.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE'
        });
    };

    return Pet;
}
